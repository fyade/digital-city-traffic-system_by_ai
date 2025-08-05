import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VehicleTrackPointService } from './vehicle-track-point.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { VehicleTrackPointSelListDto, VehicleTrackPointSelAllDto, VehicleTrackPointInsOneDto, VehicleTrackPointUpdOneDto, VehicleTrackPointInsMoreDto, VehicleTrackPointUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/vehicle/vehicle-track-point')
@ApiTags(`${publicConfig.APP_NAME}/车辆管理/车辆轨迹点`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class VehicleTrackPointController {
  constructor(private readonly vehicleTrackPointService: VehicleTrackPointService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询车辆轨迹点',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:selList',
    label: '分页查询车辆轨迹点',
  })
  async selVehicleTrackPoint(@Query() dto: VehicleTrackPointSelListDto): Promise<R> {
    return this.vehicleTrackPointService.selVehicleTrackPoint(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有车辆轨迹点',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:selAll',
    label: '查询所有车辆轨迹点',
  })
  async selAllVehicleTrackPoint(@Query() dto: VehicleTrackPointSelAllDto): Promise<R> {
    return this.vehicleTrackPointService.selAllVehicleTrackPoint(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个车辆轨迹点（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:selOnes',
    label: '查询多个车辆轨迹点（根据id）',
  })
  async selOnesVehicleTrackPoint(@Query() ids: number[]): Promise<R> {
    return this.vehicleTrackPointService.selOnesVehicleTrackPoint(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个车辆轨迹点',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:selOne',
    label: '查询单个车辆轨迹点',
  })
  async selOneVehicleTrackPoint(@Param('id') id: number): Promise<R> {
    return this.vehicleTrackPointService.selOneVehicleTrackPoint(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增车辆轨迹点',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:ins',
    label: '新增车辆轨迹点',
  })
  async insVehicleTrackPoint(@Body() dto: VehicleTrackPointInsOneDto): Promise<R> {
    return this.vehicleTrackPointService.insVehicleTrackPoint(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增车辆轨迹点',
  })
  @ApiBody({
    isArray: true,
    type: VehicleTrackPointInsOneDto,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:inss',
    label: '批量新增车辆轨迹点',
  })
  async insVehicleTrackPoints(@Body() dto: VehicleTrackPointInsMoreDto): Promise<R> {
    return this.vehicleTrackPointService.insVehicleTrackPoints(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改车辆轨迹点',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:upd',
    label: '修改车辆轨迹点',
  })
  async updVehicleTrackPoint(@Body() dto: VehicleTrackPointUpdOneDto): Promise<R> {
    return this.vehicleTrackPointService.updVehicleTrackPoint(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改车辆轨迹点',
  })
  @ApiBody({
    isArray: true,
    type: VehicleTrackPointUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:upds',
    label: '批量修改车辆轨迹点',
  })
  async updVehicleTrackPoints(@Body() dto: VehicleTrackPointUpdMoreDto): Promise<R> {
    return this.vehicleTrackPointService.updVehicleTrackPoints(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除车辆轨迹点',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleTrackPoint:del',
    label: '删除车辆轨迹点',
  })
  async delVehicleTrackPoint(@Body() ids: number[]): Promise<R> {
    return this.vehicleTrackPointService.delVehicleTrackPoint(ids);
  }
}
