import { UploadProgressDto } from './dto/upload-progress.dto';
import { Injectable } from "@nestjs/common";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ManagedUpload  } from "aws-sdk/clients/s3";
import { WebSocketService } from "src/shared/web-socket.service";
import { RenameFileDto } from './dto/rename-file.dto';
import { isNullOrEmpty } from 'src/shared/utilities';

@Injectable()
export class StorageService {
    private storageClient: S3Client;

    constructor() {
        this.storageClient = new S3Client({
            region: process.env.AWS_REGION
        });
    }

    async upload(accountId: string, correlationId: string, fileName: string, fileContents: Buffer): Promise<ManagedUpload.SendData> {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `${accountId}/${fileName}`,
                Body: fileContents
            };
    
            try {
                const upload = new ManagedUpload({ params });
                upload.on('httpUploadProgress', (data) => {
                    const progress = +(((data.loaded / data.total) * 100).toFixed(2));
                    const message: UploadProgressDto = {
                        correlationId,
                        progress
                    };
                    console.log(message);
                    WebSocketService.socket()
                        .to(correlationId)
                        .emit('uploadProgress', JSON.stringify(message));
                });
    
                upload.send((err, data) => {
                    if (err) {
                        console.log("Error", err);
                        reject(err);
                    }
    
                    console.log(data);
                    resolve(data);
                });
            } catch (err) {
                console.log("Error", err);
                reject(err);
            }
        });
    }

    async rename(accountId: string, file: RenameFileDto, newName: string): Promise<string> {
        const prevKey = file.contentKey;
        const newKey = `${accountId}/${newName}`;

        const copyParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            CopySource: `${process.env.AWS_S3_BUCKET}/${prevKey}`,
            Key: newKey
        };

        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: prevKey
        };

        const copyCommand = new CopyObjectCommand(copyParams);
        const copyResult = await this.storageClient.send(copyCommand);

        if (!!copyResult && !!copyResult.CopyObjectResult && !isNullOrEmpty(copyResult.CopyObjectResult.ETag)) {
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await this.storageClient.send(deleteCommand);

            return newKey;
        }

        return null;
    }

    async getPreSignedUrl(storageKey: string): Promise<string> {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: storageKey
        };

        const command = new GetObjectCommand(params);
        const expiresIn = 2 * 60 * 60; // 2 hours
        return await getSignedUrl(this.storageClient, command, { expiresIn });
    }
}