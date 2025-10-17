import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { regularUtils } from "@dcts/common";

export class FlightRouteDto extends BaseDto {
  id: number;

  name: string;

  path: string;

  constructor() {
    super();
    this.id = null;
    this.name = null;
    this.path = null;
  }
}

export class FlightRouteSelListDto extends PageDto {
  @ApiProperty({ description: '航线名', required: false })
  name: string;

  @ApiProperty({ description: '航线路径', required: false })
  path: string;
}

export class FlightRouteSelAllDto {
  @ApiProperty({ description: '航线名', required: false })
  name: string;

  @ApiProperty({ description: '航线路径', required: false })
  path: string;
}

export class FlightRouteInsOneDto {
  @ApiProperty({ description: '航线名', required: true })
  @IsNotEmpty({ message: '航线名不能为空' })
  @MaxLength(100, { message: '航线名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '航线路径', required: true })
  @IsNotEmpty({ message: '航线路径不能为空' })
  @Matches(regularUtils.REGEX_DCTS_PATH_Z, { message: `航线路径必须为[${regularUtils.REGEX_DCTS_PATH_Z_DESCR}]格式` })
  path: string;
}

export class FlightRouteUpdOneDto extends FlightRouteInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class FlightRouteInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightRouteInsOneDto)
  items: FlightRouteInsOneDto[];
}

export class FlightRouteUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightRouteUpdOneDto)
  items: FlightRouteUpdOneDto[];
}
