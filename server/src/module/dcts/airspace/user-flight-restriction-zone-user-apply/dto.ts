import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { regularUtils } from "@dcts/common";

export class UserFlightRestrictionZoneUserApplyDto extends BaseDto {
  id: number;

  aircraftId: string;

  taskName: string;

  geometry: string;

  startTime: string;

  endTime: string;

  constructor() {
    super();
    this.id = null;
    this.aircraftId = null;
    this.taskName = null;
    this.geometry = null;
    this.startTime = null;
    this.endTime = null;
  }
}

export class UserFlightRestrictionZoneUserApplySelListDto extends PageDto {
  @ApiProperty({ description: '航空器列表', required: false })
  aircraftId: string;

  @ApiProperty({ description: '任务名称', required: false })
  taskName: string;

  @ApiProperty({ description: '空域', required: false })
  geometry: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: string;
}

export class UserFlightRestrictionZoneUserApplySelAllDto {
  @ApiProperty({ description: '航空器列表', required: false })
  aircraftId: string;

  @ApiProperty({ description: '任务名称', required: false })
  taskName: string;

  @ApiProperty({ description: '空域', required: false })
  geometry: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: string;
}

export class UserFlightRestrictionZoneUserApplyInsOneDto {
  @ApiProperty({ description: '航空器列表', required: true })
  @IsNotEmpty({ message: '航空器列表不能为空' })
  @Matches(regularUtils.REGEX_DCTS_ID_ARRAY, { message: `航空器列表必须为[${regularUtils.REGEX_DCTS_ID_ARRAY_DESCR}]格式` })
  aircraftId: string;

  @ApiProperty({ description: '任务名称', required: true })
  @IsNotEmpty({ message: '任务名称不能为空' })
  @MaxLength(500, { message: '任务名称不能超过500个字符' })
  taskName: string;

  @ApiProperty({ description: '空域', required: true })
  @IsNotEmpty({ message: '空域不能为空' })
  @Matches(regularUtils.REGEX_DCTS_GEOMETRY, { message: `空域必须为[${regularUtils.REGEX_DCTS_GEOMETRY_DESCR}]格式` })
  geometry: string;

  @ApiProperty({ description: '开始时间', required: true })
  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: true })
  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: string;
}

export class UserFlightRestrictionZoneUserApplyUpdOneDto extends UserFlightRestrictionZoneUserApplyInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class UserFlightRestrictionZoneUserApplyInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserFlightRestrictionZoneUserApplyInsOneDto)
  items: UserFlightRestrictionZoneUserApplyInsOneDto[];
}

export class UserFlightRestrictionZoneUserApplyUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserFlightRestrictionZoneUserApplyUpdOneDto)
  items: UserFlightRestrictionZoneUserApplyUpdOneDto[];
}
