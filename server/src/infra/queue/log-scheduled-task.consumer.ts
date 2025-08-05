import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { LogScheduledTaskQueueJobDataDto } from './dto';
import { MysqlPrismaoService } from "../prisma/mysql.prismao.service";

@Processor('log-scheduled-task-queue')
@Injectable()
export class LogScheduledTaskConsumer extends WorkerHost {
  constructor(private readonly mysqlPrismao: MysqlPrismaoService) {
    super();
  }

  async process(job: Job<LogScheduledTaskQueueJobDataDto>) {
    const data = job.data;
    await this.mysqlPrismao.log_scheduled_task.create({
      data: {
        task_target: data.taskTarget,
        operate_type: data.operateType,
        if_success: data.ifSuccess,
        remark: data.remark,
        create_time: data.createTime,
      },
    });
  }
}
