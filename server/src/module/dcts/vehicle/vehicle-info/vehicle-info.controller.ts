import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VehicleInfoService } from './vehicle-info.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { VehicleInfoSelListDto, VehicleInfoSelAllDto, VehicleInfoInsOneDto, VehicleInfoUpdOneDto, VehicleInfoInsMoreDto, VehicleInfoUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/vehicle/vehicle-info')
@ApiTags(`${publicConfig.APP_NAME}/车辆管理/车辆信息`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class VehicleInfoController {
  constructor(private readonly vehicleInfoService: VehicleInfoService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询车辆信息',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:selList',
    label: '分页查询车辆信息',
  })
  async selVehicleInfo(@Query() dto: VehicleInfoSelListDto): Promise<R> {
    return this.vehicleInfoService.selVehicleInfo(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有车辆信息',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:selAll',
    label: '查询所有车辆信息',
  })
  async selAllVehicleInfo(@Query() dto: VehicleInfoSelAllDto): Promise<R> {
    return this.vehicleInfoService.selAllVehicleInfo(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个车辆信息（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:selOnes',
    label: '查询多个车辆信息（根据id）',
  })
  async selOnesVehicleInfo(@Query() ids: Record<string, string>): Promise<R> {
    return this.vehicleInfoService.selOnesVehicleInfo(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个车辆信息',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:selOne',
    label: '查询单个车辆信息',
  })
  async selOneVehicleInfo(@Param('id') id: string): Promise<R> {
    return this.vehicleInfoService.selOneVehicleInfo(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增车辆信息',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:ins',
    label: '新增车辆信息',
  })
  async insVehicleInfo(@Body() dto: VehicleInfoInsOneDto): Promise<R> {
    return this.vehicleInfoService.insVehicleInfo(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增车辆信息',
  })
  @ApiBody({
    isArray: true,
    type: VehicleInfoInsOneDto,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:inss',
    label: '批量新增车辆信息',
  })
  async insVehicleInfos(@Body() dto: VehicleInfoInsMoreDto): Promise<R> {
    return this.vehicleInfoService.insVehicleInfos(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改车辆信息',
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:upd',
    label: '修改车辆信息',
  })
  async updVehicleInfo(@Body() dto: VehicleInfoUpdOneDto): Promise<R> {
    return this.vehicleInfoService.updVehicleInfo(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改车辆信息',
  })
  @ApiBody({
    isArray: true,
    type: VehicleInfoUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:upds',
    label: '批量修改车辆信息',
  })
  async updVehicleInfos(@Body() dto: VehicleInfoUpdMoreDto): Promise<R> {
    return this.vehicleInfoService.updVehicleInfos(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除车辆信息',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:vehicle:vehicleInfo:del',
    label: '删除车辆信息',
  })
  async delVehicleInfo(@Body() ids: number[]): Promise<R> {
    return this.vehicleInfoService.delVehicleInfo(ids);
  }
}
