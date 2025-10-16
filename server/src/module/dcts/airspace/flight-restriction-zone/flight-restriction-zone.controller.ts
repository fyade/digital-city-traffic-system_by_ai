import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FlightRestrictionZoneService } from './flight-restriction-zone.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { FlightRestrictionZoneSelListDto, FlightRestrictionZoneSelAllDto, FlightRestrictionZoneInsOneDto, FlightRestrictionZoneUpdOneDto, FlightRestrictionZoneInsMoreDto, FlightRestrictionZoneUpdMoreDto } from './dto';

@Controller('/dcts/airspace/flight-restriction-zone')
@ApiTags('数智交通全域调度系统/空域管理/限飞区')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class FlightRestrictionZoneController {
  constructor(private readonly flightRestrictionZoneService: FlightRestrictionZoneService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询限飞区',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:selList',
    label: '分页查询限飞区',
  })
  async selFlightRestrictionZone(@Query() dto: FlightRestrictionZoneSelListDto): Promise<R> {
    return this.flightRestrictionZoneService.selFlightRestrictionZone(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有限飞区',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:selAll',
    label: '查询所有限飞区',
  })
  async selAllFlightRestrictionZone(@Query() dto: FlightRestrictionZoneSelAllDto): Promise<R> {
    return this.flightRestrictionZoneService.selAllFlightRestrictionZone(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个限飞区（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:selOnes',
    label: '查询多个限飞区（根据id）',
  })
  async selOnesFlightRestrictionZone(@Query() ids: number[]): Promise<R> {
    return this.flightRestrictionZoneService.selOnesFlightRestrictionZone(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个限飞区',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:selOne',
    label: '查询单个限飞区',
  })
  async selOneFlightRestrictionZone(@Param('id') id: number): Promise<R> {
    return this.flightRestrictionZoneService.selOneFlightRestrictionZone(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增限飞区',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:ins',
    label: '新增限飞区',
  })
  async insFlightRestrictionZone(@Body() dto: FlightRestrictionZoneInsOneDto): Promise<R> {
    return this.flightRestrictionZoneService.insFlightRestrictionZone(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增限飞区',
  })
  @ApiBody({
    isArray: true,
    type: FlightRestrictionZoneInsOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:inss',
    label: '批量新增限飞区',
  })
  async insFlightRestrictionZones(@Body() dto: FlightRestrictionZoneInsMoreDto): Promise<R> {
    return this.flightRestrictionZoneService.insFlightRestrictionZones(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改限飞区',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:upd',
    label: '修改限飞区',
  })
  async updFlightRestrictionZone(@Body() dto: FlightRestrictionZoneUpdOneDto): Promise<R> {
    return this.flightRestrictionZoneService.updFlightRestrictionZone(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改限飞区',
  })
  @ApiBody({
    isArray: true,
    type: FlightRestrictionZoneUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:upds',
    label: '批量修改限飞区',
  })
  async updFlightRestrictionZones(@Body() dto: FlightRestrictionZoneUpdMoreDto): Promise<R> {
    return this.flightRestrictionZoneService.updFlightRestrictionZones(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除限飞区',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZone:del',
    label: '删除限飞区',
  })
  async delFlightRestrictionZone(@Body() ids: number[]): Promise<R> {
    return this.flightRestrictionZoneService.delFlightRestrictionZone(ids);
  }
}
