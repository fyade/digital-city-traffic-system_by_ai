import { PolygonPointDto } from "../spatial-data/dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AddRouteInformationDto {
  @ApiProperty({ description: '车牌号', required: true })
  @IsNotEmpty({ message: '车牌号不能为空' })
  @MaxLength(20, { message: '车牌号不能超过20个字符' })
  plateNumber: string;

  @ApiProperty({description: '起点', required: true, type: PolygonPointDto})
  @IsNotEmpty({message: '起点不能为空'})
  @IsObject()
  @ValidateNested()
  @Type(() => PolygonPointDto)
  startPoint: PolygonPointDto;

  @ApiProperty({description: '终点', required: true, type: PolygonPointDto})
  @IsNotEmpty({message: '终点不能为空'})
  @IsObject()
  @ValidateNested()
  @Type(() => PolygonPointDto)
  endPoint: PolygonPointDto;
}
