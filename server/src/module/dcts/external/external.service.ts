import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import { AddRouteInformationDto, AddVehicleInfoDto, AddVehicleTrackPointDto } from "./dto";
import { SpatialDataService } from "../spatial-data/spatial-data.service";
import { baseUtils, geoUtils, numberUtils } from "@dcts/common";
import { CommonService } from "../../../infra/common/common.service";
import { VehicleInfoDto } from "../vehicle/vehicle-info/dto";
import { PostgresqlPrismaoService } from "../../../infra/prisma/postgresql.prismao.service";
import { PrismaoService } from "../../../infra/prisma/prismao.service";
import { VehicleTrackPointDto } from "../vehicle/vehicle-track-point/dto";
import { CommonPostgresqlPrismaoService } from "../../../infra/prisma/common.postgresql.prismao.service";

@Injectable()
export class ExternalService {
  constructor(
      private readonly spatialDataService: SpatialDataService,
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly prismao: PrismaoService,
      private readonly commonService: CommonService,
  ) {
  }

  async addRouteInformation(dto: AddRouteInformationDto): Promise<R> {
    const bounds = geoUtils.expandBounds([Math.max(dto.startPoint.lat, dto.endPoint.lat), Math.max(dto.startPoint.lon, dto.endPoint.lon), Math.min(dto.startPoint.lat, dto.endPoint.lat), Math.min(dto.startPoint.lon, dto.endPoint.lon)]);
    const points = [
      {lon: bounds[1], lat: bounds[0]},
      {lon: bounds[1], lat: bounds[2]},
      {lon: bounds[3], lat: bounds[2]},
      {lon: bounds[3], lat: bounds[0]},
    ]
    points.push(points[0])
    const allRoads = await this.spatialDataService.nodesWithWaysInPolygon({
      points: points
    });
    return R.ok(allRoads.data)
  }

  async addVehicleInfo(dto: AddVehicleInfoDto): Promise<R> {
    const _carTypes = await this.commonService.selDicDataOfType('dcts:car:type')
    const _carBoards = await this.commonService.selDicDataOfType('dcts:car:board')
    const carTypes = _carTypes.map(item => item.value);
    const carBoards = _carBoards.map(item => item.value);
    const defaultInsArg = this.prismao.defaultInsArg();
    const vs = dto.plateNumbers.map((item, index) => {
      const vehicle = new VehicleInfoDto();
      vehicle.vehicleType = carTypes[index % carTypes.length];
      vehicle.brand = carBoards[index % carBoards.length];
      const strings = item.split('$$$');
      vehicle.plateNumber = strings[0];
      vehicle.color = strings[1];
      return vehicle
    });
    await this.pgsqlPrismao.vehicle_info.createMany({
      data: vs.map(item => ({
        plate_number: item.plateNumber,
        vehicle_type: item.vehicleType,
        brand: item.brand,
        color: item.color,
        ...defaultInsArg.data,
      }))
    })
    return R.ok(true)
  }

  async addVehicleTrackPoint(dto: AddVehicleTrackPointDto): Promise<R> {
    const vehicleInfos = await this.pgsqlPrismao.vehicle_info.findMany({
      where: {
        ...this.prismao.defaultSelArg().where
      }
    });
    const data1 = this.prismao.defaultInsArg().data;
    const datas: VehicleTrackPointDto[] = []
    for (const data of dto.datas) {
      const vehicleInfo = vehicleInfos[numberUtils.randomNumber(0, vehicleInfos.length - 1)];
      for (const datum of data) {
        datas.push({
          id: null,
          vehicleId: vehicleInfo.id,
          point: datum.position.join(','),
          heading: datum.heading,
          createBy: data1.create_by,
          createRole: data1.create_role,
          createTime: new Date(datum.time).toISOString(),
          updateBy: data1.update_by,
          updateRole: data1.update_role,
          updateTime: new Date(datum.time).toISOString(),
          deleted: data1.deleted,
        })
      }
    }
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'ins',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      datas: datas,
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdKey: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`,
        createTime: value => {
          const date = new Date(value);
          return `'${date.getFullYear()}-${numberUtils.addZero(date.getMonth() + 1)}-${numberUtils.addZero(date.getDate())} ${numberUtils.addZero(date.getHours())}:${numberUtils.addZero(date.getMinutes())}:${date.getSeconds()}.000000 +08:00'`
        },
        updateTime: value => {
          const date = new Date(value);
          return `'${date.getFullYear()}-${numberUtils.addZero(date.getMonth() + 1)}-${numberUtils.addZero(date.getDate())} ${numberUtils.addZero(date.getHours())}:${numberUtils.addZero(date.getMinutes())}:${date.getSeconds()}.000000 +08:00'`
        },
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(true)
  }
}
