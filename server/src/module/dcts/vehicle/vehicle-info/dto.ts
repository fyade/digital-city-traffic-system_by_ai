import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleInfoDto extends BaseDto {
  id: number;

  plateNumber: string;

  vehicleType: string;

  brand: string;

  color: string;
}

export class VehicleInfoSelListDto extends PageDto {
  @ApiProperty({ description: '车牌号', required: false })
  plateNumber: string;

  @ApiProperty({ description: '车辆类型', required: false })
  vehicleType: string;

  @ApiProperty({ description: '品牌', required: false })
  brand: string;

  @ApiProperty({ description: '颜色', required: false })
  color: string;
}

export class VehicleInfoSelAllDto {
  @ApiProperty({ description: '车牌号', required: false })
  plateNumber: string;

  @ApiProperty({ description: '车辆类型', required: false })
  vehicleType: string;

  @ApiProperty({ description: '品牌', required: false })
  brand: string;

  @ApiProperty({ description: '颜色', required: false })
  color: string;
}

export class VehicleInfoInsOneDto {
  @ApiProperty({ description: '车牌号', required: true })
  @IsNotEmpty({ message: '车牌号不能为空' })
  @MaxLength(20, { message: '车牌号不能超过20个字符' })
  plateNumber: string;

  @ApiProperty({ description: '车辆类型', required: true })
  @IsNotEmpty({ message: '车辆类型不能为空' })
  @MaxLength(20, { message: '车辆类型不能超过20个字符' })
  vehicleType: string;

  @ApiProperty({ description: '品牌', required: true })
  @IsNotEmpty({ message: '品牌不能为空' })
  @MaxLength(50, { message: '品牌不能超过50个字符' })
  brand: string;

  @ApiProperty({ description: '颜色', required: true })
  @IsNotEmpty({ message: '颜色不能为空' })
  @MaxLength(20, { message: '颜色不能超过20个字符' })
  color: string;
}

export class VehicleInfoUpdOneDto extends VehicleInfoInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class VehicleInfoInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleInfoInsOneDto)
  items: VehicleInfoInsOneDto[];
}

export class VehicleInfoUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleInfoUpdOneDto)
  items: VehicleInfoUpdOneDto[];
}
