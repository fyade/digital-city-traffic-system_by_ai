import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightStyleService } from './signal-light-style.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightStyleSelListDto, SignalLightStyleSelAllDto, SignalLightStyleInsOneDto, SignalLightStyleUpdOneDto, SignalLightStyleInsMoreDto, SignalLightStyleUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light/signal-light-style')
@ApiTags(`${publicConfig.APP_NAME}/信号灯管理/信号灯样式`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightStyleController {
  constructor(private readonly signalLightStyleService: SignalLightStyleService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯样式',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:selList',
    label: '分页查询信号灯样式',
  })
  async selSignalLightStyle(@Query() dto: SignalLightStyleSelListDto): Promise<R> {
    return this.signalLightStyleService.selSignalLightStyle(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯样式',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:selAll',
    label: '查询所有信号灯样式',
  })
  async selAllSignalLightStyle(@Query() dto: SignalLightStyleSelAllDto): Promise<R> {
    return this.signalLightStyleService.selAllSignalLightStyle(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯样式（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:selOnes',
    label: '查询多个信号灯样式（根据id）',
  })
  async selOnesSignalLightStyle(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightStyleService.selOnesSignalLightStyle(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯样式',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:selOne',
    label: '查询单个信号灯样式',
  })
  async selOneSignalLightStyle(@Param('id') id: number): Promise<R> {
    return this.signalLightStyleService.selOneSignalLightStyle(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯样式',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:ins',
    label: '新增信号灯样式',
  })
  async insSignalLightStyle(@Body() dto: SignalLightStyleInsOneDto): Promise<R> {
    return this.signalLightStyleService.insSignalLightStyle(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯样式',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStyleInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:inss',
    label: '批量新增信号灯样式',
  })
  async insSignalLightStyles(@Body() dto: SignalLightStyleInsMoreDto): Promise<R> {
    return this.signalLightStyleService.insSignalLightStyles(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯样式',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:upd',
    label: '修改信号灯样式',
  })
  async updSignalLightStyle(@Body() dto: SignalLightStyleUpdOneDto): Promise<R> {
    return this.signalLightStyleService.updSignalLightStyle(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯样式',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightStyleUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:upds',
    label: '批量修改信号灯样式',
  })
  async updSignalLightStyles(@Body() dto: SignalLightStyleUpdMoreDto): Promise<R> {
    return this.signalLightStyleService.updSignalLightStyles(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯样式',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightStyle:del',
    label: '删除信号灯样式',
  })
  async delSignalLightStyle(@Body() ids: number[]): Promise<R> {
    return this.signalLightStyleService.delSignalLightStyle(ids);
  }
}
