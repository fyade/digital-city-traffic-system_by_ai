import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyTypeStrategyScheduleMappingDto extends BaseDto {
  id: number;

  strategyTypeId: number;

  strategyScheduleId: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingSelListDto extends PageDto {
  @ApiProperty({ description: '信号灯策略类型id', required: false })
  strategyTypeId: number;

  @ApiProperty({ description: '信号灯策略调度id', required: false })
  strategyScheduleId: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingSelAllDto {
  @ApiProperty({ description: '信号灯策略类型id', required: false })
  strategyTypeId: number;

  @ApiProperty({ description: '信号灯策略调度id', required: false })
  strategyScheduleId: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingInsOneDto {
  @ApiProperty({ description: '信号灯策略类型id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '信号灯策略类型id不能为空' })
  strategyTypeId: number;

  @ApiProperty({ description: '信号灯策略调度id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '信号灯策略调度id不能为空' })
  strategyScheduleId: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto extends SignalLightStrategyTypeStrategyScheduleMappingInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyTypeStrategyScheduleMappingInsOneDto)
  items: SignalLightStrategyTypeStrategyScheduleMappingInsOneDto[];
}

export class SignalLightStrategyTypeStrategyScheduleMappingUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto)
  items: SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto[];
}
