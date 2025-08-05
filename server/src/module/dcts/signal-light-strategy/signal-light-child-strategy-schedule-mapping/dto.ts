import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightChildStrategyScheduleMappingDto extends BaseDto {
  id: number;

  childLightId: number;

  strategyScheduleId: number;
}

export class SignalLightChildStrategyScheduleMappingSelListDto extends PageDto {
  @ApiProperty({ description: '子信号灯id', required: false })
  childLightId: number;

  @ApiProperty({ description: '信号灯策略调度id', required: false })
  strategyScheduleId: number;
}

export class SignalLightChildStrategyScheduleMappingSelAllDto {
  @ApiProperty({ description: '子信号灯id', required: false })
  childLightId: number;

  @ApiProperty({ description: '信号灯策略调度id', required: false })
  strategyScheduleId: number;
}

export class SignalLightChildStrategyScheduleMappingInsOneDto {
  @ApiProperty({ description: '子信号灯id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '子信号灯id不能为空' })
  childLightId: number;

  @ApiProperty({ description: '信号灯策略调度id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '信号灯策略调度id不能为空' })
  strategyScheduleId: number;
}

export class SignalLightChildStrategyScheduleMappingUpdOneDto extends SignalLightChildStrategyScheduleMappingInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightChildStrategyScheduleMappingInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightChildStrategyScheduleMappingInsOneDto)
  items: SignalLightChildStrategyScheduleMappingInsOneDto[];
}

export class SignalLightChildStrategyScheduleMappingUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightChildStrategyScheduleMappingUpdOneDto)
  items: SignalLightChildStrategyScheduleMappingUpdOneDto[];
}
