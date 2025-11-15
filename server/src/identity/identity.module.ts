import { Global, Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { LogUserLoginFacadeService } from '../module/main/sys-log/log-user-login/log-user-login.facade.service';

@Global()
@Module({
  providers: [IdentityService, LogUserLoginFacadeService],
  exports: [IdentityService],
})
export class IdentityModule {}
