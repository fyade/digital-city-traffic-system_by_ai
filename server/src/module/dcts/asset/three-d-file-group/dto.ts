import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ThreeDFileGroupDto extends BaseDto {
  id: number;

  name: string;

  description: string;

  orderNum: number;
}

export class ThreeDFileGroupSelListDto extends PageDto {
  @ApiProperty({ description: '文件组名', required: false })
  name: string;

  @ApiProperty({ description: '文件组描述', required: false })
  description: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;
}

export class ThreeDFileGroupSelAllDto {
  @ApiProperty({ description: '文件组名', required: false })
  name: string;

  @ApiProperty({ description: '文件组描述', required: false })
  description: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;
}

export class ThreeDFileGroupInsOneDto {
  @ApiProperty({ description: '文件组名', required: true })
  @IsNotEmpty({ message: '文件组名不能为空' })
  @MaxLength(100, { message: '文件组名不能超过100个字符' })
  name: string;

  @ApiProperty({ description: '文件组描述', required: true })
  @IsNotEmpty({ message: '文件组描述不能为空' })
  @MaxLength(100, { message: '文件组描述不能超过100个字符' })
  description: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;
}

export class ThreeDFileGroupUpdOneDto extends ThreeDFileGroupInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class ThreeDFileGroupInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThreeDFileGroupInsOneDto)
  items: ThreeDFileGroupInsOneDto[];
}

export class ThreeDFileGroupUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThreeDFileGroupUpdOneDto)
  items: ThreeDFileGroupUpdOneDto[];
}
