import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightStrategyScheduleStrategyParamMappingService } from './signal-light-strategy-schedule-strategy-param-mapping.service';
import { Authorize } from '../../../../../decorator/authorize.decorator';
import { R } from '../../../../../common/R';
import { SignalLightStrategyScheduleStrategyParamMappingSelListDto, SignalLightStrategyScheduleStrategyParamMappingSelAllDto, SignalLightStrategyScheduleStrategyParamMappingInsOneDto, SignalLightStrategyScheduleStrategyParamMappingUpdOneDto, SignalLightStrategyScheduleStrategyParamMappingInsMoreDto, SignalLightStrategyScheduleStrategyParamMappingUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light-strategy/signal-light-strategy-schedule-strategy-param-mapping')
@ApiTags(`${publicConfig.APP_NAME}/信号灯策略管理/信号灯策略调度-信号灯策略参数关联`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightStrategyScheduleStrategyParamMappingController {
  constructor(private readonly signalLightStrategyScheduleStrategyParamMappingService: SignalLightStrategyScheduleStrategyParamMappingService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯策略调度-信号灯策略参数关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:selList',
    label: '分页查询信号灯策略调度-信号灯策略参数关联',
  })
  async selSignalLightStrategyScheduleStrategyParamMapping(@Query() dto: SignalLightStrategyScheduleStrategyParamMappingSelListDto): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.selSignalLightStrategyScheduleStrategyParamMapping(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯策略调度-信号灯策略参数关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:selAll',
    label: '查询所有信号灯策略调度-信号灯策略参数关联',
  })
  async selAllSignalLightStrategyScheduleStrategyParamMapping(@Query() dto: SignalLightStrategyScheduleStrategyParamMappingSelAllDto): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.selAllSignalLightStrategyScheduleStrategyParamMapping(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯策略调度-信号灯策略参数关联（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:selOnes',
    label: '查询多个信号灯策略调度-信号灯策略参数关联（根据id）',
  })
  async selOnesSignalLightStrategyScheduleStrategyParamMapping(@Query() ids: number[]): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.selOnesSignalLightStrategyScheduleStrategyParamMapping(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯策略调度-信号灯策略参数关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:selOne',
    label: '查询单个信号灯策略调度-信号灯策略参数关联',
  })
  async selOneSignalLightStrategyScheduleStrategyParamMapping(@Param('id') id: number): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.selOneSignalLightStrategyScheduleStrategyParamMapping(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯策略调度-信号灯策略参数关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:ins',
    label: '新增信号灯策略调度-信号灯策略参数关联',
  })
  async insSignalLightStrategyScheduleStrategyParamMapping(@Body() dto: SignalLightStrategyScheduleStrategyParamMappingInsOneDto): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.insSignalLightStrategyScheduleStrategyParamMapping(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯策略调度-信号灯策略参数关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyScheduleStrategyParamMappingInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:inss',
    label: '批量新增信号灯策略调度-信号灯策略参数关联',
  })
  async insSignalLightStrategyScheduleStrategyParamMappings(@Body() dto: SignalLightStrategyScheduleStrategyParamMappingInsMoreDto): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.insSignalLightStrategyScheduleStrategyParamMappings(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯策略调度-信号灯策略参数关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:upd',
    label: '修改信号灯策略调度-信号灯策略参数关联',
  })
  async updSignalLightStrategyScheduleStrategyParamMapping(@Body() dto: SignalLightStrategyScheduleStrategyParamMappingUpdOneDto): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.updSignalLightStrategyScheduleStrategyParamMapping(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯策略调度-信号灯策略参数关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyScheduleStrategyParamMappingUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:upds',
    label: '批量修改信号灯策略调度-信号灯策略参数关联',
  })
  async updSignalLightStrategyScheduleStrategyParamMappings(@Body() dto: SignalLightStrategyScheduleStrategyParamMappingUpdMoreDto): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.updSignalLightStrategyScheduleStrategyParamMappings(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯策略调度-信号灯策略参数关联',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyScheduleStrategyParamMapping:del',
    label: '删除信号灯策略调度-信号灯策略参数关联',
  })
  async delSignalLightStrategyScheduleStrategyParamMapping(@Body() ids: number[]): Promise<R> {
    return this.signalLightStrategyScheduleStrategyParamMappingService.delSignalLightStrategyScheduleStrategyParamMapping(ids);
  }
}
