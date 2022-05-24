import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { WebSocketService } from './web-socket.service';

@Module({
    providers: [CryptoService, WebSocketService],
    exports: [CryptoService, WebSocketService]
})
export class SharedModule {}