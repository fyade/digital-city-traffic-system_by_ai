import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LowAltitudeAircraftDto extends BaseDto {
  id: number;

  aircraftName: string;

  serialNumber: string;

  registrationNumber: string;

  type: string;
}

export class LowAltitudeAircraftSelListDto extends PageDto {
  @ApiProperty({ description: '航空器名', required: false })
  aircraftName: string;

  @ApiProperty({ description: '序列号', required: false })
  serialNumber: string;

  @ApiProperty({ description: '实名登记号', required: false })
  registrationNumber: string;

  @ApiProperty({ description: '航空器类型', required: false })
  type: string;
}

export class LowAltitudeAircraftSelAllDto {
  @ApiProperty({ description: '航空器名', required: false })
  aircraftName: string;

  @ApiProperty({ description: '序列号', required: false })
  serialNumber: string;

  @ApiProperty({ description: '实名登记号', required: false })
  registrationNumber: string;

  @ApiProperty({ description: '航空器类型', required: false })
  type: string;
}

export class LowAltitudeAircraftInsOneDto {
  @ApiProperty({ description: '航空器名', required: true })
  @IsNotEmpty({ message: '航空器名不能为空' })
  @MaxLength(300, { message: '航空器名不能超过300个字符' })
  aircraftName: string;

  @ApiProperty({ description: '序列号', required: true })
  @IsNotEmpty({ message: '序列号不能为空' })
  @MaxLength(300, { message: '序列号不能超过300个字符' })
  serialNumber: string;

  @ApiProperty({ description: '实名登记号', required: true })
  @IsNotEmpty({ message: '实名登记号不能为空' })
  @MaxLength(300, { message: '实名登记号不能超过300个字符' })
  registrationNumber: string;

  @ApiProperty({ description: '航空器类型', required: true })
  @IsNotEmpty({ message: '航空器类型不能为空' })
  @MaxLength(50, { message: '航空器类型不能超过50个字符' })
  type: string;
}

export class LowAltitudeAircraftUpdOneDto extends LowAltitudeAircraftInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class LowAltitudeAircraftInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LowAltitudeAircraftInsOneDto)
  items: LowAltitudeAircraftInsOneDto[];
}

export class LowAltitudeAircraftUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LowAltitudeAircraftUpdOneDto)
  items: LowAltitudeAircraftUpdOneDto[];
}
