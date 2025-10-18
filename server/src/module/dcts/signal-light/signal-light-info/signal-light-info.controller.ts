import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightInfoService } from './signal-light-info.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightInfoSelListDto, SignalLightInfoSelAllDto, SignalLightInfoInsOneDto, SignalLightInfoUpdOneDto, SignalLightInfoInsMoreDto, SignalLightInfoUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light/signal-light-info')
@ApiTags(`${publicConfig.APP_NAME}/信号灯管理/子信号灯信息`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightInfoController {
  constructor(private readonly signalLightInfoService: SignalLightInfoService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询子信号灯信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selList',
    label: '分页查询子信号灯信息',
  })
  async selSignalLightInfo(@Query() dto: SignalLightInfoSelListDto): Promise<R> {
    return this.signalLightInfoService.selSignalLightInfo(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有子信号灯信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selAll',
    label: '查询所有子信号灯信息',
  })
  async selAllSignalLightInfo(@Query() dto: SignalLightInfoSelAllDto): Promise<R> {
    return this.signalLightInfoService.selAllSignalLightInfo(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个子信号灯信息（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selOnes',
    label: '查询多个子信号灯信息（根据id）',
  })
  async selOnesSignalLightInfo(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightInfoService.selOnesSignalLightInfo(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个子信号灯信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selOne',
    label: '查询单个子信号灯信息',
  })
  async selOneSignalLightInfo(@Param('id') id: number): Promise<R> {
    return this.signalLightInfoService.selOneSignalLightInfo(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增子信号灯信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:ins',
    label: '新增子信号灯信息',
  })
  async insSignalLightInfo(@Body() dto: SignalLightInfoInsOneDto): Promise<R> {
    return this.signalLightInfoService.insSignalLightInfo(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增子信号灯信息',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightInfoInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:inss',
    label: '批量新增子信号灯信息',
  })
  async insSignalLightInfos(@Body() dto: SignalLightInfoInsMoreDto): Promise<R> {
    return this.signalLightInfoService.insSignalLightInfos(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改子信号灯信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:upd',
    label: '修改子信号灯信息',
  })
  async updSignalLightInfo(@Body() dto: SignalLightInfoUpdOneDto): Promise<R> {
    return this.signalLightInfoService.updSignalLightInfo(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改子信号灯信息',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightInfoUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:upds',
    label: '批量修改子信号灯信息',
  })
  async updSignalLightInfos(@Body() dto: SignalLightInfoUpdMoreDto): Promise<R> {
    return this.signalLightInfoService.updSignalLightInfos(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除子信号灯信息',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:del',
    label: '删除子信号灯信息',
  })
  async delSignalLightInfo(@Body() ids: number[]): Promise<R> {
    return this.signalLightInfoService.delSignalLightInfo(ids);
  }

  @Delete('/v2')
  @ApiOperation({
    summary: '删除子信号灯信息v2',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:delv2',
    label: '删除子信号灯信息v2',
  })
  async delSignalLightInfoV2(@Body() ids: number[]): Promise<R> {
    return this.signalLightInfoService.delSignalLightInfoV2(ids);
  }
}
