import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

class NodesWithWaysInPolygonDto_point {
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

  @ApiProperty({description: '多边形', required: true, type: [NodesWithWaysInPolygonDto_point]})
  @IsNotEmpty({message: '多边形不能为空'})
  @IsArray({message: '多边形必须为数组'})
  @ArrayMinSize(3, {message: '多边形至少需要 3 个顶点'})
  @ValidateNested({each: true})
  @Type(() => NodesWithWaysInPolygonDto_point)
  points: NodesWithWaysInPolygonDto_point[]
}
