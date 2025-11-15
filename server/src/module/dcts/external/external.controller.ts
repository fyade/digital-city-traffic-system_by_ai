import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { publicConfig } from "@dcts/config";
import { R } from "../../../common/R";
import { ExternalService } from "./external.service";
import { Authorize } from "../../../decorator/authorize.decorator";
import { AddAircraftTrackPointDto, AddRouteInformationDto, AddVehicleInfoDto, AddVehicleTrackPointDto } from "./dto";

@Controller('/dcts/external')
@ApiTags(`${publicConfig.APP_NAME}/外部api`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({transform: true}))
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {
  }

  @Post('/add-route-information')
  @ApiOperation({
    summary: '添加路线信息'
  })
  @Authorize({
    permission: 'dcts:external:addRouteInformation',
    label: '添加路线信息'
  })
  async addRouteInformation(@Body() dto: AddRouteInformationDto): Promise<R> {
    return this.externalService.addRouteInformation(dto)
  }

  @Post('/add-vehicle-info')
  @ApiOperation({
    summary: '添加车辆信息'
  })
  @Authorize({
    permission: 'dcts:external:addVehicleInfo',
    label: '添加车辆信息'
  })
  async addVehicleInfo(@Body() dto: AddVehicleInfoDto): Promise<R> {
    return this.externalService.addVehicleInfo(dto)
  }

  @Post('/add-vehicle-track-point')
  @ApiOperation({
    summary: '添加车辆轨迹信息'
  })
  @Authorize({
    permission: 'dcts:external:addVehicleTrackPoint',
    label: '添加车辆轨迹信息'
  })
  async addVehicleTrackPoint(@Body() dto: AddVehicleTrackPointDto): Promise<R> {
    return this.externalService.addVehicleTrackPoint(dto)
  }

  @Post('/add-aircraft-track-point')
  @ApiOperation({
    summary: '添加航空器轨迹信息'
  })
  @Authorize({
    permission: 'dcts:external:addAircraftTrackPoint',
    label: '添加航空器轨迹信息'
  })
  async addAircraftTrackPoint(@Body() dto: AddAircraftTrackPointDto): Promise<R> {
    return this.externalService.addAircraftTrackPoint(dto)
  }
}
