import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalLightGroupChildMappingService } from './signal-light-group-child-mapping.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { SignalLightGroupChildMappingSelListDto, SignalLightGroupChildMappingSelAllDto, SignalLightGroupChildMappingInsOneDto, SignalLightGroupChildMappingUpdOneDto, SignalLightGroupChildMappingInsMoreDto, SignalLightGroupChildMappingUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/signal-light/signal-light-group-child-mapping')
@ApiTags(`${publicConfig.APP_NAME}/信号灯管理/信号灯组-子信号灯对应`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class SignalLightGroupChildMappingController {
  constructor(private readonly signalLightGroupChildMappingService: SignalLightGroupChildMappingService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询信号灯组-子信号灯对应',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:selList',
    label: '分页查询信号灯组-子信号灯对应',
  })
  async selSignalLightGroupChildMapping(@Query() dto: SignalLightGroupChildMappingSelListDto): Promise<R> {
    return this.signalLightGroupChildMappingService.selSignalLightGroupChildMapping(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有信号灯组-子信号灯对应',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:selAll',
    label: '查询所有信号灯组-子信号灯对应',
  })
  async selAllSignalLightGroupChildMapping(@Query() dto: SignalLightGroupChildMappingSelAllDto): Promise<R> {
    return this.signalLightGroupChildMappingService.selAllSignalLightGroupChildMapping(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个信号灯组-子信号灯对应（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:selOnes',
    label: '查询多个信号灯组-子信号灯对应（根据id）',
  })
  async selOnesSignalLightGroupChildMapping(@Query() ids: Record<string, string>): Promise<R> {
    return this.signalLightGroupChildMappingService.selOnesSignalLightGroupChildMapping(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个信号灯组-子信号灯对应',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:selOne',
    label: '查询单个信号灯组-子信号灯对应',
  })
  async selOneSignalLightGroupChildMapping(@Param('id') id: string): Promise<R> {
    return this.signalLightGroupChildMappingService.selOneSignalLightGroupChildMapping(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增信号灯组-子信号灯对应',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:ins',
    label: '新增信号灯组-子信号灯对应',
  })
  async insSignalLightGroupChildMapping(@Body() dto: SignalLightGroupChildMappingInsOneDto): Promise<R> {
    return this.signalLightGroupChildMappingService.insSignalLightGroupChildMapping(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增信号灯组-子信号灯对应',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightGroupChildMappingInsOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:inss',
    label: '批量新增信号灯组-子信号灯对应',
  })
  async insSignalLightGroupChildMappings(@Body() dto: SignalLightGroupChildMappingInsMoreDto): Promise<R> {
    return this.signalLightGroupChildMappingService.insSignalLightGroupChildMappings(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改信号灯组-子信号灯对应',
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:upd',
    label: '修改信号灯组-子信号灯对应',
  })
  async updSignalLightGroupChildMapping(@Body() dto: SignalLightGroupChildMappingUpdOneDto): Promise<R> {
    return this.signalLightGroupChildMappingService.updSignalLightGroupChildMapping(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改信号灯组-子信号灯对应',
  })
  @ApiBody({
    isArray: true,
    type: SignalLightGroupChildMappingUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:upds',
    label: '批量修改信号灯组-子信号灯对应',
  })
  async updSignalLightGroupChildMappings(@Body() dto: SignalLightGroupChildMappingUpdMoreDto): Promise<R> {
    return this.signalLightGroupChildMappingService.updSignalLightGroupChildMappings(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除信号灯组-子信号灯对应',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:signalLight:signalLightGroupChildMapping:del',
    label: '删除信号灯组-子信号灯对应',
  })
  async delSignalLightGroupChildMapping(@Body() ids: number[]): Promise<R> {
    return this.signalLightGroupChildMappingService.delSignalLightGroupChildMapping(ids);
  }
}
