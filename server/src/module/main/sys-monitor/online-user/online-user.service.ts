import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { RedisService } from '../../../../infra/redis/redis.service';
import { CacheTokenService } from '../../../../infra/cache/cache.token.service';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { OnlineUserSelListDto } from './dto';
import { PageVo } from '../../../../common/vo/PageVo';
import { TokenDto } from '../../../../common/token';
import { WinstonService } from '../../../../infra/winston/winston.service';
import { idUtils } from '@dcts/common';
import { serverConfig } from '@dcts/config';
import { deepClone } from '../../../../util/ObjectUtils';

@Injectable()
export class OnlineUserService {
  private SORT_UUID: string;
  private UUID1_UUID: string;

  constructor(
    private readonly redis: RedisService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly bcs: BaseContextService,
    private readonly winston: WinstonService,
  ) {
    this.SORT_UUID = this.cacheTokenService.SORT_UUID;
    this.UUID1_UUID = this.cacheTokenService.UUID1_UUID;
  }

  async selOnlineUserList(dto: OnlineUserSelListDto): Promise<R> {
    const allKeys = await this.scanUserList(dto);
    const allKeys2 = [];
    for (const key of allKeys.keys) {
      const id = idUtils.genId();
      allKeys2.push(id);
      await this.redis.setex(`${this.UUID1_UUID}:${id}`, serverConfig.currentConfig().jwtConstants.expireTime, key);
    }
    const list = allKeys.values.map((obj, index) => ({
      ...obj,
      id: allKeys2[index],
    }));
    const pageVo = new PageVo<TokenDto>(dto.pageNum, dto.pageSize, allKeys.count, list);
    return R.ok(pageVo);
  }

  async delOnlineUser(ids: string[]): Promise<R> {
    const keys = await this.redis.mget(...ids.map((id) => `${this.UUID1_UUID}:${id}`));
    await this.cacheTokenService.deleteToken(...keys);
    await this.redis.zrem(this.SORT_UUID, ...keys);
    await this.redis.del(...ids.map((key) => `${this.UUID1_UUID}:${key}`));
    return R.ok(true);
  }

  private async scanUserList(param: OnlineUserSelListDto) {
    const dto = deepClone(param);
    const pageNum = Number(dto.pageNum);
    const pageSize = Number(dto.pageSize);
    delete dto.pageNum;
    delete dto.pageSize;
    const keys: string[] = [];
    const values: TokenDto[] = [];
    const allCount = await this.redis.zcard(this.SORT_UUID);
    let count = 0;
    let cursor = 0;
    let ifStop = false;
    do {
      const thisPageSize = Math.min(allCount - cursor, pageSize);
      const uuids = await this.redis.zrevrange(this.SORT_UUID, cursor, cursor + thisPageSize - 1);
      let _count = 0;
      for (const uuid of uuids) {
        const tokenDto = await this.cacheTokenService.verifyToken(uuid);
        if (tokenDto) {
          if (Object.keys(dto).every((key) => tokenDto[key].includes(dto[key]))) {
            _count++;
            if (
              keys.length < pageSize &&
              (pageNum - 1) * pageSize < count + _count &&
              count + _count <= pageNum * pageSize
            ) {
              keys.push(uuid);
              values.push(tokenDto);
            }
          }
        }
      }
      count += _count;
      cursor += thisPageSize;
      if (cursor >= allCount) {
        ifStop = true;
      }
    } while (!ifStop);
    return { keys, count, values };
  }
}
