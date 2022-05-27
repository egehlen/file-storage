import { RenameFileRequestDto } from './dto/rename-request.dto';
import { CryptoService } from 'src/shared/crypto.service';
import { StorageService } from './storage.service';
import { DatabaseService } from 'src/db/database.service';
import { Injectable } from '@nestjs/common';
import { UploadRequestDto } from './dto/upload-request.dto';
import * as sharp from 'sharp';
import { UploadResultDto } from './dto/upload-result.dto';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { isNullOrEmpty, getThumbnailName } from 'src/shared/utilities';
import { FileDto } from './dto/file.dto';
import { DownloadResultDto } from './dto/download-result.dto';

@Injectable()
export class FilesService {
    private readonly allowedFileTypes = ['jpg','jpeg','png','zip','pdf','docx','xlsx'];
    private readonly thumbnailWidth: number = 200;
    private readonly limitSettings = {
        maxSingleFileSize: 5 * 1024 * 1024, // 5mb
        maxQuotaUsagePerAccount: 100 * 1024 * 1024 // 100mb
    };

    constructor(
        private readonly dbService: DatabaseService,
        private readonly cryptoService: CryptoService,
        private readonly storageService: StorageService
    ) { }

    async create(uploadRequest: UploadRequestDto, file: Express.Multer.File): Promise<UploadResultDto> {
        /* Validation */
        if (!this.validateRequest(uploadRequest)) {
            return { success: false, message: 'Could not complete the operation: missing upload data.' };
        }

        const fileValidationResult = await this.validateFile(file);
        if (!fileValidationResult.valid) {
            return { success: false, message: fileValidationResult.message };
        }

        // Generate thumbnail before all uploads
        const hasThumbnail = this.hasThumbnail(file.originalname);
        let thumbContent: Buffer = null
        let thumbFileName = '';

        if (hasThumbnail) {
            thumbContent = await this.generateThumbnail(file);
            thumbFileName = getThumbnailName(file.originalname);
        }

        // Then evaluate the storage use of main file + thumbnail (if applicable)
        const quotaValidationResult = await this.validateQuota(
            uploadRequest.accountId,
            file.buffer.byteLength,
            hasThumbnail ? thumbContent.byteLength : null
        );

        if (!quotaValidationResult.valid) {
            return { success: false, message: quotaValidationResult.message };
        }

        /* Upload main file */
        const encryptedFile = this.cryptoService.encrypt(file.buffer, uploadRequest.accountId);
        const uploadResult = await this.storageService.upload(uploadRequest.accountId, uploadRequest.correlationId, file.originalname, encryptedFile);

        /* Upload thumbnail */
        let thumbUploadResult: ManagedUpload.SendData;

        if (hasThumbnail) {
            thumbUploadResult = await this.storageService.upload(
                uploadRequest.accountId,
                uploadRequest.correlationId,
                thumbFileName,
                thumbContent
            );
        }

        if (hasThumbnail) {
            const thumbContent = await this.generateThumbnail(file);
            const thumbFileName = getThumbnailName(file.originalname);

            thumbUploadResult = await this.storageService.upload(
                uploadRequest.accountId,
                uploadRequest.correlationId,
                thumbFileName,
                thumbContent
            );
        }

        /* Write to database */
        const createFile = this.dbService.file.create({
            data: {
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                contentKey: uploadResult.Key,
                thumbnailKey: thumbUploadResult?.Key,
                thumbnailUrl: thumbUploadResult?.Location,
                owner: {
                    connect: {
                        id: uploadRequest.accountId
                    }
                }
             },
            select: { id: true }
        });

        const updateQuota = this.dbService.quota.upsert({
            where: { accountId: uploadRequest.accountId },
            update: {
                totalUsed: quotaValidationResult.totalAfterUpload
            },
            create: {
                accountId: uploadRequest.accountId,
                totalUsed: quotaValidationResult.totalAfterUpload
            }
        });

        const [newFile] = await Promise.all([createFile, updateQuota]);
        
        /* Get direct url for thumbnail */
        const presignedUrl = hasThumbnail ? 
            await this.storageService.getPreSignedUrl(thumbUploadResult.Key) :
            '';

        return {
            id: newFile.id,
            success: true,
            message: 'Upload successful!',
            address: presignedUrl
        };
    }

    async getAll(accountId: string): Promise<FileDto[]> {
        const files = await this.dbService.file.findMany({
            where: { ownerId: accountId }
        });

        const result = await Promise.all(files.map(async(file) => {
            const thumbnailUrl = !isNullOrEmpty(file.thumbnailKey) ?
                await this.storageService.getPreSignedUrl(file.thumbnailKey) : '';

            return { ...file, thumbnailUrl };
        }));
        
        return result;
    }

    async getOne(fileId: string): Promise<FileDto> {
        const file = await this.dbService.file.findUnique({
            where: { id: fileId }
        });

        const thumbnailUrl = !isNullOrEmpty(file.thumbnailKey) ?
            await this.storageService.getPreSignedUrl(file.thumbnailKey) : '';

        return { ...file, thumbnailUrl };
    }

