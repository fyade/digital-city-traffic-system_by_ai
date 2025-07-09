import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightChildStrategyScheduleMappingService } from './signal-light-child-strategy-schedule-mapping.service';
import { Authorize } from '../../../../../decorator/authorize.decorator';
import { R } from '../../../../../common/R';
import { SignalLightChildStrategyScheduleMappingSelListDto, SignalLightChildStrategyScheduleMappingSelAllDto, SignalLightChildStrategyScheduleMappingInsOneDto, SignalLightChildStrategyScheduleMappingUpdOneDto, SignalLightChildStrategyScheduleMappingInsMoreDto, SignalLightChildStrategyScheduleMappingUpdMoreDto } from './dto';

@Controller('/dcts/signal-light-strategy/signal-light-child-strategy-schedule-mapping')
@ApiTags('数智交通全域调度系统/信号灯策略管理/子信号灯-信号灯策略调度关联')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightChildStrategyScheduleMappingController {
  constructor(private readonly signalLightChildStrategyScheduleMappingService: SignalLightChildStrategyScheduleMappingService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询子信号灯-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:selList',
    label: '分页查询子信号灯-信号灯策略调度关联',
  })
  async selSignalLightChildStrategyScheduleMapping(@Query() dto: SignalLightChildStrategyScheduleMappingSelListDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.selSignalLightChildStrategyScheduleMapping(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有子信号灯-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:selAll',
    label: '查询所有子信号灯-信号灯策略调度关联',
  })
  async selAllSignalLightChildStrategyScheduleMapping(@Query() dto: SignalLightChildStrategyScheduleMappingSelAllDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.selAllSignalLightChildStrategyScheduleMapping(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个子信号灯-信号灯策略调度关联（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:selOnes',
    label: '查询多个子信号灯-信号灯策略调度关联（根据id）',
  })
  async selOnesSignalLightChildStrategyScheduleMapping(@Query() ids: number[]): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.selOnesSignalLightChildStrategyScheduleMapping(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个子信号灯-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:selOne',
    label: '查询单个子信号灯-信号灯策略调度关联',
  })
  async selOneSignalLightChildStrategyScheduleMapping(@Param('id') id: number): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.selOneSignalLightChildStrategyScheduleMapping(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增子信号灯-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:ins',
    label: '新增子信号灯-信号灯策略调度关联',
  })
  async insSignalLightChildStrategyScheduleMapping(@Body() dto: SignalLightChildStrategyScheduleMappingInsOneDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.insSignalLightChildStrategyScheduleMapping(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增子信号灯-信号灯策略调度关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightChildStrategyScheduleMappingInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:inss',
    label: '批量新增子信号灯-信号灯策略调度关联',
  })
  async insSignalLightChildStrategyScheduleMappings(@Body() dto: SignalLightChildStrategyScheduleMappingInsMoreDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.insSignalLightChildStrategyScheduleMappings(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改子信号灯-信号灯策略调度关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:upd',
    label: '修改子信号灯-信号灯策略调度关联',
  })
  async updSignalLightChildStrategyScheduleMapping(@Body() dto: SignalLightChildStrategyScheduleMappingUpdOneDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.updSignalLightChildStrategyScheduleMapping(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改子信号灯-信号灯策略调度关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightChildStrategyScheduleMappingUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:upds',
    label: '批量修改子信号灯-信号灯策略调度关联',
  })
  async updSignalLightChildStrategyScheduleMappings(@Body() dto: SignalLightChildStrategyScheduleMappingUpdMoreDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.updSignalLightChildStrategyScheduleMappings(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除子信号灯-信号灯策略调度关联',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:del',
    label: '删除子信号灯-信号灯策略调度关联',
  })
  async delSignalLightChildStrategyScheduleMapping(@Body() ids: number[]): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.delSignalLightChildStrategyScheduleMapping(ids);
  }

  @Post('/v2')
  @ApiOperation({
    summary: '新增子信号灯-信号灯策略调度关联v2',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightChildStrategyScheduleMapping:insv2',
    label: '新增子信号灯-信号灯策略调度关联v2',
  })
  async insSignalLightChildStrategyScheduleMappingV2(@Body() dto: SignalLightChildStrategyScheduleMappingInsOneDto): Promise<R> {
    return this.signalLightChildStrategyScheduleMappingService.insSignalLightChildStrategyScheduleMappingV2(dto);
  }
}
