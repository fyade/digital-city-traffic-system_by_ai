import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DctsUserService } from './dcts-user.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { DctsUserSelListDto, AdminNewDctsUserDto, ResetDctsUserPsdDto } from './dto';
import { encryptUtils } from "@dcts/common";

@Controller('/dcts/user/dcts-user')
@ApiTags('数智交通全域调度系统/用户管理/dcts用户')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class DctsUserController {
  constructor(private readonly dctsUserService: DctsUserService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询dcts用户',
  })
  @Authorize({
    permission: 'dcts:user:dctsUser:selList',
    label: '分页查询dcts用户',
  })
  async selDctsUser(@Query() dto: DctsUserSelListDto): Promise<R> {
    return this.dctsUserService.selDctsUser(dto);
  }

  @Post('/admin-new')
  @ApiOperation({
    summary: '管理员新增dcts用户'
  })
  @Authorize({
    permission: 'dcts:user:dctsUser:adminNewDctsUser',
    label: '管理员新增dcts用户'
  })
  async insDctsUser(@Body() dto: AdminNewDctsUserDto): Promise<R> {
    if (dto.psdType === 'b') {
      dto.password = encryptUtils.aes.decrypt(dto.password)
    }
    delete dto.psdType
    return this.dctsUserService.insDctsUser(dto)
  }

  @Post('/admin-reset-user-psd')
  @ApiOperation({
    summary: '管理员重置dcts用户密码'
  })
  @Authorize({
    permission: 'dcts:user:dctsUser:adminResetDctsUserPsd',
    label: '管理员重置dcts用户密码'
  })
  async adminResetDctsUserPsd(@Body() dto: ResetDctsUserPsdDto): Promise<R> {
    if (dto.psdType === 'b') {
      dto.password = encryptUtils.aes.decrypt(dto.password);
    }
    delete dto.psdType;
    return this.dctsUserService.adminResetDctsUserPsd(dto)
  }
}
