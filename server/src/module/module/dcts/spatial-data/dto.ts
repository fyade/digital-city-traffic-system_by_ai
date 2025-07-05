import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

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
  @ApiProperty({description: '参数版本', required: true})
  @IsNotEmpty({message: '参数版本不能为空'})
  @IsIn(['1.0'], {message: '参数版本值不在允许的值中'})
  version: string;

  @ApiProperty({description: '多边形', required: true, type: [PolygonPointDto]})
  @IsNotEmpty({message: '多边形不能为空'})
  @IsArray({message: '多边形必须为数组'})
  @ArrayMinSize(3, {message: '多边形至少需要 3 个顶点'})
  @ValidateNested({each: true})
  @Type(() => PolygonPointDto)
  points: PolygonPointDto[]
}

export class SignalLightGroupsInPolygonDto {
  @ApiProperty({description: '参数版本', required: true})
  @IsNotEmpty({message: '参数版本不能为空'})
  @IsIn(['1.0'], {message: '参数版本值不在允许的值中'})
  version: string;

  @ApiProperty({description: '是否需要一并返回子信号灯', required: true})
  @IsNotEmpty({message: '是否需要一并返回子信号灯不能为空'})
  @IsBoolean()
  ifChild: boolean;

  @ApiProperty({description: '多边形', required: true, type: [PolygonPointDto]})
  @IsNotEmpty({message: '多边形不能为空'})
  @IsArray({message: '多边形必须为数组'})
  @ArrayMinSize(3, {message: '多边形至少需要 3 个顶点'})
  @ValidateNested({each: true})
  @Type(() => PolygonPointDto)
  points: PolygonPointDto[]
}
