import { Module } from '@nestjs/common';
import { ScheduledTaskController } from './scheduled-task.controller';
import { ScheduledTaskService } from './scheduled-task.service';
import { ScheduledTaskFacadeService } from './scheduled-task.facade.service';

@Module({
  controllers: [ScheduledTaskController],
  providers: [ScheduledTaskService, ScheduledTaskFacadeService],
})
export class ScheduledTaskModule {}
