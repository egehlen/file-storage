import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../db/database.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

const mocks = {
    dtos: {
        create:  { name: 'abc', email: 'abc@abc.com', password: '123' },
        findOne: { id: '1' },
        update:  { id: '1', body: { name: 'cba', email: 'cba@cba.com', password: '345' } },
        remove:  { id: '1' }
    },
    results: {
        create:  { id: '1' },
        findOne: { id: '1', name: 'abc', email: 'abc@abc.com', passwordHash: '123' },
        update:  { id: '1', name: 'cba', email: 'cba@cba.com', passwordHash: '345' },
        remove:  { id: '1', name: 'abc', email: 'abc@abc.com', passwordHash: '123' }
    }
};

describe('AccountController', () => {
    let controller: AccountController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountController],
            providers: [
                {
                    provide: AccountService,
                    useValue: {
                        create:  () => mocks.results.create,
                        findOne: () => mocks.results.findOne,
                        update:  () => mocks.results.update,
                        remove:  () => mocks.results.remove
                    }
                },
                { provide: DatabaseService, useValue: {} },
                { provide: AuthGuard, useValue: { canActivate: () => true } },
                { provide: JwtService, useValue: {} }
            ],
        }).compile();

        controller = module.get<AccountController>(AccountController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create', () => {
        expect(controller.create(mocks.dtos.create)).toEqual(mocks.results.create);
    });

    it('findOne', () => {
        expect(controller.findOne(mocks.dtos.findOne.id)).toEqual(mocks.results.findOne);
    });

    it('update', () => {
        expect(controller.update(mocks.dtos.update.id, mocks.dtos.update.body)).toEqual(mocks.results.update);
    });

    it('remove', () => {
        expect(controller.remove(mocks.dtos.remove.id)).toEqual(mocks.results.remove);
    });

});
