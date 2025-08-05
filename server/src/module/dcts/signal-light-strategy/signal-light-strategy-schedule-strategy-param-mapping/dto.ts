import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyScheduleStrategyParamMappingDto extends BaseDto {
  id: number;

  strategyScheduleId: number;

  strategyParamId: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingSelListDto extends PageDto {
  @ApiProperty({ description: '信号灯策略调度id', required: false })
  strategyScheduleId: number;

  @ApiProperty({ description: '信号灯策略参数id', required: false })
  strategyParamId: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingSelAllDto {
  @ApiProperty({ description: '信号灯策略调度id', required: false })
  strategyScheduleId: number;

  @ApiProperty({ description: '信号灯策略参数id', required: false })
  strategyParamId: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingInsOneDto {
  @ApiProperty({ description: '信号灯策略调度id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '信号灯策略调度id不能为空' })
  strategyScheduleId: number;

  @ApiProperty({ description: '信号灯策略参数id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '信号灯策略参数id不能为空' })
  strategyParamId: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingUpdOneDto extends SignalLightStrategyScheduleStrategyParamMappingInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyScheduleStrategyParamMappingInsOneDto)
  items: SignalLightStrategyScheduleStrategyParamMappingInsOneDto[];
}

export class SignalLightStrategyScheduleStrategyParamMappingUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStrategyScheduleStrategyParamMappingUpdOneDto)
  items: SignalLightStrategyScheduleStrategyParamMappingUpdOneDto[];
}
