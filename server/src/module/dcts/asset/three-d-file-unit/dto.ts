import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ThreeDFileUnitDto extends BaseDto {
  id: number;

  groupId: number;

  name: string;

  description: string;

  orderNum: number;
}

export class ThreeDFileUnitSelListDto extends PageDto {
  @ApiProperty({ description: '文件组id', required: false })
  groupId: number;

  @ApiProperty({ description: '文件单元名', required: false })
  name: string;

  @ApiProperty({ description: '文件单元描述', required: false })
  description: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;
}

export class ThreeDFileUnitSelAllDto {
  @ApiProperty({ description: '文件组id', required: false })
  groupId: number;

  @ApiProperty({ description: '文件单元名', required: false })
  name: string;

  @ApiProperty({ description: '文件单元描述', required: false })
  description: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;
}

export class ThreeDFileUnitInsOneDto {
  @ApiProperty({ description: '文件组id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '文件组id不能为空' })
  groupId: number;

  @ApiProperty({ description: '文件单元名', required: true })
  @IsNotEmpty({ message: '文件单元名不能为空' })
  @MaxLength(100, { message: '文件单元名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '文件单元描述', required: true })
  @IsNotEmpty({ message: '文件单元描述不能为空' })
  @MaxLength(100, { message: '文件单元描述不能超过100个字符' })
  description: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;
}

export class ThreeDFileUnitUpdOneDto extends ThreeDFileUnitInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class ThreeDFileUnitInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThreeDFileUnitInsOneDto)
  items: ThreeDFileUnitInsOneDto[];
}

export class ThreeDFileUnitUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThreeDFileUnitUpdOneDto)
  items: ThreeDFileUnitUpdOneDto[];
}
