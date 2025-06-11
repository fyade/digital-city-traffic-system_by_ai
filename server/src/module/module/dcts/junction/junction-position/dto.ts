import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class JunctionPositionDto extends BaseDto {
  id: number;

  geom: string;

  name: string;

  junctionType: string;
}

export class JunctionPositionSelListDto extends PageDto {
  @ApiProperty({ description: '位置', required: false })
  geom: string;

  @ApiProperty({ description: '路口名', required: false })
  name: string;

  @ApiProperty({ description: '路口类型', required: false })
  junctionType: string;
}

export class JunctionPositionSelAllDto {
  @ApiProperty({ description: '位置', required: false })
  geom: string;

  @ApiProperty({ description: '路口名', required: false })
  name: string;

  @ApiProperty({ description: '路口类型', required: false })
  junctionType: string;
}

export class JunctionPositionInsOneDto {
  @ApiProperty({ description: '位置', required: true })
  @IsNotEmpty({ message: '位置不能为空' })
  geom: string;

  @ApiProperty({ description: '路口名', required: true })
  @IsNotEmpty({ message: '路口名不能为空' })
  name: string;

  @ApiProperty({ description: '路口类型', required: true })
  @IsNotEmpty({ message: '路口类型不能为空' })
  junctionType: string;
}

export class JunctionPositionUpdOneDto extends JunctionPositionInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class JunctionPositionInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JunctionPositionInsOneDto)
  items: JunctionPositionInsOneDto[];
}

export class JunctionPositionUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JunctionPositionUpdOneDto)
  items: JunctionPositionUpdOneDto[];
}