    async download(fileId: string): Promise<DownloadResultDto> {
        const file = await this.dbService.file.findUnique({
            where: { id: fileId }
        });

        const readableContent = await this.storageService.download(file.contentKey);
        const chunks = [];

        for await (const chunk of readableContent) {
            chunks.push(chunk);
        }

        const bufferContent = Buffer.concat(chunks);
        const decryptedContent = this.cryptoService.decrypt(bufferContent, file.ownerId);

        return {
            name: file.name,
            type: file.type,
            size: file.size,
            content: decryptedContent
        };
    }

    async update(fileId: string, request: RenameFileRequestDto): Promise<boolean> {
        const file = await this.dbService.file.findUnique({
            where: { id: fileId },
            select: {
                name: true,
                contentKey: true,
                thumbnailKey: true
            }
        });

        if (!!file && !isNullOrEmpty(file.name) && !isNullOrEmpty(file.contentKey)) {
            const newFileKey = await this.storageService.rename(request.accountId, file, request.newName);
            let newThumbKey = '';

            if (!isNullOrEmpty(file.thumbnailKey)) {
                const newThumbName = getThumbnailName(request.newName);
                newThumbKey = await this.storageService.rename(request.accountId, file, newThumbName);
            }

            await this.dbService.file.update({
                where: { id: fileId },
                data: {
                    name: request.newName,
                    contentKey: newFileKey,
                    thumbnailKey: newThumbKey
                }
            });

            return true;
        }

        return false;
    }

    async remove(id: string) {
        const file = await this.dbService.file.findUnique({
            where: { id }
        });

        await this.storageService.remove(file.contentKey, file.thumbnailKey);
    }

    async getQuota(accountId: string): Promise<number> {
        const quota = await this.dbService.quota.findUnique({
            where: { accountId }
        });

        return !!quota ? quota.totalUsed : 0;
    }

    async getQuotaUsage(accountId: string): Promise<number> {
        const total = await this.getQuota(accountId);

        if (total > 0) {
            // Calc the current usage % for the account
            return Math.round((total / this.limitSettings.maxQuotaUsagePerAccount) * 100);
        }

        return 0;
    }

    validateRequest(request: UploadRequestDto): boolean {
        return (typeof request !== 'undefined' && request !== null) &&
            (!isNullOrEmpty(request.accountId)) &&
            (!isNullOrEmpty(request.correlationId));
    }

    async validateFile(file: Express.Multer.File): Promise<{ valid: boolean, message: string }> {
        // Check if the file buffer is valid
        try {
            const validFile = typeof file !== 'undefined' && file !== null;
            const validBuffer = typeof file.buffer !== 'undefined' && file.buffer !== null;
            const validLength = file.buffer.byteLength > 0;

            if (!validFile || !validBuffer || !validLength)
                return { valid: false, message: 'File contents was empty.' };
        } catch (_) {
            return { valid: false, message: 'File contents was empty.' };
        }

        // Check if the file has a valid extension and its type is allowed
        try {
            const fileExtension = file.originalname.split('.').length > 0 ? file.originalname.split('.').pop() : '';
            const validExtension = this.allowedFileTypes.includes(fileExtension);

            if (!fileExtension || fileExtension === '')
                return { valid: false, message: 'File unreadable or corrupted.' };

            if (!validExtension)
                return { valid: false, message: 'File type not allowed.' };
        } catch (_) {
            return { valid: false, message: 'File unreadable or corrupted.' };
        }

        // Check if the file does not exceed the max allowed size
        try {
            if (file.buffer.byteLength > this.limitSettings.maxSingleFileSize)
                return { valid: false, message: 'File exceeds the maximum allowed size for a single file (5 MB).' };
        } catch (error) {
            return { valid: false, message: 'Could not determine file size.' };
        }

        return { valid: true, message: '' };
    }

    async validateQuota(accountId: string, fileSize: number, thumbSize?: number): Promise<{ valid: boolean, message: string, totalAfterUpload?: number }> {
        // Check if there's still space to upload it
        try {
            const spaceUsed = await this.getQuota(accountId);
            const totalAfterUpload = spaceUsed + fileSize + (thumbSize !== null ? thumbSize : 0);

            if (totalAfterUpload >= this.limitSettings.maxQuotaUsagePerAccount) {
                return { valid: false, message: 'Disk/quota usage exceeded.' };
            }

            return { valid: true, message: '', totalAfterUpload };
        } catch (error) {
            return { valid: false, message: 'Could not check for disk/quota usage.' };
        }
    }

    hasThumbnail(fileName: string): boolean {
        return ['jpg','jpeg','png'].includes(fileName.split('.').pop());
    }

    async generateThumbnail(file: Express.Multer.File): Promise<Buffer> {
        try {
            const fileHandler = sharp(file.buffer);
            const fileContents: Buffer = await fileHandler
                .resize(this.thumbnailWidth, null)
                .toBuffer();

            return fileContents;
        } catch (error) {
            //log error;
            return null;
        }
    }
}