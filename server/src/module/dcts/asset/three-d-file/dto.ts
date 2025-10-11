import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ThreeDFileDto extends BaseDto {
  id: number;

  unitId: number;

  fileName: string;

  orderNum: number;
}

export class ThreeDFileSelListDto extends PageDto {
  @ApiProperty({ description: '文件单元id', required: false })
  unitId: number;

  @ApiProperty({ description: '文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;
}

export class ThreeDFileSelAllDto {
  @ApiProperty({ description: '文件单元id', required: false })
  unitId: number;

  @ApiProperty({ description: '文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;
}

export class ThreeDFileInsOneDto {
  @ApiProperty({ description: '文件单元id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '文件单元id不能为空' })
  unitId: number;

  @ApiProperty({ description: '文件名', required: true })
  @IsNotEmpty({ message: '文件名不能为空' })
  @MaxLength(200, { message: '文件名不能超过200个字符' })
  fileName: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;
}

export class ThreeDFileUpdOneDto extends ThreeDFileInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class ThreeDFileInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThreeDFileInsOneDto)
  items: ThreeDFileInsOneDto[];
}

export class ThreeDFileUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThreeDFileUpdOneDto)
  items: ThreeDFileUpdOneDto[];
}
