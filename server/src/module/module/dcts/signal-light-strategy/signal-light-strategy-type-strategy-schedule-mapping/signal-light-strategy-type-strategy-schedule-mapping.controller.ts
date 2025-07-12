import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightStrategyTypeStrategyScheduleMappingService } from './signal-light-strategy-type-strategy-schedule-mapping.service';
import { Authorize } from '../../../../../decorator/authorize.decorator';
import { R } from '../../../../../common/R';
import { SignalLightStrategyTypeStrategyScheduleMappingSelListDto, SignalLightStrategyTypeStrategyScheduleMappingSelAllDto, SignalLightStrategyTypeStrategyScheduleMappingInsOneDto, SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto, SignalLightStrategyTypeStrategyScheduleMappingInsMoreDto, SignalLightStrategyTypeStrategyScheduleMappingUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light-strategy/signal-light-strategy-type-strategy-schedule-mapping')
@ApiTags(`${publicConfig.APP_NAME}/信号灯策略管理/信号灯策略类型-信号灯策略调度关联`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightStrategyTypeStrategyScheduleMappingController {
  constructor(private readonly signalLightStrategyTypeStrategyScheduleMappingService: SignalLightStrategyTypeStrategyScheduleMappingService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯策略类型-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:selList',
    label: '分页查询信号灯策略类型-信号灯策略调度关联',
  })
  async selSignalLightStrategyTypeStrategyScheduleMapping(@Query() dto: SignalLightStrategyTypeStrategyScheduleMappingSelListDto): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.selSignalLightStrategyTypeStrategyScheduleMapping(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯策略类型-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:selAll',
    label: '查询所有信号灯策略类型-信号灯策略调度关联',
  })
  async selAllSignalLightStrategyTypeStrategyScheduleMapping(@Query() dto: SignalLightStrategyTypeStrategyScheduleMappingSelAllDto): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.selAllSignalLightStrategyTypeStrategyScheduleMapping(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯策略类型-信号灯策略调度关联（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:selOnes',
    label: '查询多个信号灯策略类型-信号灯策略调度关联（根据id）',
  })
  async selOnesSignalLightStrategyTypeStrategyScheduleMapping(@Query() ids: number[]): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.selOnesSignalLightStrategyTypeStrategyScheduleMapping(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯策略类型-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:selOne',
    label: '查询单个信号灯策略类型-信号灯策略调度关联',
  })
  async selOneSignalLightStrategyTypeStrategyScheduleMapping(@Param('id') id: number): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.selOneSignalLightStrategyTypeStrategyScheduleMapping(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯策略类型-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:ins',
    label: '新增信号灯策略类型-信号灯策略调度关联',
  })
  async insSignalLightStrategyTypeStrategyScheduleMapping(@Body() dto: SignalLightStrategyTypeStrategyScheduleMappingInsOneDto): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.insSignalLightStrategyTypeStrategyScheduleMapping(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯策略类型-信号灯策略调度关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyTypeStrategyScheduleMappingInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:inss',
    label: '批量新增信号灯策略类型-信号灯策略调度关联',
  })
  async insSignalLightStrategyTypeStrategyScheduleMappings(@Body() dto: SignalLightStrategyTypeStrategyScheduleMappingInsMoreDto): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.insSignalLightStrategyTypeStrategyScheduleMappings(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯策略类型-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:upd',
    label: '修改信号灯策略类型-信号灯策略调度关联',
  })
  async updSignalLightStrategyTypeStrategyScheduleMapping(@Body() dto: SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.updSignalLightStrategyTypeStrategyScheduleMapping(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯策略类型-信号灯策略调度关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:upds',
    label: '批量修改信号灯策略类型-信号灯策略调度关联',
  })
  async updSignalLightStrategyTypeStrategyScheduleMappings(@Body() dto: SignalLightStrategyTypeStrategyScheduleMappingUpdMoreDto): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.updSignalLightStrategyTypeStrategyScheduleMappings(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯策略类型-信号灯策略调度关联',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyTypeStrategyScheduleMapping:del',
    label: '删除信号灯策略类型-信号灯策略调度关联',
  })
  async delSignalLightStrategyTypeStrategyScheduleMapping(@Body() ids: number[]): Promise<R> {
    return this.signalLightStrategyTypeStrategyScheduleMappingService.delSignalLightStrategyTypeStrategyScheduleMapping(ids);
  }
}
