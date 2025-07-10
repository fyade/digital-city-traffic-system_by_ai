import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyScheduleDto extends BaseDto {
  id: number;

  name: string;

  description: string;

  scheduleType: string;

  startTime: string;

  endTime: string;

  cronExpression: string;
}

export class SignalLightStrategyScheduleSelListDto extends PageDto {
  @ApiProperty({ description: '信号灯策略调度名', required: false })
  name: string;

  @ApiProperty({ description: '信号灯策略调度描述', required: false })
  description: string;

  @ApiProperty({ description: '调度类型', required: false })
  scheduleType: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: string;

  @ApiProperty({ description: 'cron表达式', required: false })
  cronExpression: string;
}

export class SignalLightStrategyScheduleSelAllDto {
  @ApiProperty({ description: '信号灯策略调度名', required: false })
  name: string;

  @ApiProperty({ description: '信号灯策略调度描述', required: false })
  description: string;

  @ApiProperty({ description: '调度类型', required: false })
  scheduleType: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: string;

  @ApiProperty({ description: 'cron表达式', required: false })
  cronExpression: string;
}

export class SignalLightStrategyScheduleInsOneDto {
  @ApiProperty({ description: '信号灯策略调度名', required: true })
  @IsNotEmpty({ message: '信号灯策略调度名不能为空' })
  @MaxLength(100, { message: '信号灯策略调度名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '信号灯策略调度描述', required: true })
  @IsNotEmpty({ message: '信号灯策略调度描述不能为空' })
  @MaxLength(100, { message: '信号灯策略调度描述不能超过100个字符' })
  description: string;

  @ApiProperty({ description: '调度类型', required: true })
  @IsNotEmpty({ message: '调度类型不能为空' })
  @MaxLength(30, { message: '调度类型不能超过30个字符' })
  scheduleType: string;

  @ApiProperty({ description: '开始时间', required: true })
  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: true })
  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: string;

  @ApiProperty({ description: 'cron表达式', required: true })
  @IsNotEmpty({ message: 'cron表达式不能为空' })
  @MaxLength(30, { message: 'cron表达式不能超过30个字符' })
  cronExpression: string;
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
