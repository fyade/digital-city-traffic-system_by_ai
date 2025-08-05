import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignalLightStyleDto extends BaseDto {
  id: number;

  name: string;

  style: string;
}

export class SignalLightStyleSelListDto extends PageDto {
  @ApiProperty({ description: '样式名', required: false })
  name: string;

  @ApiProperty({ description: '样式', required: false })
  style: string;
}

export class SignalLightStyleSelAllDto {
  @ApiProperty({ description: '样式名', required: false })
  name: string;

  @ApiProperty({ description: '样式', required: false })
  style: string;
}

export class SignalLightStyleInsOneDto {
  @ApiProperty({ description: '样式名', required: true })
  @IsNotEmpty({ message: '样式名不能为空' })
  name: string;

  @ApiProperty({ description: '样式', required: true })
  @IsNotEmpty({ message: '样式不能为空' })
  style: string;
}

export class SignalLightStyleUpdOneDto extends SignalLightStyleInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class SignalLightStyleInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStyleInsOneDto)
  items: SignalLightStyleInsOneDto[];
}

export class SignalLightStyleUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalLightStyleUpdOneDto)
  items: SignalLightStyleUpdOneDto[];
}
