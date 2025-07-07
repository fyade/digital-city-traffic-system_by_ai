import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStrategyTypeDto extends BaseDto {
  id: number;

  name: string;

  description: string;
}

export class SignalLightStrategyTypeSelListDto extends PageDto {
  @ApiProperty({ description: '策略类型名', required: false })
  name: string;

  @ApiProperty({ description: '策略类型描述', required: false })
  description: string;
}

export class SignalLightStrategyTypeSelAllDto {
  @ApiProperty({ description: '策略类型名', required: false })
  name: string;

  @ApiProperty({ description: '策略类型描述', required: false })
  description: string;
}

export class SignalLightStrategyTypeInsOneDto {
  @ApiProperty({ description: '策略类型名', required: true })
  @IsNotEmpty({ message: '策略类型名不能为空' })
  name: string;

  @ApiProperty({ description: '策略类型描述', required: true })
  @IsNotEmpty({ message: '策略类型描述不能为空' })
  description: string;
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
