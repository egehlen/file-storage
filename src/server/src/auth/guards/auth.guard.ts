import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    validateRequest(request: Request): boolean {
        try {
            const token = request.headers['authorization'];
            if (!token || token === '') return false;

            return !!this.jwtService.verify(token);
        } catch (error) {
            if (error instanceof JsonWebTokenError)
                return false;
            else
                throw error;
        }
    }
}