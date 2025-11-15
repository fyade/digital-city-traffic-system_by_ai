import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightStrategyTypeService } from './signal-light-strategy-type.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightStrategyTypeSelListDto, SignalLightStrategyTypeSelAllDto, SignalLightStrategyTypeInsOneDto, SignalLightStrategyTypeUpdOneDto, SignalLightStrategyTypeInsMoreDto, SignalLightStrategyTypeUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light-strategy/signal-light-strategy-type')
@ApiTags(`${publicConfig.APP_NAME}/信号灯策略管理/信号灯策略类型`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightStrategyTypeController {
  constructor(private readonly signalLightStrategyTypeService: SignalLightStrategyTypeService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯策略类型',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:selList',
    label: '分页查询信号灯策略类型',
  })
  async selSignalLightStrategyType(@Query() dto: SignalLightStrategyTypeSelListDto): Promise<R> {
    return this.signalLightStrategyTypeService.selSignalLightStrategyType(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯策略类型',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:selAll',
    label: '查询所有信号灯策略类型',
  })
  async selAllSignalLightStrategyType(@Query() dto: SignalLightStrategyTypeSelAllDto): Promise<R> {
    return this.signalLightStrategyTypeService.selAllSignalLightStrategyType(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯策略类型（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:selOnes',
    label: '查询多个信号灯策略类型（根据id）',
  })
  async selOnesSignalLightStrategyType(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightStrategyTypeService.selOnesSignalLightStrategyType(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯策略类型',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:selOne',
    label: '查询单个信号灯策略类型',
  })
  async selOneSignalLightStrategyType(@Param('id') id: string): Promise<R> {
    return this.signalLightStrategyTypeService.selOneSignalLightStrategyType(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯策略类型',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:ins',
    label: '新增信号灯策略类型',
  })
  async insSignalLightStrategyType(@Body() dto: SignalLightStrategyTypeInsOneDto): Promise<R> {
    return this.signalLightStrategyTypeService.insSignalLightStrategyType(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯策略类型',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyTypeInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:inss',
    label: '批量新增信号灯策略类型',
  })
  async insSignalLightStrategyTypes(@Body() dto: SignalLightStrategyTypeInsMoreDto): Promise<R> {
    return this.signalLightStrategyTypeService.insSignalLightStrategyTypes(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯策略类型',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:upd',
    label: '修改信号灯策略类型',
  })
  async updSignalLightStrategyType(@Body() dto: SignalLightStrategyTypeUpdOneDto): Promise<R> {
    return this.signalLightStrategyTypeService.updSignalLightStrategyType(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯策略类型',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyTypeUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:upds',
    label: '批量修改信号灯策略类型',
  })
  async updSignalLightStrategyTypes(@Body() dto: SignalLightStrategyTypeUpdMoreDto): Promise<R> {
    return this.signalLightStrategyTypeService.updSignalLightStrategyTypes(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯策略类型',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyType:del',
    label: '删除信号灯策略类型',
  })
  async delSignalLightStrategyType(@Body() ids: number[]): Promise<R> {
    return this.signalLightStrategyTypeService.delSignalLightStrategyType(ids);
  }
}
