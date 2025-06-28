import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightInfoService } from './signal-light-info.service';
import { Authorize } from '../../../../../decorator/authorize.decorator';
import { R } from '../../../../../common/R';
import { SignalLightInfoSelListDto, SignalLightInfoSelAllDto, SignalLightInfoInsOneDto, SignalLightInfoUpdOneDto, SignalLightInfoInsMoreDto, SignalLightInfoUpdMoreDto } from './dto';

@Controller('/dcts/signal-light/signal-light-info')
@ApiTags('数字孪生城市交通管理系统/信号灯管理/信号灯信息管理')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightInfoController {
  constructor(private readonly signalLightInfoService: SignalLightInfoService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯信息管理',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selList',
    label: '分页查询信号灯信息管理',
  })
  async selSignalLightInfo(@Query() dto: SignalLightInfoSelListDto): Promise<R> {
    return this.signalLightInfoService.selSignalLightInfo(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯信息管理',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selAll',
    label: '查询所有信号灯信息管理',
  })
  async selAllSignalLightInfo(@Query() dto: SignalLightInfoSelAllDto): Promise<R> {
    return this.signalLightInfoService.selAllSignalLightInfo(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯信息管理（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selOnes',
    label: '查询多个信号灯信息管理（根据id）',
  })
  async selOnesSignalLightInfo(@Query() ids: number[]): Promise<R> {
    return this.signalLightInfoService.selOnesSignalLightInfo(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯信息管理',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:selOne',
    label: '查询单个信号灯信息管理',
  })
  async selOneSignalLightInfo(@Param('id') id: number): Promise<R> {
    return this.signalLightInfoService.selOneSignalLightInfo(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯信息管理',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:ins',
    label: '新增信号灯信息管理',
  })
  async insSignalLightInfo(@Body() dto: SignalLightInfoInsOneDto): Promise<R> {
    return this.signalLightInfoService.insSignalLightInfo(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯信息管理',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightInfoInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:inss',
    label: '批量新增信号灯信息管理',
  })
  async insSignalLightInfos(@Body() dto: SignalLightInfoInsMoreDto): Promise<R> {
    return this.signalLightInfoService.insSignalLightInfos(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯信息管理',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:upd',
    label: '修改信号灯信息管理',
  })
  async updSignalLightInfo(@Body() dto: SignalLightInfoUpdOneDto): Promise<R> {
    return this.signalLightInfoService.updSignalLightInfo(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯信息管理',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightInfoUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:upds',
    label: '批量修改信号灯信息管理',
  })
  async updSignalLightInfos(@Body() dto: SignalLightInfoUpdMoreDto): Promise<R> {
    return this.signalLightInfoService.updSignalLightInfos(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯信息管理',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightInfo:del',
    label: '删除信号灯信息管理',
  })
  async delSignalLightInfo(@Body() ids: number[]): Promise<R> {
    return this.signalLightInfoService.delSignalLightInfo(ids);
  }
}
