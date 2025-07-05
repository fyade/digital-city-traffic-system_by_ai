import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightGroupInfoService } from './signal-light-group-info.service';
import { Authorize } from '../../../../../decorator/authorize.decorator';
import { R } from '../../../../../common/R';
import { SignalLightGroupInfoSelListDto, SignalLightGroupInfoSelAllDto, SignalLightGroupInfoInsOneDto, SignalLightGroupInfoUpdOneDto, SignalLightGroupInfoInsMoreDto, SignalLightGroupInfoUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light/signal-light-group-info')
@ApiTags(`${publicConfig.APP_NAME}/信号灯管理/信号灯组信息`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightGroupInfoController {
  constructor(private readonly signalLightGroupInfoService: SignalLightGroupInfoService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯组信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:selList',
    label: '分页查询信号灯组信息',
  })
  async selSignalLightGroupInfo(@Query() dto: SignalLightGroupInfoSelListDto): Promise<R> {
    return this.signalLightGroupInfoService.selSignalLightGroupInfo(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯组信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:selAll',
    label: '查询所有信号灯组信息',
  })
  async selAllSignalLightGroupInfo(@Query() dto: SignalLightGroupInfoSelAllDto): Promise<R> {
    return this.signalLightGroupInfoService.selAllSignalLightGroupInfo(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯组信息（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:selOnes',
    label: '查询多个信号灯组信息（根据id）',
  })
  async selOnesSignalLightGroupInfo(@Query() ids: number[]): Promise<R> {
    return this.signalLightGroupInfoService.selOnesSignalLightGroupInfo(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯组信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:selOne',
    label: '查询单个信号灯组信息',
  })
  async selOneSignalLightGroupInfo(@Param('id') id: number): Promise<R> {
    return this.signalLightGroupInfoService.selOneSignalLightGroupInfo(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯组信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:ins',
    label: '新增信号灯组信息',
  })
  async insSignalLightGroupInfo(@Body() dto: SignalLightGroupInfoInsOneDto): Promise<R> {
    return this.signalLightGroupInfoService.insSignalLightGroupInfo(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯组信息',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightGroupInfoInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:inss',
    label: '批量新增信号灯组信息',
  })
  async insSignalLightGroupInfos(@Body() dto: SignalLightGroupInfoInsMoreDto): Promise<R> {
    return this.signalLightGroupInfoService.insSignalLightGroupInfos(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯组信息',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:upd',
    label: '修改信号灯组信息',
  })
  async updSignalLightGroupInfo(@Body() dto: SignalLightGroupInfoUpdOneDto): Promise<R> {
    return this.signalLightGroupInfoService.updSignalLightGroupInfo(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯组信息',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightGroupInfoUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:upds',
    label: '批量修改信号灯组信息',
  })
  async updSignalLightGroupInfos(@Body() dto: SignalLightGroupInfoUpdMoreDto): Promise<R> {
    return this.signalLightGroupInfoService.updSignalLightGroupInfos(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯组信息',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupInfo:del',
    label: '删除信号灯组信息',
  })
  async delSignalLightGroupInfo(@Body() ids: number[]): Promise<R> {
    return this.signalLightGroupInfoService.delSignalLightGroupInfo(ids);
  }
}
