import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
        AccountModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }