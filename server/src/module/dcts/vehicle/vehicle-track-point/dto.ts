import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { REGEX_DCTS_GEOM, REGEX_DCTS_GEOM_DESCR } from "../../../../util/RegularUtils";

export class VehicleTrackPointDto extends BaseDto {
  id: number;

  vehicleId: string;

  point: string;

  constructor() {
    super();
    this.id = null;
    this.vehicleId = null;
    this.point = null;
  }
}

export class VehicleTrackPointSelListDto extends PageDto {
  @ApiProperty({ description: '车辆id', required: false })
  vehicleId: string;

  @ApiProperty({ description: '轨迹点', required: false })
  point: string;
}

export class VehicleTrackPointSelAllDto {
  @ApiProperty({ description: '车辆id', required: false })
  vehicleId: string;

  @ApiProperty({ description: '轨迹点', required: false })
  point: string;
}

export class VehicleTrackPointInsOneDto {
  @ApiProperty({ description: '车辆id', required: true })
  @IsNotEmpty({ message: '车辆id不能为空' })
  vehicleId: string;

  @ApiProperty({ description: '轨迹点', required: true })
  @IsNotEmpty({ message: '轨迹点不能为空' })
  @Matches(REGEX_DCTS_GEOM, { message: `位置必须为[${REGEX_DCTS_GEOM_DESCR}]格式` })
  point: string;
}

export class VehicleTrackPointUpdOneDto extends VehicleTrackPointInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class VehicleTrackPointInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleTrackPointInsOneDto)
  items: VehicleTrackPointInsOneDto[];
}

export class VehicleTrackPointUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleTrackPointUpdOneDto)
  items: VehicleTrackPointUpdOneDto[];
}
