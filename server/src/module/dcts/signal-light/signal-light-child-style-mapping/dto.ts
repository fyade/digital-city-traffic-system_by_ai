import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightChildStyleMappingDto extends BaseDto {
  id: number;

  childId: number;

  styleId: number;
}

export class SignalLightChildStyleMappingSelListDto extends PageDto {
  @ApiProperty({ description: '子信号灯id', required: false })
  childId: number;

  @ApiProperty({ description: '样式id', required: false })
  styleId: number;
}

export class SignalLightChildStyleMappingSelAllDto {
  @ApiProperty({ description: '子信号灯id', required: false })
  childId: number;

  @ApiProperty({ description: '样式id', required: false })
  styleId: number;
}

export class SignalLightChildStyleMappingInsOneDto {
  @ApiProperty({ description: '子信号灯id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '子信号灯id不能为空' })
  childId: number;

  @ApiProperty({ description: '样式id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '样式id不能为空' })
  styleId: number;
}

export class SignalLightChildStyleMappingUpdOneDto extends SignalLightChildStyleMappingInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightChildStyleMappingInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightChildStyleMappingInsOneDto)
  items: SignalLightChildStyleMappingInsOneDto[];
}

export class SignalLightChildStyleMappingUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightChildStyleMappingUpdOneDto)
  items: SignalLightChildStyleMappingUpdOneDto[];
}
