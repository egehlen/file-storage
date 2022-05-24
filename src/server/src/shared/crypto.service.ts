import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, scryptSync } from 'crypto';

@Injectable()
export class CryptoService {

    private fileEncAlgorithm: string;
    private hashEncAlgorithm: string;
    private keyLength: number;
    private iv: Buffer;
    private salt: string;

    constructor() {
        this.fileEncAlgorithm = process.env.FILE_ENCRYPTION_ALGORITHM;
        this.hashEncAlgorithm = process.env.HASH_ENCRYPTION_ALGORITHM;
        this.salt = process.env.FILE_ENCRYPTION_SALT;
        this.iv = Buffer.alloc(16, 0);
        this.keyLength = 32;
    }

    getHash(data: string) {
        return createHash(this.hashEncAlgorithm).update(data, 'utf-8').digest('hex');
    }

    encrypt(buffer: Buffer, password: string): Buffer {
        try {
            const key = scryptSync(password, this.salt, this.keyLength);
            const cipher = createCipheriv(this.fileEncAlgorithm, key, this.iv);
            return Buffer.concat([cipher.update(buffer), cipher.final()]);
        } catch (error) {
            console.error('EncryptionService::encrypt => Could not encrypt.', error);
            return Buffer.from('');
        }
    }

    decrypt(buffer: Buffer, password: string): Buffer {
        try {
            const key = scryptSync(password, this.salt, this.keyLength);
            const cipher = createDecipheriv(this.fileEncAlgorithm, key, this.iv);
            return Buffer.concat([cipher.update(buffer), cipher.final()]);
        } catch (error) {
            console.error('EncryptionService::decrypt => Could not decrypt.', error);
            return Buffer.from('');
        }
    }
}