import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested
} from "class-validator";

class PolygonPointDto {
  @ApiProperty({description: '经度', required: true})
  @Type(() => Number)
  @IsNotEmpty({message: '经度不能为空'})
  @IsNumber({}, {message: '经度必须是数值'})
  lon: number;

  @ApiProperty({description: '纬度', required: true})
  @Type(() => Number)
  @IsNotEmpty({message: '纬度不能为空'})
  @IsNumber({}, {message: '纬度必须是数值'})
  lat: number;
}

export class NodesWithWaysInPolygonDto {
  @ApiProperty({description: '参数版本', default: '1.0'})
  @IsOptional()
  @IsIn(['1.0'], {message: '参数版本值不在允许的值中'})
  version: string = '1.0';

  @ApiProperty({description: '多边形', required: true, type: [PolygonPointDto]})
  @IsNotEmpty({message: '多边形不能为空'})
  @IsArray({message: '多边形必须为数组'})
  @ArrayMinSize(3, {message: '多边形至少需要 3 个顶点'})
  @ValidateNested({each: true})
  @Type(() => PolygonPointDto)
  points: PolygonPointDto[]
}

export class SignalLightGroupsInPolygonDto {
  @ApiProperty({description: '参数版本', default: '1.0'})
  @IsOptional()
  @IsIn(['1.0'], {message: '参数版本值不在允许的值中'})
  version: string = '1.0';

  @ApiProperty({description: '是否需要一并返回子信号灯', default: true})
  @IsOptional()
  @IsBoolean()
  ifChild: boolean = true;

  @ApiProperty({description: '多边形', required: true, type: [PolygonPointDto]})
  @IsNotEmpty({message: '多边形不能为空'})
  @IsArray({message: '多边形必须为数组'})
  @ArrayMinSize(3, {message: '多边形至少需要 3 个顶点'})
  @ValidateNested({each: true})
  @Type(() => PolygonPointDto)
  points: PolygonPointDto[]
}

export class CalculateLightsInPolygonDto {
  @ApiProperty({description: '参数版本', default: '1.0'})
  @IsOptional()
  @IsIn(['1.0'], {message: '参数版本值不在允许的值中'})
  version: string = '1.0';

  @ApiProperty({description: '是否直接返回数据', default: false})
  @IsOptional()
  @IsBoolean()
  ifReturn: boolean = false;

  @ApiProperty({description: '信号灯组id数组', type: [Number], default: null, nullable: true})
  @IsOptional()
  @IsArray({message: '信号灯组id数组必须为数组'})
  @IsNumber({}, {each: true, message: '信号灯组id数组的每个元素必须是数值类型'})
  groupIds: number[] | null = null

  @ApiProperty({description: '多边形', type: [PolygonPointDto], default: null, nullable: true})
  @IsOptional()
  @IsArray({message: '多边形必须为数组'})
  @ValidateNested({each: true})
  @Type(() => PolygonPointDto)
  points: PolygonPointDto[] | null = null
}
