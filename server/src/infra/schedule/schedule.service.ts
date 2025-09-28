import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { QueueoService } from '../queue/queueo.service';
import { final } from '../../util/base';
import { WinstonService } from '../winston/winston.service';
import { MysqlPrismaoService } from "../prisma/mysql.prismao.service";
import { PrismaoService } from "../prisma/prismao.service";
import { base } from '@dcts/common';

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prismao: PrismaoService,
    private readonly mysqlPrismao: MysqlPrismaoService,
    private readonly queueo: QueueoService,
    private readonly winston: WinstonService,
  ) {}

  /**
   * 仅供框架调用，禁止外部调用
   */
  async onModuleInit() {
    await this.init();
  }

  private async init() {
    const tasks = await this.mysqlPrismao.sys_scheduled_task.findMany({
      where: {
        ...this.prismao.defaultSelArg().where,
      },
    });
    for (const task of tasks) {
      if (task.if_disabled === final.N) {
        this.addSchedule(task.target, task.cron_expression);
      }
    }
  }

  private schedules = new Map<string, () => Promise<boolean>>();

  private addSchedule(name: string, cronExpression: string) {
    const obj = this.schedules.get(name);
    if (!obj) {
      return;
    }
    const cronJob = new CronJob(cronExpression, async () => {
      let ifSuccess = true;
      try {
        await obj();
      } catch (e) {
        this.winston.error(e);
        ifSuccess = false;
      }
      await this.queueo.addLogScheduledTaskQueue('ins', {
        taskTarget: name,
        operateType: base.LSTOTTypeEnum.T_BYSELF,
        ifSuccess: ifSuccess ? final.Y : final.N,
        remark: '',
        createTime: new Date(),
      });
    });
    this.schedulerRegistry.addCronJob(name, cronJob);
    cronJob.start();
  }

  private delSchedule(name: string) {
    const b = this.schedulerRegistry.getCronJobs().has(name);
    if (b) {
      const cronJob = this.schedulerRegistry.getCronJob(name);
      cronJob.stop();
      this.schedulerRegistry.deleteCronJob(name);
    }
  }

  async runScheduleOnce(...names: string[]) {
    for (const name of names) {
      const obj = this.schedules.get(name);
      if (obj) {
        let ifSuccess = true;
        try {
          await obj();
        } catch (e) {
          this.winston.error(e);
          ifSuccess = false;
        }
        await this.queueo.addLogScheduledTaskQueue('ins', {
          taskTarget: name,
          operateType: base.LSTOTTypeEnum.T_USERTRIGGER,
          ifSuccess: ifSuccess ? final.Y : final.N,
          remark: '',
          createTime: new Date(),
        });
      }
    }
  }

  addScheduleFunc(name: string, func: () => Promise<boolean>) {
    this.schedules.set(name, func);
  }

  setScheduleCron(name: string, cronExpression: string) {
    this.addSchedule(name, cronExpression);
  }

  delScheduleTask(name: string) {
    this.delSchedule(name);
  }
}
