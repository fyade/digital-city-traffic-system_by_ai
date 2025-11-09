import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LogUserLoginWsDto extends BaseDto {
  id: number;

  userId: string;

  loginRole: string;

  loginIp: string;

  loginPosition: string;

  loginBrowser: string;

  loginOs: string;

  ifSuccess: string;

  failType: string;

  remark: string;
}

export class LogUserLoginWsSelListDto extends PageDto {
  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '登录身份', required: false })
  loginRole: string;

  @ApiProperty({ description: '登录ip', required: false })
  loginIp: string;

  @ApiProperty({ description: '登录地', required: false })
  loginPosition: string;

  @ApiProperty({ description: '登录浏览器', required: false })
  loginBrowser: string;

  @ApiProperty({ description: '登录系统', required: false })
  loginOs: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '失败类型', required: false })
  failType: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogUserLoginWsSelAllDto {
  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '登录身份', required: false })
  loginRole: string;

  @ApiProperty({ description: '登录ip', required: false })
  loginIp: string;

  @ApiProperty({ description: '登录地', required: false })
  loginPosition: string;

  @ApiProperty({ description: '登录浏览器', required: false })
  loginBrowser: string;

  @ApiProperty({ description: '登录系统', required: false })
  loginOs: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '失败类型', required: false })
  failType: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogUserLoginWsInsOneDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  @MaxLength(10, { message: '用户id不能超过10个字符' })
  userId: string;

  @ApiProperty({ description: '登录身份', required: true })
  @IsNotEmpty({ message: '登录身份不能为空' })
  @MaxLength(30, { message: '登录身份不能超过30个字符' })
  loginRole: string;

  @ApiProperty({ description: '登录ip', required: true })
  @IsNotEmpty({ message: '登录ip不能为空' })
  @MaxLength(20, { message: '登录ip不能超过20个字符' })
  loginIp: string;

  @ApiProperty({ description: '登录地', required: true })
  @IsNotEmpty({ message: '登录地不能为空' })
  @MaxLength(30, { message: '登录地不能超过30个字符' })
  loginPosition: string;

  @ApiProperty({ description: '登录浏览器', required: true })
  @IsNotEmpty({ message: '登录浏览器不能为空' })
  @MaxLength(30, { message: '登录浏览器不能超过30个字符' })
  loginBrowser: string;

  @ApiProperty({ description: '登录系统', required: true })
  @IsNotEmpty({ message: '登录系统不能为空' })
  @MaxLength(30, { message: '登录系统不能超过30个字符' })
  loginOs: string;

  @ApiProperty({ description: '是否成功', required: true })
  @IsNotEmpty({ message: '是否成功不能为空' })
  @MaxLength(1, { message: '是否成功不能超过1个字符' })
  ifSuccess: string;

  @ApiProperty({ description: '失败类型', required: true })
  @IsNotEmpty({ message: '失败类型不能为空' })
  @MaxLength(20, { message: '失败类型不能超过20个字符' })
  failType: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @MaxLength(100, { message: '备注不能超过100个字符' })
  remark: string;
}

export class LogUserLoginWsUpdOneDto extends LogUserLoginWsInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class LogUserLoginWsInsMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogUserLoginWsInsOneDto)
  items: LogUserLoginWsInsOneDto[];
}

export class LogUserLoginWsUpdMoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogUserLoginWsUpdOneDto)
  items: LogUserLoginWsUpdOneDto[];
}
