import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyScheduleDto extends BaseDto {
  id: number;

  typeId: number;

  scheduleType: string;

  startTime: string;

  endTime: string;

  cronExpression: string;
}

export class SignalLightStrategyScheduleSelListDto extends PageDto {
  @ApiProperty({ description: '信号灯策略类型id', required: false })
  typeId: number;

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
  @ApiProperty({ description: '信号灯策略类型id', required: false })
  typeId: number;

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
  @ApiProperty({ description: '信号灯策略类型id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '信号灯策略类型id不能为空' })
  typeId: number;

  @ApiProperty({ description: '调度类型', required: true })
  @IsNotEmpty({ message: '调度类型不能为空' })
  scheduleType: string;

  @ApiProperty({ description: '开始时间', required: true })
  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: string;

  @ApiProperty({ description: '结束时间', required: true })
  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: string;

  @ApiProperty({ description: 'cron表达式', required: true })
  @IsNotEmpty({ message: 'cron表达式不能为空' })
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
