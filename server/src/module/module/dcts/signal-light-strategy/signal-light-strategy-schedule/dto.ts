import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyScheduleDto extends BaseDto {
  id: number;

  name: string;

  description: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class SignalLightStrategyScheduleSelListDto extends PageDto {
  @ApiProperty({ description: '策略调度名', required: false })
  name: string;

  @ApiProperty({ description: '策略调度描述', required: false })
  description: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyScheduleSelAllDto {
  @ApiProperty({ description: '策略调度名', required: false })
  name: string;

  @ApiProperty({ description: '策略调度描述', required: false })
  description: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class SignalLightStrategyScheduleInsOneDto {
  @ApiProperty({ description: '策略调度名', required: true })
  @IsNotEmpty({ message: '策略调度名不能为空' })
  @MaxLength(100, { message: '策略调度名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '策略调度描述', required: true })
  @IsNotEmpty({ message: '策略调度描述不能为空' })
  @MaxLength(100, { message: '策略调度描述不能超过100个字符' })
  description: string;

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

export class SignalLightStrategyScheduleUpdOneDto extends SignalLightStrategyScheduleInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightStrategyScheduleInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyScheduleInsOneDto)
  items: SignalLightStrategyScheduleInsOneDto[];
}

export class SignalLightStrategyScheduleUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyScheduleUpdOneDto)
  items: SignalLightStrategyScheduleUpdOneDto[];
}
