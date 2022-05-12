import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class EncryptionService {


    getHash(data: string) {
        return createHash('sha256').update(data, 'utf-8').digest('hex');
    }
}