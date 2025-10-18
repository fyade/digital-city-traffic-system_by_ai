import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightStrategyScheduleService } from './signal-light-strategy-schedule.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightStrategyScheduleSelListDto, SignalLightStrategyScheduleSelAllDto, SignalLightStrategyScheduleInsOneDto, SignalLightStrategyScheduleUpdOneDto, SignalLightStrategyScheduleInsMoreDto, SignalLightStrategyScheduleUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light-strategy/signal-light-strategy-schedule')
@ApiTags(`${publicConfig.APP_NAME}/信号灯策略管理/信号灯策略调度`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightStrategyScheduleController {
  constructor(private readonly signalLightStrategyScheduleService: SignalLightStrategyScheduleService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯策略调度',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:selList',
    label: '分页查询信号灯策略调度',
  })
  async selSignalLightStrategySchedule(@Query() dto: SignalLightStrategyScheduleSelListDto): Promise<R> {
    return this.signalLightStrategyScheduleService.selSignalLightStrategySchedule(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯策略调度',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:selAll',
    label: '查询所有信号灯策略调度',
  })
  async selAllSignalLightStrategySchedule(@Query() dto: SignalLightStrategyScheduleSelAllDto): Promise<R> {
    return this.signalLightStrategyScheduleService.selAllSignalLightStrategySchedule(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯策略调度（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:selOnes',
    label: '查询多个信号灯策略调度（根据id）',
  })
  async selOnesSignalLightStrategySchedule(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightStrategyScheduleService.selOnesSignalLightStrategySchedule(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯策略调度',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:selOne',
    label: '查询单个信号灯策略调度',
  })
  async selOneSignalLightStrategySchedule(@Param('id') id: number): Promise<R> {
    return this.signalLightStrategyScheduleService.selOneSignalLightStrategySchedule(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯策略调度',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:ins',
    label: '新增信号灯策略调度',
  })
  async insSignalLightStrategySchedule(@Body() dto: SignalLightStrategyScheduleInsOneDto): Promise<R> {
    return this.signalLightStrategyScheduleService.insSignalLightStrategySchedule(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯策略调度',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyScheduleInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:inss',
    label: '批量新增信号灯策略调度',
  })
  async insSignalLightStrategySchedules(@Body() dto: SignalLightStrategyScheduleInsMoreDto): Promise<R> {
    return this.signalLightStrategyScheduleService.insSignalLightStrategySchedules(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯策略调度',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:upd',
    label: '修改信号灯策略调度',
  })
  async updSignalLightStrategySchedule(@Body() dto: SignalLightStrategyScheduleUpdOneDto): Promise<R> {
    return this.signalLightStrategyScheduleService.updSignalLightStrategySchedule(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯策略调度',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyScheduleUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:upds',
    label: '批量修改信号灯策略调度',
  })
  async updSignalLightStrategySchedules(@Body() dto: SignalLightStrategyScheduleUpdMoreDto): Promise<R> {
    return this.signalLightStrategyScheduleService.updSignalLightStrategySchedules(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯策略调度',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategySchedule:del',
    label: '删除信号灯策略调度',
  })
  async delSignalLightStrategySchedule(@Body() ids: number[]): Promise<R> {
    return this.signalLightStrategyScheduleService.delSignalLightStrategySchedule(ids);
  }
}
