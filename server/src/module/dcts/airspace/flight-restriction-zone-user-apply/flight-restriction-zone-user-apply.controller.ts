import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FlightRestrictionZoneUserApplyService } from './flight-restriction-zone-user-apply.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { FlightRestrictionZoneUserApplySelListDto, FlightRestrictionZoneUserApplySelAllDto, FlightRestrictionZoneUserApplyInsOneDto, FlightRestrictionZoneUserApplyUpdOneDto, FlightRestrictionZoneUserApplyInsMoreDto, FlightRestrictionZoneUserApplyUpdMoreDto } from './dto';

@Controller('/dcts/airspace/flight-restriction-zone-user-apply')
@ApiTags('数智交通全域调度系统/空域管理/用户申请空域')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class FlightRestrictionZoneUserApplyController {
  constructor(private readonly flightRestrictionZoneUserApplyService: FlightRestrictionZoneUserApplyService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:selList',
    label: '分页查询用户申请空域',
  })
  async selFlightRestrictionZoneUserApply(@Query() dto: FlightRestrictionZoneUserApplySelListDto): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.selFlightRestrictionZoneUserApply(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:selAll',
    label: '查询所有用户申请空域',
  })
  async selAllFlightRestrictionZoneUserApply(@Query() dto: FlightRestrictionZoneUserApplySelAllDto): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.selAllFlightRestrictionZoneUserApply(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户申请空域（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:selOnes',
    label: '查询多个用户申请空域（根据id）',
  })
  async selOnesFlightRestrictionZoneUserApply(@Query() ids: Record<string, string>): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.selOnesFlightRestrictionZoneUserApply(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:selOne',
    label: '查询单个用户申请空域',
  })
  async selOneFlightRestrictionZoneUserApply(@Param('id') id: string): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.selOneFlightRestrictionZoneUserApply(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:ins',
    label: '新增用户申请空域',
  })
  async insFlightRestrictionZoneUserApply(@Body() dto: FlightRestrictionZoneUserApplyInsOneDto): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.insFlightRestrictionZoneUserApply(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增用户申请空域',
  })
  @ApiBody({
    isArray: true,
    type: FlightRestrictionZoneUserApplyInsOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:inss',
    label: '批量新增用户申请空域',
  })
  async insFlightRestrictionZoneUserApplys(@Body() dto: FlightRestrictionZoneUserApplyInsMoreDto): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.insFlightRestrictionZoneUserApplys(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:upd',
    label: '修改用户申请空域',
  })
  async updFlightRestrictionZoneUserApply(@Body() dto: FlightRestrictionZoneUserApplyUpdOneDto): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.updFlightRestrictionZoneUserApply(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改用户申请空域',
  })
  @ApiBody({
    isArray: true,
    type: FlightRestrictionZoneUserApplyUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:upds',
    label: '批量修改用户申请空域',
  })
  async updFlightRestrictionZoneUserApplys(@Body() dto: FlightRestrictionZoneUserApplyUpdMoreDto): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.updFlightRestrictionZoneUserApplys(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户申请空域',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRestrictionZoneUserApply:del',
    label: '删除用户申请空域',
  })
  async delFlightRestrictionZoneUserApply(@Body() ids: number[]): Promise<R> {
    return this.flightRestrictionZoneUserApplyService.delFlightRestrictionZoneUserApply(ids);
  }
}
