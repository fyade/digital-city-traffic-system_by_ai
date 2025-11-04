import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { regularUtils } from "@dcts/common";

export class FlightRouteUserApplyDto extends BaseDto {
  id: number;

  aircraftId: string;

  taskName: string;

  path: string;

  startTime: string;

  endTime: string;

  constructor() {
    super();
    this.id = null;
    this.aircraftId = null;
    this.taskName = null;
    this.path = null;
    this.startTime = null;
    this.endTime = null;
  }
}

export class FlightRouteUserApplySelListDto extends PageDto {
  @ApiProperty({ description: '航空器列表', required: false })
  aircraftId: string;

  @ApiProperty({ description: '任务名称', required: false })
  taskName: string;

  @ApiProperty({ description: '航线', required: false })
  path: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: string;
}

export class FlightRouteUserApplySelAllDto {
  @ApiProperty({ description: '航空器列表', required: false })
  aircraftId: string;

  @ApiProperty({ description: '任务名称', required: false })
  taskName: string;

  @ApiProperty({ description: '航线', required: false })
  path: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: string;
}

export class FlightRouteUserApplyInsOneDto {
  @ApiProperty({ description: '航空器列表', required: true })
  @IsNotEmpty({ message: '航空器列表不能为空' })
  @Matches(regularUtils.REGEX_DCTS_ID_ARRAY, { message: `航空器列表必须为[${regularUtils.REGEX_DCTS_ID_ARRAY_DESCR}]格式` })
  aircraftId: string;

  @ApiProperty({ description: '任务名称', required: true })
  @IsNotEmpty({ message: '任务名称不能为空' })
  @MaxLength(500, { message: '任务名称不能超过500个字符' })
  taskName: string;

  @ApiProperty({ description: '航线', required: true })
  @IsNotEmpty({ message: '航线不能为空' })
  @Matches(regularUtils.REGEX_DCTS_PATH_Z, { message: `航线必须为[${regularUtils.REGEX_DCTS_PATH_Z_DESCR}]格式` })
  path: string;

  @ApiProperty({ description: '开始时间', required: true })
  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: true })
  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: string;
}

export class FlightRouteUserApplyUpdOneDto extends FlightRouteUserApplyInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class FlightRouteUserApplyInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightRouteUserApplyInsOneDto)
  items: FlightRouteUserApplyInsOneDto[];
}

export class FlightRouteUserApplyUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightRouteUserApplyUpdOneDto)
  items: FlightRouteUserApplyUpdOneDto[];
}
