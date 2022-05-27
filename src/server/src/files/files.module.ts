import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { QuotaController } from './quota.controller';
import { StorageService } from './storage.service';

@Module({
    controllers: [
        FilesController,
        QuotaController
    ],
    providers: [
        FilesService,
        StorageService
    ]
})
export class FilesModule { }
