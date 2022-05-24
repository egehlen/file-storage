import { JwtService } from '@nestjs/jwt';
import { AccountService } from './../account/account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService } from 'src/shared/crypto.service';
import { DatabaseService } from 'src/db/database.service';
import * as httpMocks from 'node-mocks-http';

const mocks = {
    dtos: {
        login: { email: 'abc@abc.com', password: '4321' },
        logout: { token: '1234567890' }
    },
    results: {
        hashedPassword: '1234',
        login: { token: '1234567890' },
        logout: { result: true },
        session: { id: 1, token: '1234567890' },
        findByEmail: { id: 1, name: 'abc', email: 'abc@abc.com', passwordHash: '1234' }
    }
};

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: CryptoService,
                    useValue: {
                        getHash: () => mocks.results.hashedPassword
                    }
                },
                {
                    provide: AccountService,
                    useValue: {
                        findByEmail: () => mocks.results.findByEmail
                    }
                },
                {
                    provide: DatabaseService,
                    useValue: {
                        session: {
                            create: () => mocks.results.session,
                            delete: () => mocks.results.session
                        }
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: () => mocks.results.login.token
                    }
                }
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('login', async() => {
        // Arrange
        const response = httpMocks.createResponse();

        // Act
        await controller.login(mocks.dtos.login, response);

        // Assert
        expect(response.statusCode).toEqual(200);
        expect(response._getJSONData()).toEqual(mocks.results.login);
    });

    it('logout', async() => {
        // Arrange
        const response = httpMocks.createResponse();

        // Act
        await controller.logout(mocks.dtos.logout.token, response);

        // Assert
        expect(response.statusCode).toEqual(200);
        expect(response._getJSONData()).toEqual(mocks.results.logout);
    });
});
