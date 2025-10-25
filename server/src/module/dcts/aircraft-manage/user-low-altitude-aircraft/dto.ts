import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserLowAltitudeAircraftDto extends BaseDto {
  id: number;

  aircraftName: string;

  serialNumber: string;

  registrationNumber: string;
}

export class UserLowAltitudeAircraftSelListDto extends PageDto {
  @ApiProperty({ description: '航空器名', required: false })
  aircraftName: string;

  @ApiProperty({ description: '序列号', required: false })
  serialNumber: string;

  @ApiProperty({ description: '实名登记号', required: false })
  registrationNumber: string;
}

export class UserLowAltitudeAircraftSelAllDto {
  @ApiProperty({ description: '航空器名', required: false })
  aircraftName: string;

  @ApiProperty({ description: '序列号', required: false })
  serialNumber: string;

  @ApiProperty({ description: '实名登记号', required: false })
  registrationNumber: string;
}

export class UserLowAltitudeAircraftInsOneDto {
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
}

export class UserLowAltitudeAircraftUpdOneDto extends UserLowAltitudeAircraftInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class UserLowAltitudeAircraftInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserLowAltitudeAircraftInsOneDto)
  items: UserLowAltitudeAircraftInsOneDto[];
}

export class UserLowAltitudeAircraftUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserLowAltitudeAircraftUpdOneDto)
  items: UserLowAltitudeAircraftUpdOneDto[];
}
