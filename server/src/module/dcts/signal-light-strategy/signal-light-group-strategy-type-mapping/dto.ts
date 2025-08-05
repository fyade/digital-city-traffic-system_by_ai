import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightGroupStrategyTypeMappingDto extends BaseDto {
  id: number;

  groupId: number;

  strategyTypeId: number;
}

export class SignalLightGroupStrategyTypeMappingSelListDto extends PageDto {
  @ApiProperty({ description: 'groupId', required: false })
  groupId: number;

  @ApiProperty({ description: 'strategyTypeId', required: false })
  strategyTypeId: number;
}

export class SignalLightGroupStrategyTypeMappingSelAllDto {
  @ApiProperty({ description: 'groupId', required: false })
  groupId: number;

  @ApiProperty({ description: 'strategyTypeId', required: false })
  strategyTypeId: number;
}

export class SignalLightGroupStrategyTypeMappingInsOneDto {
  @ApiProperty({ description: 'groupId', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: 'groupId不能为空' })
  groupId: number;

  @ApiProperty({ description: 'strategyTypeId', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: 'strategyTypeId不能为空' })
  strategyTypeId: number;
}

export class SignalLightGroupStrategyTypeMappingUpdOneDto extends SignalLightGroupStrategyTypeMappingInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightGroupStrategyTypeMappingInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightGroupStrategyTypeMappingInsOneDto)
  items: SignalLightGroupStrategyTypeMappingInsOneDto[];
}

export class SignalLightGroupStrategyTypeMappingUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightGroupStrategyTypeMappingUpdOneDto)
  items: SignalLightGroupStrategyTypeMappingUpdOneDto[];
}
