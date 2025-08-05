import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../infra/auth/auth.service';
import { CacheTokenService } from '../infra/cache/cache.token.service';
import { BaseContextService } from '../infra/base-context/base-context.service';
import { Request } from 'express';
import { UnauthorizedException } from '../exception/unauthorized.exception';
import { getTokenUuidFromAuth } from '../util/RequestUtils';
import { genCurrentUser } from '../infra/base-context/baseContext';

@Injectable()
export class StaticGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly bcs: BaseContextService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    let tokenUsable = true;

    const query = request.query;
    const oauth = query['authorization'] as string;
    const token = getTokenUuidFromAuth(oauth);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = await this.cacheTokenService.verifyToken(token);
      if (decoded) {
        this.bcs.setUserData(genCurrentUser(decoded.userid, token, decoded.loginRole));
      } else {
        tokenUsable = false;
      }
    } catch (e) {
      tokenUsable = false;
    }

    if (!tokenUsable) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
