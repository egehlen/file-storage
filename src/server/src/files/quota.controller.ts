import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { FilesService } from "./files.service";

@Controller('quota')
@UseGuards(AuthGuard)
export class QuotaController {
    constructor(private readonly filesService: FilesService) { }
    
    @Get(':id')
    async get(@Param('id') accountId: string) {
        return await this.filesService.getQuotaUsage(accountId);
    }
}