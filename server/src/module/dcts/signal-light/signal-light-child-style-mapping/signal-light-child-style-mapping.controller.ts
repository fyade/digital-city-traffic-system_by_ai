import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightChildStyleMappingService } from './signal-light-child-style-mapping.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightChildStyleMappingSelListDto, SignalLightChildStyleMappingSelAllDto, SignalLightChildStyleMappingInsOneDto, SignalLightChildStyleMappingUpdOneDto, SignalLightChildStyleMappingInsMoreDto, SignalLightChildStyleMappingUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light/signal-light-child-style-mapping')
@ApiTags(`${publicConfig.APP_NAME}/信号灯管理/子信号灯-信号灯样式关联`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightChildStyleMappingController {
  constructor(private readonly signalLightChildStyleMappingService: SignalLightChildStyleMappingService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询子信号灯-信号灯样式关联',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:selList',
    label: '分页查询子信号灯-信号灯样式关联',
  })
  async selSignalLightChildStyleMapping(@Query() dto: SignalLightChildStyleMappingSelListDto): Promise<R> {
    return this.signalLightChildStyleMappingService.selSignalLightChildStyleMapping(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有子信号灯-信号灯样式关联',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:selAll',
    label: '查询所有子信号灯-信号灯样式关联',
  })
  async selAllSignalLightChildStyleMapping(@Query() dto: SignalLightChildStyleMappingSelAllDto): Promise<R> {
    return this.signalLightChildStyleMappingService.selAllSignalLightChildStyleMapping(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个子信号灯-信号灯样式关联（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:selOnes',
    label: '查询多个子信号灯-信号灯样式关联（根据id）',
  })
  async selOnesSignalLightChildStyleMapping(@Query() ids: number[]): Promise<R> {
    return this.signalLightChildStyleMappingService.selOnesSignalLightChildStyleMapping(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个子信号灯-信号灯样式关联',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:selOne',
    label: '查询单个子信号灯-信号灯样式关联',
  })
  async selOneSignalLightChildStyleMapping(@Param('id') id: number): Promise<R> {
    return this.signalLightChildStyleMappingService.selOneSignalLightChildStyleMapping(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增子信号灯-信号灯样式关联',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:ins',
    label: '新增子信号灯-信号灯样式关联',
  })
  async insSignalLightChildStyleMapping(@Body() dto: SignalLightChildStyleMappingInsOneDto): Promise<R> {
    return this.signalLightChildStyleMappingService.insSignalLightChildStyleMapping(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增子信号灯-信号灯样式关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightChildStyleMappingInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:inss',
    label: '批量新增子信号灯-信号灯样式关联',
  })
  async insSignalLightChildStyleMappings(@Body() dto: SignalLightChildStyleMappingInsMoreDto): Promise<R> {
    return this.signalLightChildStyleMappingService.insSignalLightChildStyleMappings(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改子信号灯-信号灯样式关联',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:upd',
    label: '修改子信号灯-信号灯样式关联',
  })
  async updSignalLightChildStyleMapping(@Body() dto: SignalLightChildStyleMappingUpdOneDto): Promise<R> {
    return this.signalLightChildStyleMappingService.updSignalLightChildStyleMapping(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改子信号灯-信号灯样式关联',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightChildStyleMappingUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:upds',
    label: '批量修改子信号灯-信号灯样式关联',
  })
  async updSignalLightChildStyleMappings(@Body() dto: SignalLightChildStyleMappingUpdMoreDto): Promise<R> {
    return this.signalLightChildStyleMappingService.updSignalLightChildStyleMappings(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除子信号灯-信号灯样式关联',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:del',
    label: '删除子信号灯-信号灯样式关联',
  })
  async delSignalLightChildStyleMapping(@Body() ids: number[]): Promise<R> {
    return this.signalLightChildStyleMappingService.delSignalLightChildStyleMapping(ids);
  }

  @Post('/v2')
  @ApiOperation({
    summary: '新增子信号灯-信号灯样式关联v2',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightChildStyleMapping:insv2',
    label: '新增子信号灯-信号灯样式关联v2',
  })
  async insSignalLightChildStyleMappingV2(@Body() dto: SignalLightChildStyleMappingInsOneDto): Promise<R> {
    return this.signalLightChildStyleMappingService.insSignalLightChildStyleMappingV2(dto);
  }
}
