import { Account } from './entities/account.entity';
import { DatabaseService } from '../db/database.service';
import { EncryptionService } from './../shared/encryption.service';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly encryptionService: EncryptionService
    ) { }

    async create(createAccountDto: CreateAccountDto) {
        const passwordHash = this.encryptionService.getHash(createAccountDto.password);
        const account = await this.dbService.account.create({
            data: new Account({...createAccountDto, passwordHash})
        });

        return { id: account.id };
    }

    findOne(id: number) {
        return this.dbService.account.findUnique({
            where: { id }
        })
    }

    findByEmail(email: string) {
        return this.dbService.account.findUnique({
            where: { email }
        });
    }

    update(id: number, updateAccountDto: UpdateAccountDto) {
        const passwordHash = this.encryptionService.getHash(updateAccountDto.password);
        return this.dbService.account.update({
            data: new Account({...updateAccountDto, passwordHash}),
            where: { id }
        })
    }

    remove(id: number) {
        return this.dbService.account.delete({
            where: { id }
        });
    }
}
