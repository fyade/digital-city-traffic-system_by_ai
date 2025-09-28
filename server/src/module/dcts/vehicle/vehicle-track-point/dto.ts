import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { regularUtils } from "@dcts/common";

export class VehicleTrackPointDto extends BaseDto {
  id: number;

  vehicleId: number;

  point: string;

  heading: number;

  constructor() {
    super();
    this.id = null;
    this.vehicleId = null;
    this.point = null;
    this.heading = null;
  }
}

export class VehicleTrackPointSelListDto extends PageDto {
  @ApiProperty({ description: '车辆id', required: false })
  vehicleId: number;

  @ApiProperty({ description: '轨迹点', required: false })
  point: string;

  @ApiProperty({ description: '航向角', required: false })
  heading: number;
}

export class VehicleTrackPointSelAllDto {
  @ApiProperty({ description: '车辆id', required: false })
  vehicleId: number;

  @ApiProperty({ description: '轨迹点', required: false })
  point: string;

  @ApiProperty({ description: '航向角', required: false })
  heading: number;
}

export class VehicleTrackPointInsOneDto {
  @ApiProperty({ description: '车辆id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '车辆id不能为空' })
  vehicleId: number;

  @ApiProperty({ description: '轨迹点', required: true })
  @IsNotEmpty({ message: '轨迹点不能为空' })
  @Matches(regularUtils.REGEX_DCTS_GEOM, { message: `位置必须为[${regularUtils.REGEX_DCTS_GEOM_DESCR}]格式` })
  point: string;

  @ApiProperty({ description: '航向角', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '航向角不能为空' })
  heading: number;
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
