import { Module } from '@nestjs/common';
import { UserGroupPermissionController } from './user-group-permission.controller';
import { UserGroupPermissionService } from './user-group-permission.service';
import { LogAlgorithmCallFacadeService } from '../log-algorithm-call/log-algorithm-call.facade.service';

@Module({
  controllers: [UserGroupPermissionController],
  providers: [UserGroupPermissionService, LogAlgorithmCallFacadeService],
})
export class UserGroupPermissionModule {}
