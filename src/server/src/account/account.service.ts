import { Account } from './entities/account.entity';
import { DatabaseService } from '../db/database.service';
import { CryptoService } from '../shared/crypto.service';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly cryptoService: CryptoService
    ) { }

    async create(createAccountDto: CreateAccountDto) {
        const passwordHash = this.cryptoService.getHash(createAccountDto.password);
        const account = await this.dbService.account.create({
            data: new Account({...createAccountDto, passwordHash}),
            select: { id: true }
        });

        return { id: account.id };
    }

    findOne(id: string) {
        return this.dbService.account.findUnique({
            where: { id }
        })
    }

    findByEmail(email: string) {
        return this.dbService.account.findUnique({
            where: { email }
        });
    }

    update(id: string, updateAccountDto: UpdateAccountDto) {
        const passwordHash = this.cryptoService.getHash(updateAccountDto.password);
        return this.dbService.account.update({
            data: new Account({...updateAccountDto, passwordHash}),
            where: { id },
            select: { id: true }
        })
    }

    remove(id: string) {
        return this.dbService.account.delete({
            where: { id },
            select: { id: true }
        });
    }
}
