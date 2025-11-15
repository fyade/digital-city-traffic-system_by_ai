import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightStrategyParamService } from './signal-light-strategy-param.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightStrategyParamSelListDto, SignalLightStrategyParamSelAllDto, SignalLightStrategyParamInsOneDto, SignalLightStrategyParamUpdOneDto, SignalLightStrategyParamInsMoreDto, SignalLightStrategyParamUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light-strategy/signal-light-strategy-param')
@ApiTags(`${publicConfig.APP_NAME}/信号灯策略管理/信号灯策略参数`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightStrategyParamController {
  constructor(private readonly signalLightStrategyParamService: SignalLightStrategyParamService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯策略参数',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:selList',
    label: '分页查询信号灯策略参数',
  })
  async selSignalLightStrategyParam(@Query() dto: SignalLightStrategyParamSelListDto): Promise<R> {
    return this.signalLightStrategyParamService.selSignalLightStrategyParam(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯策略参数',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:selAll',
    label: '查询所有信号灯策略参数',
  })
  async selAllSignalLightStrategyParam(@Query() dto: SignalLightStrategyParamSelAllDto): Promise<R> {
    return this.signalLightStrategyParamService.selAllSignalLightStrategyParam(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯策略参数（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:selOnes',
    label: '查询多个信号灯策略参数（根据id）',
  })
  async selOnesSignalLightStrategyParam(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightStrategyParamService.selOnesSignalLightStrategyParam(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯策略参数',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:selOne',
    label: '查询单个信号灯策略参数',
  })
  async selOneSignalLightStrategyParam(@Param('id') id: string): Promise<R> {
    return this.signalLightStrategyParamService.selOneSignalLightStrategyParam(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯策略参数',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:ins',
    label: '新增信号灯策略参数',
  })
  async insSignalLightStrategyParam(@Body() dto: SignalLightStrategyParamInsOneDto): Promise<R> {
    return this.signalLightStrategyParamService.insSignalLightStrategyParam(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯策略参数',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyParamInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:inss',
    label: '批量新增信号灯策略参数',
  })
  async insSignalLightStrategyParams(@Body() dto: SignalLightStrategyParamInsMoreDto): Promise<R> {
    return this.signalLightStrategyParamService.insSignalLightStrategyParams(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯策略参数',
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:upd',
    label: '修改信号灯策略参数',
  })
  async updSignalLightStrategyParam(@Body() dto: SignalLightStrategyParamUpdOneDto): Promise<R> {
    return this.signalLightStrategyParamService.updSignalLightStrategyParam(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯策略参数',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStrategyParamUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:upds',
    label: '批量修改信号灯策略参数',
  })
  async updSignalLightStrategyParams(@Body() dto: SignalLightStrategyParamUpdMoreDto): Promise<R> {
    return this.signalLightStrategyParamService.updSignalLightStrategyParams(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯策略参数',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLightStrategy:signalLightStrategyParam:del',
    label: '删除信号灯策略参数',
  })
  async delSignalLightStrategyParam(@Body() ids: number[]): Promise<R> {
    return this.signalLightStrategyParamService.delSignalLightStrategyParam(ids);
  }
}
