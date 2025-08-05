import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyParamDto extends BaseDto {
  id: number;

  name: string;

  description: string;

  lightType: string;

  round: number;

  duration: number;

  currentLight: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class SignalLightStrategyParamSelListDto extends PageDto {
  @ApiProperty({ description: '策略参数名', required: false })
  name: string;

  @ApiProperty({ description: '策略参数描述', required: false })
  description: string;

  @ApiProperty({ description: '灯类型', required: false })
  lightType: string;

  @ApiProperty({ description: '轮次', required: false })
  round: number;

  @ApiProperty({ description: '时长', required: false })
  duration: number;

  @ApiProperty({ description: '当前灯色', required: false })
  currentLight: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyParamSelAllDto {
  @ApiProperty({ description: '策略参数名', required: false })
  name: string;

  @ApiProperty({ description: '策略参数描述', required: false })
  description: string;

  @ApiProperty({ description: '灯类型', required: false })
  lightType: string;

  @ApiProperty({ description: '轮次', required: false })
  round: number;

  @ApiProperty({ description: '时长', required: false })
  duration: number;

  @ApiProperty({ description: '当前灯色', required: false })
  currentLight: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyParamInsOneDto {
  @ApiProperty({ description: '策略参数名', required: true })
  @IsNotEmpty({ message: '策略参数名不能为空' })
  @MaxLength(100, { message: '策略参数名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '策略参数描述', required: true })
  @IsNotEmpty({ message: '策略参数描述不能为空' })
  @MaxLength(100, { message: '策略参数描述不能超过100个字符' })
  description: string;

  @ApiProperty({ description: '灯类型', required: true })
  @IsNotEmpty({ message: '灯类型不能为空' })
  @MaxLength(100, { message: '灯类型不能超过100个字符' })
  lightType: string;

  @ApiProperty({ description: '轮次', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '轮次不能为空' })
  round: number;

  @ApiProperty({ description: '时长', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '时长不能为空' })
  duration: number;

  @ApiProperty({ description: '当前灯色', required: true })
  @IsNotEmpty({ message: '当前灯色不能为空' })
  @MaxLength(30, { message: '当前灯色不能超过30个字符' })
  currentLight: string;

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

export class SignalLightStrategyParamUpdOneDto extends SignalLightStrategyParamInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightStrategyParamInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyParamInsOneDto)
  items: SignalLightStrategyParamInsOneDto[];
}

export class SignalLightStrategyParamUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyParamUpdOneDto)
  items: SignalLightStrategyParamUpdOneDto[];
}
