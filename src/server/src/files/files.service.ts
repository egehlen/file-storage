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

    constructor(
        private readonly dbService: DatabaseService,
        private readonly cryptoService: CryptoService,
        private readonly storageService: StorageService
    ) { }

    async create(uploadRequest: UploadRequestDto, file: Express.Multer.File): Promise<UploadResultDto> {
        /* Validate */
        if (!this.validateRequest(uploadRequest)) {
            return { success: false, message: 'Could not complete the operation: missing upload data.' };
        }

        const fileValidationResult = await this.validateFile(file);
        if (!fileValidationResult.valid) {
            return { success: false, message: fileValidationResult.message };
        }

        /* Upload main file */
        const encryptedFile = this.cryptoService.encrypt(file.buffer, uploadRequest.accountId);
        const uploadResult = await this.storageService.upload(uploadRequest.accountId, uploadRequest.correlationId, file.originalname, encryptedFile);

        /* Upload thumbnail */
        let thumbUploadResult: ManagedUpload.SendData;
        const hasThumbnail = this.hasThumbnail(file.originalname);

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
        const newRow = await this.dbService.file.create({
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

        /* Get direct url for thumbnail */
        const presignedUrl = hasThumbnail ? 
            await this.storageService.getPreSignedUrl(thumbUploadResult.Key) :
            '';

        return {
            id: newRow.id,
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

    validateRequest(request: UploadRequestDto): boolean {
        return (typeof request !== 'undefined' && request !== null) &&
            (!isNullOrEmpty(request.accountId)) &&
            (!isNullOrEmpty(request.correlationId));
    }

    async validateFile(file: Express.Multer.File): Promise<{ valid: boolean, message: string }> {
        try {
            const validFile = typeof file !== 'undefined' && file !== null;
            const validBuffer = typeof file.buffer !== 'undefined' && file.buffer !== null;
            const validLength = file.buffer.byteLength > 0;

            if (!validFile || !validBuffer || !validLength)
                return { valid: false, message: 'File contents was empty.' };
        } catch (_) {
            return { valid: false, message: 'File contents was empty.' };
        }

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

        return { valid: true, message: '' };
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