import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AircraftTrackPointDto extends BaseDto {
  id: number;

  aircraftId: number;

  point: string;

  height: number;

  heading: number;

  constructor() {
    super();
    this.id = null;
    this.aircraftId = null;
    this.point = null;
    this.height = null;
    this.heading = null;
  }
}

export class AircraftTrackPointSelListDto extends PageDto {
  @ApiProperty({ description: '航空器id', required: false })
  aircraftId: number;

  @ApiProperty({ description: '轨迹点', required: false })
  point: string;

  @ApiProperty({ description: '高度', required: false })
  height: number;

  @ApiProperty({ description: '航向角', required: false })
  heading: number;
}

export class AircraftTrackPointSelAllDto {
  @ApiProperty({ description: '航空器id', required: false })
  aircraftId: number;

  @ApiProperty({ description: '轨迹点', required: false })
  point: string;

  @ApiProperty({ description: '高度', required: false })
  height: number;

  @ApiProperty({ description: '航向角', required: false })
  heading: number;
}

export class AircraftTrackPointInsOneDto {
  @ApiProperty({ description: '航空器id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '航空器id不能为空' })
  aircraftId: number;

  @ApiProperty({ description: '轨迹点', required: true })
  @IsNotEmpty({ message: '轨迹点不能为空' })
  point: string;

  @ApiProperty({ description: '高度', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '高度不能为空' })
  height: number;

  @ApiProperty({ description: '航向角', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '航向角不能为空' })
  heading: number;
}

export class AircraftTrackPointUpdOneDto extends AircraftTrackPointInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class AircraftTrackPointInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AircraftTrackPointInsOneDto)
  items: AircraftTrackPointInsOneDto[];
}

export class AircraftTrackPointUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AircraftTrackPointUpdOneDto)
  items: AircraftTrackPointUpdOneDto[];
}
