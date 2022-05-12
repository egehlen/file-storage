import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { EncryptionService } from 'src/shared/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly encryptionService: EncryptionService,
        private readonly jwtService: JwtService
    ) {}

    private async validateCredentials(loginDto: LoginDto): Promise<any> {
        const account = await this.accountService.findByName(loginDto.username);

        if (account && account.length) {
            const hashedPassword = this.encryptionService.getHash(loginDto.password);
            return (account[0] && account[0].passwordHash === hashedPassword);
        }

        return false;
    }

    public async login(loginDto: LoginDto): Promise<any> {
        if (!loginDto || !loginDto.username || !loginDto.password)
            throw new UnauthorizedException('Login failed: credentials not provided.');

        if (await this.validateCredentials(loginDto)) {
            const payload = { username: loginDto.username };
            const token = this.jwtService.sign(payload);
            return { token };
        }
        else {
            throw new UnauthorizedException('Login failed: incorrect user name or password.');
        }
    }
}