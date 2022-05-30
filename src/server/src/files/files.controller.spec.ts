import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

//#region [Mocks]
const id = () => crypto.randomUUID();
const mocks = {
    dtos: {
        create: { accountId: id(), correlationId: id(), customName: id() },
        createFile: { fieldname: id(), originalname: id(), mimetype: id(), size: 1000, buffer: Buffer.from(''), encoding: null, stream: null, destination: null, filename: null, path: null }
    },
    results: {
        create: { id: '1', success: true, message: '', address: id() },
        getAll: [ { id: '1', name: id(), type: '', size: 1000, contentKey: id(), thumbnailKey: id(), thumbnailUrl: '' } ],
        getOne: { id: '1', name: id(), type: 'image/png', size: 1000, contentKey: id(), thumbnailKey: id(), thumbnailUrl: '' },
        download: { name: '1', type: 'image/png', size: 1000, content: Buffer.from('') },
        update: true,
        remove: null
    }
};
//#endregion


describe('FilesController', () => {
    let controller: FilesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [
                {
                    provide: FilesService,
                    useValue: {
                        create: () => mocks.results.create,
                        getAll: () => mocks.results.getAll,
                        getOne: () => mocks.results.getOne,
                        download: () => mocks.results.download,
                        update: () => mocks.results.update,
                        remove: () => mocks.results.remove
                    }
                },
                { provide: AuthService, useValue: {} },
                { provide: JwtService, useValue: {} }
            ],
        }).compile();

        controller = module.get<FilesController>(FilesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('upload', () => {
        expect(controller.upload(mocks.dtos.create, mocks.dtos.createFile)).resolves.toEqual(mocks.results.create);
    });

    // it('getAll', () => {

    // });

    // it('getOne', () => {

    // });

    // it('download', () => {

    // });

    // it('update', () => {

    // });

    // it('remove', () => {

    // });

});