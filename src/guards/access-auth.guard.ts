import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Token } from 'src/tokens/entity/token.entity';
import { Tokens } from 'utils/constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJWTFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('token').access_secret,
      });

      if (payload.type !== Tokens.ACCESS) {
        throw new UnauthorizedException();
      }

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  // private extractTokenFromHeader(request: Request): string | null {
  //   const [type, token] = request.headers?.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : null;
  // }

  private extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.tokens && req.cookies.tokens.accessToken) {
      return req.cookies.tokens.accessToken;
    }
    return null;
  }
}
