import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightGroupStrategyTypeMappingService } from './signal-light-group-strategy-type-mapping.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightGroupStrategyTypeMappingSelListDto, SignalLightGroupStrategyTypeMappingSelAllDto, SignalLightGroupStrategyTypeMappingInsOneDto, SignalLightGroupStrategyTypeMappingUpdOneDto, SignalLightGroupStrategyTypeMappingInsMoreDto, SignalLightGroupStrategyTypeMappingUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light-strategy/signal-light-group-strategy-type-mapping')
@ApiTags(`${publicConfig.APP_NAME}/信号灯策略管理/信号灯组-信号灯策略类型关联`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightGroupStrategyTypeMappingController {
  constructor(private readonly signalLightGroupStrategyTypeMappingService: SignalLightGroupStrategyTypeMappingService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯组-信号灯策略类型关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:selList',
    label: '分页查询信号灯组-信号灯策略类型关联',
  })
  async selSignalLightGroupStrategyTypeMapping(@Query() dto: SignalLightGroupStrategyTypeMappingSelListDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.selSignalLightGroupStrategyTypeMapping(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯组-信号灯策略类型关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:selAll',
    label: '查询所有信号灯组-信号灯策略类型关联',
  })
  async selAllSignalLightGroupStrategyTypeMapping(@Query() dto: SignalLightGroupStrategyTypeMappingSelAllDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.selAllSignalLightGroupStrategyTypeMapping(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯组-信号灯策略类型关联（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:selOnes',
    label: '查询多个信号灯组-信号灯策略类型关联（根据id）',
  })
  async selOnesSignalLightGroupStrategyTypeMapping(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.selOnesSignalLightGroupStrategyTypeMapping(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯组-信号灯策略类型关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:selOne',
    label: '查询单个信号灯组-信号灯策略类型关联',
  })
  async selOneSignalLightGroupStrategyTypeMapping(@Param('id') id: string): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.selOneSignalLightGroupStrategyTypeMapping(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯组-信号灯策略类型关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:ins',
    label: '新增信号灯组-信号灯策略类型关联',
  })
  async insSignalLightGroupStrategyTypeMapping(@Body() dto: SignalLightGroupStrategyTypeMappingInsOneDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.insSignalLightGroupStrategyTypeMapping(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯组-信号灯策略类型关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightGroupStrategyTypeMappingInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:inss',
    label: '批量新增信号灯组-信号灯策略类型关联',
  })
  async insSignalLightGroupStrategyTypeMappings(@Body() dto: SignalLightGroupStrategyTypeMappingInsMoreDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.insSignalLightGroupStrategyTypeMappings(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯组-信号灯策略类型关联',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:upd',
    label: '修改信号灯组-信号灯策略类型关联',
  })
  async updSignalLightGroupStrategyTypeMapping(@Body() dto: SignalLightGroupStrategyTypeMappingUpdOneDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.updSignalLightGroupStrategyTypeMapping(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯组-信号灯策略类型关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightGroupStrategyTypeMappingUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:upds',
    label: '批量修改信号灯组-信号灯策略类型关联',
  })
  async updSignalLightGroupStrategyTypeMappings(@Body() dto: SignalLightGroupStrategyTypeMappingUpdMoreDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.updSignalLightGroupStrategyTypeMappings(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯组-信号灯策略类型关联',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:del',
    label: '删除信号灯组-信号灯策略类型关联',
  })
  async delSignalLightGroupStrategyTypeMapping(@Body() ids: number[]): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.delSignalLightGroupStrategyTypeMapping(ids);
  }

  @Post('/v2')
  @ApiOperation({
    summary: '新增信号灯组-信号灯策略类型关联v2',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightGroupStrategyTypeMapping:insv2',
    label: '新增信号灯组-信号灯策略类型关联v2',
  })
  async insSignalLightGroupStrategyTypeMappingV2(@Body() dto: SignalLightGroupStrategyTypeMappingInsOneDto): Promise<R> {
    return this.signalLightGroupStrategyTypeMappingService.insSignalLightGroupStrategyTypeMappingV2(dto);
  }
}
