import { AccountService } from 'src/account/account.service';
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth/auth.service";
import { DatabaseService } from "./db/database.service";
import { CryptoService } from "./shared/crypto.service";
import { WebSocketService } from './shared/web-socket.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: `${process.env.JWT_SECRET_KEY}`,
            signOptions: { expiresIn: `${process.env.JWT_EXPIRATION_SECONDS}s` }
        })
    ],
    providers: [
        CryptoService,
        DatabaseService,
        WebSocketService,
        AuthService,
        AccountService
    ],
    exports: [
        AccountService,
        CryptoService,
        DatabaseService,
        WebSocketService,
        JwtModule,
        AuthService
    ]
})
export class CoreModule { }