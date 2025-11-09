import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WsOnlineUserService } from './ws-online-user.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { WsOnlineUserSelListDto } from './dto';
import { R } from '../../../../common/R';

@Controller('/main/sys-monitor/ws-online-user')
@ApiTags('主系统/系统监控/WS在线用户')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class WsOnlineUserController {
  constructor(private readonly wsOnlineUserService: WsOnlineUserService) {}

  @Get()
  @ApiOperation({
    summary: '分页查询WS在线用户',
  })
  @Authorize({
    permission: 'main:sysMonitor:wsOnlineUser:selList',
    label: '分页查询WS在线用户',
  })
  async selWsOnlineUserList(@Query() dto: WsOnlineUserSelListDto): Promise<R> {
    return this.wsOnlineUserService.selWsOnlineUserList(dto);
  }
}
