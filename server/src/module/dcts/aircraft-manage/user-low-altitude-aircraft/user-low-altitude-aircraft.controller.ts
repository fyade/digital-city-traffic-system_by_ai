import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserLowAltitudeAircraftService } from './user-low-altitude-aircraft.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { UserLowAltitudeAircraftSelListDto, UserLowAltitudeAircraftSelAllDto, UserLowAltitudeAircraftInsOneDto, UserLowAltitudeAircraftUpdOneDto, UserLowAltitudeAircraftInsMoreDto, UserLowAltitudeAircraftUpdMoreDto } from './dto';

@Controller('/dcts/aircraft-manage/user-low-altitude-aircraft')
@ApiTags('数智交通全域调度系统/航空器管理/[用户]低空航空器')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class UserLowAltitudeAircraftController {
  constructor(private readonly userLowAltitudeAircraftService: UserLowAltitudeAircraftService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询[用户]低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:selList',
    label: '分页查询[用户]低空航空器',
  })
  async selUserLowAltitudeAircraft(@Query() dto: UserLowAltitudeAircraftSelListDto): Promise<R> {
    return this.userLowAltitudeAircraftService.selUserLowAltitudeAircraft(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有[用户]低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:selAll',
    label: '查询所有[用户]低空航空器',
  })
  async selAllUserLowAltitudeAircraft(@Query() dto: UserLowAltitudeAircraftSelAllDto): Promise<R> {
    return this.userLowAltitudeAircraftService.selAllUserLowAltitudeAircraft(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个[用户]低空航空器（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:selOnes',
    label: '查询多个[用户]低空航空器（根据id）',
  })
  async selOnesUserLowAltitudeAircraft(@Query() ids: Record<string, string>): Promise<R> {
    return this.userLowAltitudeAircraftService.selOnesUserLowAltitudeAircraft(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个[用户]低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:selOne',
    label: '查询单个[用户]低空航空器',
  })
  async selOneUserLowAltitudeAircraft(@Param('id') id: string): Promise<R> {
    return this.userLowAltitudeAircraftService.selOneUserLowAltitudeAircraft(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增[用户]低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:ins',
    label: '新增[用户]低空航空器',
  })
  async insUserLowAltitudeAircraft(@Body() dto: UserLowAltitudeAircraftInsOneDto): Promise<R> {
    return this.userLowAltitudeAircraftService.insUserLowAltitudeAircraft(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增[用户]低空航空器',
  })
  @ApiBody({
    isArray: true,
    type: UserLowAltitudeAircraftInsOneDto,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:inss',
    label: '批量新增[用户]低空航空器',
  })
  async insUserLowAltitudeAircrafts(@Body() dto: UserLowAltitudeAircraftInsMoreDto): Promise<R> {
    return this.userLowAltitudeAircraftService.insUserLowAltitudeAircrafts(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改[用户]低空航空器',
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:upd',
    label: '修改[用户]低空航空器',
  })
  async updUserLowAltitudeAircraft(@Body() dto: UserLowAltitudeAircraftUpdOneDto): Promise<R> {
    return this.userLowAltitudeAircraftService.updUserLowAltitudeAircraft(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改[用户]低空航空器',
  })
  @ApiBody({
    isArray: true,
    type: UserLowAltitudeAircraftUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:upds',
    label: '批量修改[用户]低空航空器',
  })
  async updUserLowAltitudeAircrafts(@Body() dto: UserLowAltitudeAircraftUpdMoreDto): Promise<R> {
    return this.userLowAltitudeAircraftService.updUserLowAltitudeAircrafts(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除[用户]低空航空器',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:aircraftManage:userLowAltitudeAircraft:del',
    label: '删除[用户]低空航空器',
  })
  async delUserLowAltitudeAircraft(@Body() ids: number[]): Promise<R> {
    return this.userLowAltitudeAircraftService.delUserLowAltitudeAircraft(ids);
  }
}
