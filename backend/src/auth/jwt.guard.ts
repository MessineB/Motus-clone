import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwt.verifyAsync(token, { secret: 'sutom_secret' });
      req.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
}
