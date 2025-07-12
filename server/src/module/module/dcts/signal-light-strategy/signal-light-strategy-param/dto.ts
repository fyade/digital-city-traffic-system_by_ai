import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyParamDto extends BaseDto {
  id: number;

  redDuration: number;

  yellowDuration: number;

  greenDuration: number;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class SignalLightStrategyParamSelListDto extends PageDto {
  @ApiProperty({ description: '红灯时长', required: false })
  redDuration: number;

  @ApiProperty({ description: '黄灯时长', required: false })
  yellowDuration: number;

  @ApiProperty({ description: '绿灯时长', required: false })
  greenDuration: number;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyParamSelAllDto {
  @ApiProperty({ description: '红灯时长', required: false })
  redDuration: number;

  @ApiProperty({ description: '黄灯时长', required: false })
  yellowDuration: number;

  @ApiProperty({ description: '绿灯时长', required: false })
  greenDuration: number;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyParamInsOneDto {
  @ApiProperty({ description: '红灯时长', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '红灯时长不能为空' })
  redDuration: number;

  @ApiProperty({ description: '黄灯时长', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '黄灯时长不能为空' })
  yellowDuration: number;

  @ApiProperty({ description: '绿灯时长', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '绿灯时长不能为空' })
  greenDuration: number;

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
