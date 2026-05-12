import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PolygonPointDto {
  @ApiProperty({ description: '经度', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '经度不能为空' })
  @IsNumber({}, { message: '经度必须是数值' })
  lon: number;

  @ApiProperty({ description: '纬度', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '纬度不能为空' })
  @IsNumber({}, { message: '纬度必须是数值' })
  lat: number;
}

export class VehicleFlowStatisticsDto {
  @ApiProperty({ description: '参数版本', default: '1.0' })
  @IsOptional()
  @IsIn(['1.0'], { message: '参数版本值不在允许的值中' })
  version?: string = '1.0';

  @ApiProperty({ description: '多边形顶点数组', required: true, type: [PolygonPointDto] })
  @IsNotEmpty({ message: '多边形不能为空' })
  @IsArray({ message: '多边形必须为数组' })
  @ArrayMinSize(3, { message: '多边形至少需要 3 个顶点' })
  @ValidateNested({ each: true })
  @Type(() => PolygonPointDto)
  points: PolygonPointDto[];

  @ApiProperty({ description: '开始时间戳(ms)', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsNumber({}, { message: '开始时间必须是数值' })
  startTime: number;

  @ApiProperty({ description: '结束时间戳(ms)', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsNumber({}, { message: '结束时间必须是数值' })
  endTime: number;

  @ApiProperty({ description: '聚合粒度', default: 'hour', enum: ['hour', 'day'] })
  @IsOptional()
  @IsIn(['hour', 'day'], { message: '聚合粒度仅支持 hour 或 day' })
  groupBy?: 'hour' | 'day' = 'hour';
}

export class SignalLightStatusDistributionDto {
  @ApiProperty({ description: '参数版本', default: '1.0' })
  @IsOptional()
  @IsIn(['1.0'], { message: '参数版本值不在允许的值中' })
  version?: string = '1.0';

  @ApiProperty({ description: '信号灯组ID数组', required: true, type: [Number] })
  @IsNotEmpty({ message: '信号灯组ID不能为空' })
  @IsArray({ message: '信号灯组ID必须为数组' })
  @IsNumber({}, { each: true, message: '每个元素必须是数值' })
  @ArrayMinSize(1, { message: '至少需要一个信号灯组ID' })
  groupIds: number[];

  @ApiProperty({ description: '时间范围[起始ms, 结束ms]', required: true, type: [Number] })
  @IsNotEmpty({ message: '时间范围不能为空' })
  @IsArray({ message: '时间范围必须为数组' })
  @IsNumber({}, { each: true, message: '时间范围的每个元素必须是数值' })
  @ArrayMinSize(2, { message: '时间范围必须包含至少2个元素' })
  timeRange: [number, number];
}

export class CongestionDto {
  @ApiProperty({ description: '最小经度', required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  minLon: number;

  @ApiProperty({ description: '最大经度', required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  maxLon: number;

  @ApiProperty({ description: '最小纬度', required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  minLat: number;

  @ApiProperty({ description: '最大纬度', required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  maxLat: number;

  @ApiProperty({ description: '每边网格数', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cellsPerSide?: number = 10;
}
