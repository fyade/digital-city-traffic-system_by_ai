import { Injectable } from '@nestjs/common';
import { WsOnlineUserSelListDto } from './dto';
import { R } from '../../../../common/R';
import { deepClone } from '../../../../util/ObjectUtils';
import { WsTokenDto } from '../../../../common/token';
import { WsService } from '../../../../infra/ws/ws.service';
import { PageVo } from '../../../../common/vo/PageVo';

@Injectable()
export class WsOnlineUserService {
  constructor(private readonly wsService: WsService) {}

  async selWsOnlineUserList(dto: WsOnlineUserSelListDto): Promise<R> {
    const allValues = await this.scanUserList(dto);
    const pageVo = new PageVo<WsTokenDto>(dto.pageNum, dto.pageSize, allValues.count, allValues.values);
    return R.ok(pageVo);
  }

  private async scanUserList(param: WsOnlineUserSelListDto) {
    const dto = deepClone(param);
    const pageNum = Number(dto.pageNum);
    const pageSize = Number(dto.pageSize);
    delete dto.pageNum;
    delete dto.pageSize;
    const values: WsTokenDto[] = [];
    const onlineUsers = this.wsService.getOnlineUsers();
    let count = 0;
    const keys = Array.from(onlineUsers.keys());
    for (let i = keys.length - 1; i >= 0; i--) {
      const value = onlineUsers.get(keys[i]);
      if (Object.keys(dto).every((key) => value[key].includes(dto[key]))) {
        count++;
        if (values.length < pageSize && (pageNum - 1) * pageSize < count && count <= pageNum * pageSize) {
          values.push(value);
        }
      }
    }
    return { count, values };
  }
}
