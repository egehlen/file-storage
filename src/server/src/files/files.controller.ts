import { RenameFileRequestDto } from './dto/rename-request.dto';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRequestDto } from './dto/upload-request.dto';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async upload(@Body() uploadFilesDto: UploadRequestDto, @UploadedFile() file: Express.Multer.File) {
        return await this.filesService.create(uploadFilesDto, file);
    }

    @Get()
    findAll() {
        return this.filesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() renameDto: RenameFileRequestDto) {
        return this.filesService.update(id, renameDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(id);
    }
}
