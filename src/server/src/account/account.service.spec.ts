import { CryptoService } from 'src/shared/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DatabaseService } from 'src/db/database.service';
import { AccountService } from './account.service';

//#region [Mocks]
const mocks = {
    dtos: {
        create:  { name: 'abc', email: 'abc@abc.com', password: '123' },
        findOne: { id: '1' },
        findByEmail: { email: 'abc@abc.com' },
        update:  { id: '1', body: { name: 'cba', email: 'cba@cba.com', password: '345' } },
        remove:  { id: '1' }
    },
    results: {
        created:  { id: '1' },
        existing: { id: '1', name: 'abc', email: 'abc@abc.com', passwordHash: '123' },
        updated:  { id: '1', name: 'cba', email: 'cba@cba.com', passwordHash: '345' }
    }
};
//#endregion

describe('AccountService', () => {
    let service: AccountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                CryptoService,
                {
                    provide: DatabaseService,
                    useValue: {
                        account: {
                            create: () => mocks.results.existing,
                            findUnique: () => mocks.results.existing,
                            update: () => mocks.results.updated,
                            delete: () => mocks.results.existing,
                        }
                    }
                },
                { provide: AuthGuard, useValue: { canActivate: () => true } },
                { provide: JwtService, useValue: {} }
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('create', async() => {
        expect(service.create(mocks.dtos.create)).resolves.toEqual(mocks.results.created);
    });

    it('findOne', () => {
        expect(service.findOne(mocks.dtos.findOne.id)).toEqual(mocks.results.existing);
    });

    it('findByEmail', () => {
        expect(service.findByEmail(mocks.dtos.findByEmail.email)).toEqual(mocks.results.existing);
    });

    it('update', () => {
        expect(service.update(mocks.dtos.update.id, mocks.dtos.update.body)).toEqual(mocks.results.updated);
    });

    it('remove', () => {
        expect(service.remove(mocks.dtos.remove.id)).toEqual(mocks.results.existing);
    });
});
