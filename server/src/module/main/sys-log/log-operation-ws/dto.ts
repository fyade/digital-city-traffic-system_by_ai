import { BaseDto2 } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LogOperationWsDto extends BaseDto2 {
  id: number;

  socketId: string;

  callIp: string;

  hostName: string;

  wsPerms: string;

  userId: string;

  loginRole: string;

  ifSuccess: string;

  remark: string;
}

export class LogOperationWsSelListDto extends PageDto {
  @ApiProperty({ description: 'socketId', required: false })
  socketId: string;

  @ApiProperty({ description: '请求源ip', required: false })
  callIp: string;

  @ApiProperty({ description: '请求源地址', required: false })
  hostName: string;

  @ApiProperty({ description: '权限标识', required: false })
  wsPerms: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '登录身份', required: false })
  loginRole: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogOperationWsSelAllDto {
  @ApiProperty({ description: 'socketId', required: false })
  socketId: string;

  @ApiProperty({ description: '请求源ip', required: false })
  callIp: string;

  @ApiProperty({ description: '请求源地址', required: false })
  hostName: string;

  @ApiProperty({ description: '权限标识', required: false })
  wsPerms: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '登录身份', required: false })
  loginRole: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogOperationWsInsOneDto {
  @ApiProperty({ description: 'socketId', required: true })
  @IsNotEmpty({ message: 'socketId不能为空' })
  @MaxLength(40, { message: 'socketId不能超过40个字符' })
  socketId: string;

  @ApiProperty({ description: '请求源ip', required: true })
  @IsNotEmpty({ message: '请求源ip不能为空' })
  @MaxLength(20, { message: '请求源ip不能超过20个字符' })
  callIp: string;

  @ApiProperty({ description: '请求源地址', required: true })
  @IsNotEmpty({ message: '请求源地址不能为空' })
  @MaxLength(100, { message: '请求源地址不能超过100个字符' })
  hostName: string;

  @ApiProperty({ description: '权限标识', required: true })
  @IsNotEmpty({ message: '权限标识不能为空' })
  @MaxLength(100, { message: '权限标识不能超过100个字符' })
  wsPerms: string;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  @MaxLength(10, { message: '用户id不能超过10个字符' })
  userId: string;

  @ApiProperty({ description: '登录身份', required: true })
  @IsNotEmpty({ message: '登录身份不能为空' })
  @MaxLength(30, { message: '登录身份不能超过30个字符' })
  loginRole: string;

  @ApiProperty({ description: '是否成功', required: true })
  @IsNotEmpty({ message: '是否成功不能为空' })
  @MaxLength(1, { message: '是否成功不能超过1个字符' })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @MaxLength(100, { message: '备注不能超过100个字符' })
  remark: string;
}

export class LogOperationWsUpdOneDto extends LogOperationWsInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class LogOperationWsInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogOperationWsInsOneDto)
  items: LogOperationWsInsOneDto[];
}

export class LogOperationWsUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogOperationWsUpdOneDto)
  items: LogOperationWsUpdOneDto[];
}
