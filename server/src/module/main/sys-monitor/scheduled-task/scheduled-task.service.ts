import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { ScheduledTaskDto, ScheduledTaskSelListDto, ScheduledTaskSelAllDto, ScheduledTaskInsOneDto, ScheduledTaskUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { ScheduleService } from "../../../../infra/schedule/schedule.service";
import { final } from "../../../../util/base";
import { ScheduledTaskFacadeService } from './scheduled-task.facade.service';

@Injectable()
export class ScheduledTaskService {
  constructor(
      private readonly mysqlPrisma: MysqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly scheduleService: ScheduleService,
      private readonly scheduledTaskFacadeService: ScheduledTaskFacadeService,
  ) {
    this.bcs.setFieldSelectParam('sys_scheduled_task', {
      notNullKeys: ['name', 'target', 'cronExpression', 'orderNum', 'ifDisabled'],
      numberKeys: ['orderNum'],
    });
  }

  async selScheduledTask(dto: ScheduledTaskSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<ScheduledTaskDto>('sys_scheduled_task', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllScheduledTask(dto: ScheduledTaskSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<ScheduledTaskDto>('sys_scheduled_task', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesScheduledTask(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<ScheduledTaskDto>('sys_scheduled_task', ids);
    return R.ok(res);
  }

  async selOneScheduledTask(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<ScheduledTaskDto>('sys_scheduled_task', id);
    return R.ok(res);
  }

  async insScheduledTask(dto: ScheduledTaskInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<ScheduledTaskDto>('sys_scheduled_task', dto);
    if (res.ifDisabled === final.N) {
      this.scheduleService.setScheduleCron(res.target, res.cronExpression);
    }
    return R.ok(res);
  }

  async insScheduledTasks(dtos: ScheduledTaskInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<ScheduledTaskDto>('sys_scheduled_task', dtos);
    return R.ok(res);
  }

  async updScheduledTask(dto: ScheduledTaskUpdOneDto): Promise<R> {
    const oldTask = await this.scheduledTaskFacadeService.getByIds([dto.id]);
    const res = await this.mysqlPrisma.updateById<ScheduledTaskDto>('sys_scheduled_task', dto);
    this.scheduleService.delScheduleTask(oldTask[0].target)
    if (res.ifDisabled === final.N) {
      this.scheduleService.setScheduleCron(res.target, res.cronExpression)
    }
    return R.ok(res);
  }

  async updScheduledTasks(dtos: ScheduledTaskUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<ScheduledTaskDto>('sys_scheduled_task', dtos);
    return R.ok(res);
  }

  async delScheduledTask(ids: number[]): Promise<R> {
    const r = await this.scheduledTaskFacadeService.getByIds(ids);
    for (const datum of r) {
      this.scheduleService.delScheduleTask(datum.target)
    }
    const res = await this.mysqlPrisma.deleteById<ScheduledTaskDto>('sys_scheduled_task', ids);
    return R.ok(res);
  }

  async runScheduleTaskOnce(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<ScheduledTaskDto>('sys_scheduled_task', ids);
    const names = res.map(item => item.target);
    await this.scheduleService.runScheduleOnce(...names);
    return R.ok(true);
  }
}
