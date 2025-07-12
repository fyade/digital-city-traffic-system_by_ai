import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyTypeDto extends BaseDto {
  id: number;

  name: string;

  description: string;

  strategyType: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class SignalLightStrategyTypeSelListDto extends PageDto {
  @ApiProperty({ description: '策略类型名', required: false })
  name: string;

  @ApiProperty({ description: '策略类型描述', required: false })
  description: string;

  @ApiProperty({ description: '策略类型', required: false })
  strategyType: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyTypeSelAllDto {
  @ApiProperty({ description: '策略类型名', required: false })
  name: string;

  @ApiProperty({ description: '策略类型描述', required: false })
  description: string;

  @ApiProperty({ description: '策略类型', required: false })
  strategyType: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyTypeInsOneDto {
  @ApiProperty({ description: '策略类型名', required: true })
  @IsNotEmpty({ message: '策略类型名不能为空' })
  @MaxLength(100, { message: '策略类型名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '策略类型描述', required: true })
  @IsNotEmpty({ message: '策略类型描述不能为空' })
  @MaxLength(100, { message: '策略类型描述不能超过100个字符' })
  description: string;

  @ApiProperty({ description: '策略类型', required: true })
  @IsNotEmpty({ message: '策略类型不能为空' })
  @MaxLength(100, { message: '策略类型不能超过100个字符' })
  strategyType: string;

  @ApiProperty({ description: '是否禁用', required: true })
  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyTypeUpdOneDto extends SignalLightStrategyTypeInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightStrategyTypeInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyTypeInsOneDto)
  items: SignalLightStrategyTypeInsOneDto[];
}

export class SignalLightStrategyTypeUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyTypeUpdOneDto)
  items: SignalLightStrategyTypeUpdOneDto[];
}
