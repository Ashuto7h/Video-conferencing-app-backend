import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../types/user-payload.type';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        try {
            const token = this.getToken(request);
            const payload = this.jwtService.verify<{ sub: string }>(token);
            request.user = { username: payload.sub };
            return true;
        } catch (e) {
            return false;
        }
    }

    private getToken(request: { headers: Record<string, string | string[] | undefined> }): string {
        const { authorization } = request.headers;
        if (!authorization || Array.isArray(authorization)) {
            throw new Error('Invalid Authorization Header');
        }
        const [, token] = authorization.split(' ');
        return token;
    }
}
