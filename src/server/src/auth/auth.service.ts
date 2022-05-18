import { DatabaseService } from '../db/database.service';
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
        private readonly dbService: DatabaseService,
        private readonly jwtService: JwtService
    ) {}

    private async validateCredentials(loginDto: LoginDto): Promise<any> {
        const account = await this.accountService.findByEmail(loginDto.email);

        if (account) {
            const hashedPassword = this.encryptionService.getHash(loginDto.password);
            return (account.passwordHash === hashedPassword);
        }

        return false;
    }

    public async validateSession(token: string) {
        const entry = await this.dbService.session.findUnique({
            where: { token }
        });

        return !!entry;
    }

    public async login(loginDto: LoginDto): Promise<any> {
        if (!loginDto || !loginDto.email || !loginDto.password)
            throw new UnauthorizedException('Login failed: credentials not provided.');

        if (await this.validateCredentials(loginDto)) {
            const payload = { username: loginDto.email };
            const token = this.jwtService.sign(payload);
            
            await this.dbService.session.create({ data: { token } });
            return { token };
        }
        else {
            throw new UnauthorizedException('Login failed: incorrect user name or password.');
        }
    }

    public async logout(token: string) {
        await this.dbService.session.delete({
            where: { token }
        });
        
        return { result: true };
    }
}