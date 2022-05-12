import { EncryptionService } from 'src/shared/encryption.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './entities/account.entity';

@Injectable()
export class AccountService {

    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        private readonly encryptionService: EncryptionService
    ) { }

    create(createaccountDto: CreateAccountDto) {
        const passwordHash = this.encryptionService.getHash(createaccountDto.password);
        const account = new this.accountModel({...createaccountDto, passwordHash });
        return account.save();
    }

    findAll() {
        return this.accountModel.find();
    }

    findOne(id: string) {
        return this.accountModel.findById(id);
    }

    findByName(name: string) {
        return this.accountModel.find({ name });
    }

    update(id: string, updateAccountDto: UpdateAccountDto) {
        const passwordHash = this.encryptionService.getHash(updateAccountDto.password);
        return this.accountModel.findByIdAndUpdate(
            { _id: id },
            { $set: {...updateAccountDto, passwordHash} },
            { new: true }
        );
    }

    remove(id: string) {
        return this.accountModel
            .deleteOne({ _id: id })
            .exec();
    }
}
