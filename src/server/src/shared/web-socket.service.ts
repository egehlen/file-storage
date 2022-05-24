import { Injectable } from '@nestjs/common';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class WebSocketService {

    private static instance: WebSocketService;
    private static _socket: io.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    private static setupSocketServer() {
        const port = parseInt(process.env.WEB_SOCKET_PORT) || 3001;
        this._socket = new io.Server(port, {
            cors: {
                origin: process.env.CLIENT_ORIGIN_URL,
                methods: ['*']
            }
        });
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance)
            WebSocketService.instance = new WebSocketService();

        return WebSocketService.instance;
    }

    public static socket() : io.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
        if (!WebSocketService._socket)
            WebSocketService.setupSocketServer();
        
        return WebSocketService._socket;
    }
}