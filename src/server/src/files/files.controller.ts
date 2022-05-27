import { Controller, Get, Post, Response, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { RenameFileRequestDto } from './dto/rename-request.dto';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRequestDto } from './dto/upload-request.dto';
import { GetFileRequestDto } from './dto/get-request.dto';
import { Readable } from 'stream';

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
    async getAll(@Body() getRequest: GetFileRequestDto) {
        return await this.filesService.getAll(getRequest.accountId);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.filesService.getOne(id);
    }

    @Get('download/:id')
    async download(@Param('id') id: string, @Response() response) {
        const result = await this.filesService.download(id);
        const stream = Readable.from(result.content);

        response.set({
            'Content-Type': result.type,
            'Content-Disposition': `attachment; filename="${result.name}"`,
        });

        stream.pipe(response, {
            end: true
        });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() renameDto: RenameFileRequestDto) {
        return await this.filesService.update(id, renameDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.filesService.remove(id);
    }
}