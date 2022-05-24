import { DatabaseService } from '../db/database.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/account/account.service';
import { CryptoService } from 'src/shared/crypto.service';
import { AuthService } from './auth.service';

const mocks = {
    results: {
        session: { id: 1, token: '1234567890' },
        account: { id: 1, name: 'abc', email: 'abc@abc.com', passwordHash: '123' },
        jwt: '1234567890'
    }
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                CryptoService,
                {
                    provide: DatabaseService,
                    useValue: {
                        session: {
                            findUnique: () => mocks.results.session,
                            create: () => mocks.results.session,
                            delete: () => mocks.results.session
                        }
                    }
                },
                {
                    provide: AccountService,
                    useValue: {
                        findByEmail: () => mocks.results.account
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: () => mocks.results.jwt
                    }
                }
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
