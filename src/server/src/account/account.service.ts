import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './entities/account.entity';

@Injectable()
export class AccountService {

  constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}

  create(createaccountDto: CreateAccountDto) {
    const account = new this.accountModel(createaccountDto);
    return account.save();
  }

  findAll() {
    return this.accountModel.find();
  }

  findOne(id: string) {
    return this.accountModel.findById(id);
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountModel.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: updateAccountDto
      },
      {
        new: true
      }
    )
  }

  remove(id: string) {
    return this.accountModel
      .deleteOne({
        _id: id
      })
      .exec();
  }
}
