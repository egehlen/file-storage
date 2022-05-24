import { DatabaseService } from '../db/database.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { CryptoService } from 'src/shared/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CredentialsValidationResult } from './types/credentials.validation.result.type';
import { TokenPayload } from './types/token.payload.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly cryptoService: CryptoService,
        private readonly dbService: DatabaseService,
        private readonly jwtService: JwtService
    ) { }

    private async validateCredentials(loginDto: LoginDto): Promise<CredentialsValidationResult> {
        const account = await this.accountService.findByEmail(loginDto.email);

        if (account) {
            const hashedPassword = this.cryptoService.getHash(loginDto.password);
            
            if (account.passwordHash === hashedPassword) {
                return { valid: true, account };
            }
        }

        return { valid: false, account: null };
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

        const { valid, account } = await this.validateCredentials(loginDto);

        if (valid === true && !!account) {
            const payload: TokenPayload = { id: account.id };
            const token = this.jwtService.sign(payload);
            
            await this.dbService.session.create({ data: { token } });
            return { authorization: token };
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