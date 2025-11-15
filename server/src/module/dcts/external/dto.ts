import { PolygonPointDto } from "../spatial-data/dto";
import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class AddRouteInformationDto {
  @ApiProperty({description: '车牌号', required: true})
  @IsNotEmpty({message: '车牌号不能为空'})
  @MaxLength(20, {message: '车牌号不能超过20个字符'})
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

export class AddVehicleInfoDto {
  @ApiProperty({description: '车牌号数组', required: true, type: [String]})
  @IsArray()
  @IsString({each: true})
  @IsNotEmpty({each: true})
  plateNumbers: string[];
}

class AddVehicleTrackPointDtoDatas {
  time: number;
  position: [number, number];
  heading: number;
}

export class AddVehicleTrackPointDto {
  datas: AddVehicleTrackPointDtoDatas[][]
}

class AddAircraftTrackPointDtoDatas {
  lon: number
  lat: number
  height: number
  time: number
  heading: number
  index: number
}

export class AddAircraftTrackPointDto {
  datas: AddAircraftTrackPointDtoDatas[]
  end: boolean
}
