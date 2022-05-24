import { CryptoService } from 'src/shared/crypto.service';
import { StorageService } from './storage.service';
import { DatabaseService } from 'src/db/database.service';
import { Injectable } from '@nestjs/common';
import { UploadRequestDto } from './dto/upload-request.dto';
import * as sharp from 'sharp';
import { UploadResultDto } from './dto/upload-result.dto';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';

@Injectable()
export class FilesService {
    private readonly allowedFileTypes = ['jpg','jpeg','png','zip','pdf','docx','xlsx'];
    private readonly thumbnailWidth: number = 180;
    private readonly thumbnailHeight: number = 120;

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

        if (this.hasThumbnail(file.originalname)) {
            const { 
                contents: thumbContent,
                fileName: thumbFileName
            } = await this.generateThumbnail(file);
            
            const encryptedThumbnail = this.cryptoService.encrypt(thumbContent, uploadRequest.accountId);
            thumbUploadResult = await this.storageService.upload(uploadRequest.accountId, uploadRequest.correlationId, thumbFileName, encryptedThumbnail);
        }

        /* Write to database */
        const newRow = await this.dbService.file.create({
            data: {
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                contentUrl: uploadResult.Location,
                thumbnailUrl: thumbUploadResult.Location,
                owner: {
                    connect: {
                        id: uploadRequest.accountId
                    }
                }
             },
            select: { id: true }
        });

        /* Get direct url */
        const presignedUrl = await this.storageService.getPreSignedUrl(uploadResult.Key);

        return {
            id: newRow.id,
            success: true,
            message: 'Upload successful!',
            address: presignedUrl
        };
    }

    findAll() {
        return `This action returns all files`;
    }

    findOne(id: string) {
        return `This action returns a #${id} file`;
    }

    // update(id: number, updateFileDto: UpdateFileDto) {
    //     return `This action updates a #${id} file`;
    // }

    remove(id: string) {
        return `This action removes a #${id} file`;
    }

    validateRequest(request: UploadRequestDto): boolean {
        return (typeof request !== 'undefined' && request !== null) &&
            (!!request.accountId && request.accountId !== '') &&
            (!!request.correlationId && request.correlationId !== '');
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

    async generateThumbnail(file: Express.Multer.File): Promise<{ contents: Buffer, fileName: string }> {
        try {
            const fileHandler = sharp(file.buffer);
            const fileContents: Buffer = await fileHandler
                .resize(this.thumbnailWidth, this.thumbnailHeight)
                .toBuffer();

            const fileNameParts = file.originalname.split('.');
            const extension = fileNameParts.pop();
            const fileName = `${fileNameParts.join('.')}_thumb.${extension}`;

            return { contents: fileContents, fileName };
        } catch (error) {
            throw error;
        }
    }
}