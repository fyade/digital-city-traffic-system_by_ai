import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LowAltitudeAircraftService } from './low-altitude-aircraft.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { LowAltitudeAircraftSelListDto, LowAltitudeAircraftSelAllDto, LowAltitudeAircraftInsOneDto, LowAltitudeAircraftUpdOneDto, LowAltitudeAircraftInsMoreDto, LowAltitudeAircraftUpdMoreDto } from './dto';

@Controller('/dcts/aircraft-manage/low-altitude-aircraft')
@ApiTags('数智交通全域调度系统/航空器管理/低空航空器')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class LowAltitudeAircraftController {
  constructor(private readonly lowAltitudeAircraftService: LowAltitudeAircraftService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:selList',
    label: '分页查询低空航空器',
  })
  async selLowAltitudeAircraft(@Query() dto: LowAltitudeAircraftSelListDto): Promise<R> {
    return this.lowAltitudeAircraftService.selLowAltitudeAircraft(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:selAll',
    label: '查询所有低空航空器',
  })
  async selAllLowAltitudeAircraft(@Query() dto: LowAltitudeAircraftSelAllDto): Promise<R> {
    return this.lowAltitudeAircraftService.selAllLowAltitudeAircraft(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个低空航空器（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:selOnes',
    label: '查询多个低空航空器（根据id）',
  })
  async selOnesLowAltitudeAircraft(@Query() ids: Record<string, string>): Promise<R> {
    return this.lowAltitudeAircraftService.selOnesLowAltitudeAircraft(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:selOne',
    label: '查询单个低空航空器',
  })
  async selOneLowAltitudeAircraft(@Param('id') id: string): Promise<R> {
    return this.lowAltitudeAircraftService.selOneLowAltitudeAircraft(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:ins',
    label: '新增低空航空器',
  })
  async insLowAltitudeAircraft(@Body() dto: LowAltitudeAircraftInsOneDto): Promise<R> {
    return this.lowAltitudeAircraftService.insLowAltitudeAircraft(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增低空航空器',
  })
  @ApiBody({
    isArray: true,
    type: LowAltitudeAircraftInsOneDto,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:inss',
    label: '批量新增低空航空器',
  })
  async insLowAltitudeAircrafts(@Body() dto: LowAltitudeAircraftInsMoreDto): Promise<R> {
    return this.lowAltitudeAircraftService.insLowAltitudeAircrafts(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:upd',
    label: '修改低空航空器',
  })
  async updLowAltitudeAircraft(@Body() dto: LowAltitudeAircraftUpdOneDto): Promise<R> {
    return this.lowAltitudeAircraftService.updLowAltitudeAircraft(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改低空航空器',
  })
  @ApiBody({
    isArray: true,
    type: LowAltitudeAircraftUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:upds',
    label: '批量修改低空航空器',
  })
  async updLowAltitudeAircrafts(@Body() dto: LowAltitudeAircraftUpdMoreDto): Promise<R> {
    return this.lowAltitudeAircraftService.updLowAltitudeAircrafts(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除低空航空器',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:lowAltitudeAircraft:del',
    label: '删除低空航空器',
  })
  async delLowAltitudeAircraft(@Body() ids: number[]): Promise<R> {
    return this.lowAltitudeAircraftService.delLowAltitudeAircraft(ids);
  }
}
