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

  applyStatus: string;

  applyOpinion: string;

  files: string;

  constructor() {
    super();
    this.id = null;
    this.aircraftId = null;
    this.taskName = null;
    this.path = null;
    this.startTime = null;
    this.endTime = null;
    this.applyStatus = null;
    this.applyOpinion = null;
    this.files = null;
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

  @ApiProperty({ description: '申请状态', required: false })
  applyStatus: string;

  @ApiProperty({ description: '申请意见', required: false })
  applyOpinion: string;

  @ApiProperty({ description: '附件', required: false })
  files: string;
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

  @ApiProperty({ description: '申请状态', required: false })
  applyStatus: string;

  @ApiProperty({ description: '申请意见', required: false })
  applyOpinion: string;

  @ApiProperty({ description: '附件', required: false })
  files: string;
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

  @ApiProperty({ description: '申请状态', required: true })
  @IsNotEmpty({ message: '申请状态不能为空' })
  @MaxLength(20, { message: '申请状态不能超过20个字符' })
  applyStatus: string;

  @ApiProperty({ description: '申请意见', required: true })
  @IsNotEmpty({ message: '申请意见不能为空' })
  @MaxLength(300, { message: '申请意见不能超过300个字符' })
  applyOpinion: string;

  @ApiProperty({ description: '附件', required: true })
  @IsNotEmpty({ message: '附件不能为空' })
  @MaxLength(200, { message: '附件不能超过200个字符' })
  files: string;
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
