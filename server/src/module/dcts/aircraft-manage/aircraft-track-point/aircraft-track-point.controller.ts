import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AircraftTrackPointService } from './aircraft-track-point.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { AircraftTrackPointSelListDto, AircraftTrackPointSelAllDto, AircraftTrackPointInsOneDto, AircraftTrackPointUpdOneDto, AircraftTrackPointInsMoreDto, AircraftTrackPointUpdMoreDto } from './dto';

@Controller('/dcts/aircraft-manage/aircraft-track-point')
@ApiTags('数智交通全域调度系统/航空器管理/航空器轨迹点')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class AircraftTrackPointController {
  constructor(private readonly aircraftTrackPointService: AircraftTrackPointService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询航空器轨迹点',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:selList',
    label: '分页查询航空器轨迹点',
  })
  async selAircraftTrackPoint(@Query() dto: AircraftTrackPointSelListDto): Promise<R> {
    return this.aircraftTrackPointService.selAircraftTrackPoint(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有航空器轨迹点',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:selAll',
    label: '查询所有航空器轨迹点',
  })
  async selAllAircraftTrackPoint(@Query() dto: AircraftTrackPointSelAllDto): Promise<R> {
    return this.aircraftTrackPointService.selAllAircraftTrackPoint(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个航空器轨迹点（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:selOnes',
    label: '查询多个航空器轨迹点（根据id）',
  })
  async selOnesAircraftTrackPoint(@Query() ids: Record<string, string>): Promise<R> {
    return this.aircraftTrackPointService.selOnesAircraftTrackPoint(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个航空器轨迹点',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:selOne',
    label: '查询单个航空器轨迹点',
  })
  async selOneAircraftTrackPoint(@Param('id') id: string): Promise<R> {
    return this.aircraftTrackPointService.selOneAircraftTrackPoint(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增航空器轨迹点',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:ins',
    label: '新增航空器轨迹点',
  })
  async insAircraftTrackPoint(@Body() dto: AircraftTrackPointInsOneDto): Promise<R> {
    return this.aircraftTrackPointService.insAircraftTrackPoint(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增航空器轨迹点',
  })
  @ApiBody({
    isArray: true,
    type: AircraftTrackPointInsOneDto,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:inss',
    label: '批量新增航空器轨迹点',
  })
  async insAircraftTrackPoints(@Body() dto: AircraftTrackPointInsMoreDto): Promise<R> {
    return this.aircraftTrackPointService.insAircraftTrackPoints(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改航空器轨迹点',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:upd',
    label: '修改航空器轨迹点',
  })
  async updAircraftTrackPoint(@Body() dto: AircraftTrackPointUpdOneDto): Promise<R> {
    return this.aircraftTrackPointService.updAircraftTrackPoint(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改航空器轨迹点',
  })
  @ApiBody({
    isArray: true,
    type: AircraftTrackPointUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:upds',
    label: '批量修改航空器轨迹点',
  })
  async updAircraftTrackPoints(@Body() dto: AircraftTrackPointUpdMoreDto): Promise<R> {
    return this.aircraftTrackPointService.updAircraftTrackPoints(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除航空器轨迹点',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:aircraftTrackPoint:del',
    label: '删除航空器轨迹点',
  })
  async delAircraftTrackPoint(@Body() ids: number[]): Promise<R> {
    return this.aircraftTrackPointService.delAircraftTrackPoint(ids);
  }
}
