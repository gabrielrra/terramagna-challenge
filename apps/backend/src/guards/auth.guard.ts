import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '@/decorators/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@/utils/constants';
import { AuthClientData } from '@/auth/dto/login.dto';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = await this.jwtService.verifyAsync<AuthClientData>(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      request['user'] = payload;

    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
