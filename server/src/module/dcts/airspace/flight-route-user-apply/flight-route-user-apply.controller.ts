import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FlightRouteUserApplyService } from './flight-route-user-apply.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { FlightRouteUserApplySelListDto, FlightRouteUserApplySelAllDto, FlightRouteUserApplyInsOneDto, FlightRouteUserApplyUpdOneDto, FlightRouteUserApplyInsMoreDto, FlightRouteUserApplyUpdMoreDto } from './dto';

@Controller('/dcts/airspace/flight-route-user-apply')
@ApiTags('数智交通全域调度系统/空域管理/用户申请航线')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class FlightRouteUserApplyController {
  constructor(private readonly flightRouteUserApplyService: FlightRouteUserApplyService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:selList',
    label: '分页查询用户申请航线',
  })
  async selFlightRouteUserApply(@Query() dto: FlightRouteUserApplySelListDto): Promise<R> {
    return this.flightRouteUserApplyService.selFlightRouteUserApply(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:selAll',
    label: '查询所有用户申请航线',
  })
  async selAllFlightRouteUserApply(@Query() dto: FlightRouteUserApplySelAllDto): Promise<R> {
    return this.flightRouteUserApplyService.selAllFlightRouteUserApply(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户申请航线（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:selOnes',
    label: '查询多个用户申请航线（根据id）',
  })
  async selOnesFlightRouteUserApply(@Query() ids: Record<string, string>): Promise<R> {
    return this.flightRouteUserApplyService.selOnesFlightRouteUserApply(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:selOne',
    label: '查询单个用户申请航线',
  })
  async selOneFlightRouteUserApply(@Param('id') id: string): Promise<R> {
    return this.flightRouteUserApplyService.selOneFlightRouteUserApply(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:ins',
    label: '新增用户申请航线',
  })
  async insFlightRouteUserApply(@Body() dto: FlightRouteUserApplyInsOneDto): Promise<R> {
    return this.flightRouteUserApplyService.insFlightRouteUserApply(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增用户申请航线',
  })
  @ApiBody({
    isArray: true,
    type: FlightRouteUserApplyInsOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:inss',
    label: '批量新增用户申请航线',
  })
  async insFlightRouteUserApplys(@Body() dto: FlightRouteUserApplyInsMoreDto): Promise<R> {
    return this.flightRouteUserApplyService.insFlightRouteUserApplys(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:upd',
    label: '修改用户申请航线',
  })
  async updFlightRouteUserApply(@Body() dto: FlightRouteUserApplyUpdOneDto): Promise<R> {
    return this.flightRouteUserApplyService.updFlightRouteUserApply(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改用户申请航线',
  })
  @ApiBody({
    isArray: true,
    type: FlightRouteUserApplyUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:upds',
    label: '批量修改用户申请航线',
  })
  async updFlightRouteUserApplys(@Body() dto: FlightRouteUserApplyUpdMoreDto): Promise<R> {
    return this.flightRouteUserApplyService.updFlightRouteUserApplys(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户申请航线',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRouteUserApply:del',
    label: '删除用户申请航线',
  })
  async delFlightRouteUserApply(@Body() ids: number[]): Promise<R> {
    return this.flightRouteUserApplyService.delFlightRouteUserApply(ids);
  }
}
