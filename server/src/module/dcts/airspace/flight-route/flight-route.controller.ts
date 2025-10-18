import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FlightRouteService } from './flight-route.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { FlightRouteSelListDto, FlightRouteSelAllDto, FlightRouteInsOneDto, FlightRouteUpdOneDto, FlightRouteInsMoreDto, FlightRouteUpdMoreDto } from './dto';

@Controller('/dcts/airspace/flight-route')
@ApiTags('数智交通全域调度系统/空域管理/航线')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class FlightRouteController {
  constructor(private readonly flightRouteService: FlightRouteService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:selList',
    label: '分页查询航线',
  })
  async selFlightRoute(@Query() dto: FlightRouteSelListDto): Promise<R> {
    return this.flightRouteService.selFlightRoute(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:selAll',
    label: '查询所有航线',
  })
  async selAllFlightRoute(@Query() dto: FlightRouteSelAllDto): Promise<R> {
    return this.flightRouteService.selAllFlightRoute(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个航线（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:selOnes',
    label: '查询多个航线（根据id）',
  })
  async selOnesFlightRoute(@Query() ids: Record<string, string>): Promise<R> {
    return this.flightRouteService.selOnesFlightRoute(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:selOne',
    label: '查询单个航线',
  })
  async selOneFlightRoute(@Param('id') id: number): Promise<R> {
    return this.flightRouteService.selOneFlightRoute(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:ins',
    label: '新增航线',
  })
  async insFlightRoute(@Body() dto: FlightRouteInsOneDto): Promise<R> {
    return this.flightRouteService.insFlightRoute(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增航线',
  })
  @ApiBody({
    isArray: true,
    type: FlightRouteInsOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:inss',
    label: '批量新增航线',
  })
  async insFlightRoutes(@Body() dto: FlightRouteInsMoreDto): Promise<R> {
    return this.flightRouteService.insFlightRoutes(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改航线',
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:upd',
    label: '修改航线',
  })
  async updFlightRoute(@Body() dto: FlightRouteUpdOneDto): Promise<R> {
    return this.flightRouteService.updFlightRoute(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改航线',
  })
  @ApiBody({
    isArray: true,
    type: FlightRouteUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:upds',
    label: '批量修改航线',
  })
  async updFlightRoutes(@Body() dto: FlightRouteUpdMoreDto): Promise<R> {
    return this.flightRouteService.updFlightRoutes(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除航线',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:flightRoute:del',
    label: '删除航线',
  })
  async delFlightRoute(@Body() ids: number[]): Promise<R> {
    return this.flightRouteService.delFlightRoute(ids);
  }
}
