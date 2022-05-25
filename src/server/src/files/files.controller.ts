import { RenameFileRequestDto } from './dto/rename-request.dto';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRequestDto } from './dto/upload-request.dto';
import { GetFileRequestDto } from './dto/get-request.dto';

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async upload(@Body() uploadFilesDto: UploadRequestDto, @UploadedFile() file: Express.Multer.File) {
        return await this.filesService.create(uploadFilesDto, file);
    }

    @Get()
    getAll(@Body() getRequest: GetFileRequestDto) {
        return this.filesService.getAll(getRequest.accountId);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.filesService.getOne(id);
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
