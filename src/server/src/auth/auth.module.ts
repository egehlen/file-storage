import { SharedModule } from './../shared/shared.module';
import { AccountModule } from './../account/account.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        AccountModule,
        SharedModule,
        PassportModule
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }