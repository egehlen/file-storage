import { CoreModule } from './core.module';
import { SharedModule } from './shared/shared.module';
import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
    imports: [
        CoreModule,
        AccountModule,
        AuthModule,
        SharedModule,
        FilesModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule { }