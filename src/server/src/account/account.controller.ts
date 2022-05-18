import { AuthGuard } from '../auth/guards/auth.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post()
    create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.create(createAccountDto);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id: number) {
        return this.accountService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    update(@Param('id') id: number, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.update(+id, updateAccountDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: number) {
        return this.accountService.remove(+id);
    }
}