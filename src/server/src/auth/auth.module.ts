import { AccountService } from 'src/account/account.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        AccountService
    ]
})
export class AuthModule { }
