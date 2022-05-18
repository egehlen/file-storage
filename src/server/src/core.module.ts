import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseService } from "./db/database.service";
import { EncryptionService } from "./shared/encryption.service";

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
        EncryptionService,
        DatabaseService
    ],
    exports: [
        EncryptionService,
        DatabaseService,
        JwtModule
    ]
})
export class CoreModule { }