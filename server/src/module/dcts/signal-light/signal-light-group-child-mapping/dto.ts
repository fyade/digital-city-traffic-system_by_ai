import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightGroupChildMappingDto extends BaseDto {
  id: number;

  groupId: number;

  childLightId: number;
}

export class SignalLightGroupChildMappingSelListDto extends PageDto {
  @ApiProperty({ description: '组id', required: false })
  groupId: number;

  @ApiProperty({ description: '子id', required: false })
  childLightId: number;
}

export class SignalLightGroupChildMappingSelAllDto {
  @ApiProperty({ description: '组id', required: false })
  groupId: number;

  @ApiProperty({ description: '子id', required: false })
  childLightId: number;
}

export class SignalLightGroupChildMappingInsOneDto {
  @ApiProperty({ description: '组id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '组id不能为空' })
  groupId: number;

  @ApiProperty({ description: '子id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '子id不能为空' })
  childLightId: number;
}

export class SignalLightGroupChildMappingUpdOneDto extends SignalLightGroupChildMappingInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightGroupChildMappingInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightGroupChildMappingInsOneDto)
  items: SignalLightGroupChildMappingInsOneDto[];
}

export class SignalLightGroupChildMappingUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightGroupChildMappingUpdOneDto)
  items: SignalLightGroupChildMappingUpdOneDto[];
}
