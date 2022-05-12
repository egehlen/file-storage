import { AuthService } from './auth.service';
import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() response: Response) {
        try {
            const result = await this.authService.login(loginDto);
            response.status(200).json(result);
        } catch (error) {
            if (error instanceof UnauthorizedException)
                response.status(401).send((error as UnauthorizedException).message);
            else
                response.status(500).send(error);
        }
    }

    // @Post('logout')
    // async logout(@Request() request) {
        
    // }
}