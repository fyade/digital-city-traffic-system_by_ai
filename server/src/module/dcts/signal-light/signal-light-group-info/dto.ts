import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { REGEX_DCTS_GEOM, REGEX_DCTS_GEOM_DESCR } from "../../../../util/RegularUtils";

export class SignalLightGroupInfoDto extends BaseDto {
  id: number;

  name: string;

  location: string;

  description: string;

  constructor() {
    super();
    this.id = null;
    this.name = null;
    this.location = null;
    this.description = null;
  }
}

export class SignalLightGroupInfoSelListDto extends PageDto {
  @ApiProperty({ description: '信号灯组名', required: false })
  name: string;

  @ApiProperty({ description: '位置', required: false })
  location: string;

  @ApiProperty({ description: '描述', required: false })
  description: string;
}

export class SignalLightGroupInfoSelAllDto {
  @ApiProperty({ description: '信号灯组名', required: false })
  name: string;

  @ApiProperty({ description: '位置', required: false })
  location: string;

  @ApiProperty({ description: '描述', required: false })
  description: string;
}

export class SignalLightGroupInfoInsOneDto {
  @ApiProperty({ description: '信号灯组名', required: true })
  @IsNotEmpty({ message: '信号灯组名不能为空' })
  @MaxLength(100, { message: '信号灯组名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '位置', required: true })
  @IsNotEmpty({ message: '位置不能为空' })
  @Matches(REGEX_DCTS_GEOM, { message: `位置必须为[${REGEX_DCTS_GEOM_DESCR}]格式` })
  location: string;

  @ApiProperty({ description: '描述', required: true })
  @IsNotEmpty({ message: '描述不能为空' })
  @MaxLength(100, { message: '描述不能超过100个字符' })
  description: string;
}

export class SignalLightGroupInfoUpdOneDto extends SignalLightGroupInfoInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightGroupInfoInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightGroupInfoInsOneDto)
  items: SignalLightGroupInfoInsOneDto[];
}

export class SignalLightGroupInfoUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightGroupInfoUpdOneDto)
  items: SignalLightGroupInfoUpdOneDto[];
}
