import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { regularUtils } from "@dcts/common";

export class FlightRestrictionZoneDto extends BaseDto {
  id: number;

  name: string;

  code: string;

  type: string;

  geometry: string;

  descr: string;

  constructor() {
    super();
    this.id = null;
    this.name = null;
    this.code = null;
    this.type = null;
    this.geometry = null;
    this.descr = null;
  }
}

export class FlightRestrictionZoneSelListDto extends PageDto {
  @ApiProperty({ description: '限飞区名', required: false })
  name: string;

  @ApiProperty({ description: '限飞区代码', required: false })
  code: string;

  @ApiProperty({ description: '限飞区类型', required: false })
  type: string;

  @ApiProperty({ description: '限飞区边界', required: false })
  geometry: string;

  @ApiProperty({ description: '描述', required: false })
  descr: string;
}

export class FlightRestrictionZoneSelAllDto {
  @ApiProperty({ description: '限飞区名', required: false })
  name: string;

  @ApiProperty({ description: '限飞区代码', required: false })
  code: string;

  @ApiProperty({ description: '限飞区类型', required: false })
  type: string;

  @ApiProperty({ description: '限飞区边界', required: false })
  geometry: string;

  @ApiProperty({ description: '描述', required: false })
  descr: string;
}

export class FlightRestrictionZoneInsOneDto {
  @ApiProperty({ description: '限飞区名', required: true })
  @IsNotEmpty({ message: '限飞区名不能为空' })
  @MaxLength(100, { message: '限飞区名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '限飞区代码', required: true })
  @IsNotEmpty({ message: '限飞区代码不能为空' })
  @MaxLength(50, { message: '限飞区代码不能超过50个字符' })
  code: string;

  @ApiProperty({ description: '限飞区类型', required: true })
  @IsNotEmpty({ message: '限飞区类型不能为空' })
  @MaxLength(50, { message: '限飞区类型不能超过50个字符' })
  type: string;

  @ApiProperty({ description: '限飞区边界', required: true })
  @IsNotEmpty({ message: '限飞区边界不能为空' })
  @Matches(regularUtils.REGEX_DCTS_GEOMETRY, { message: `限飞区边界必须为[${regularUtils.REGEX_DCTS_GEOMETRY_DESCR}]格式` })
  geometry: string;

  @ApiProperty({ description: '描述', required: true })
  @IsNotEmpty({ message: '描述不能为空' })
  @MaxLength(500, { message: '描述不能超过500个字符' })
  descr: string;
}

export class FlightRestrictionZoneUpdOneDto extends FlightRestrictionZoneInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class FlightRestrictionZoneInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightRestrictionZoneInsOneDto)
  items: FlightRestrictionZoneInsOneDto[];
}

export class FlightRestrictionZoneUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightRestrictionZoneUpdOneDto)
  items: FlightRestrictionZoneUpdOneDto[];
}
