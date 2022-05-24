import { AuthService } from './../auth.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request: Request): Promise<boolean> {
        try {
            const token = request.headers['authorization'];
            
            if (!token || token === '')
                return false;

            const validToken = !!this.jwtService.verify(token);
            const validSession = await this.authService.validateSession(token);

            return validToken && validSession;
        }
        catch (error) {
            if (error instanceof JsonWebTokenError)
                return false;
            else
                throw error;
        }
    }
}