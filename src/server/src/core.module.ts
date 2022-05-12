import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
        MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
        JwtModule.register({
            secret: `${process.env.JWT_SECRET_KEY}`,
            signOptions: { expiresIn: `${process.env.JWT_TOKEN_EXPIRATION_IN_SECONDS}s` }
        })
    ],
    exports: [JwtModule]
})
export class CoreModule { }