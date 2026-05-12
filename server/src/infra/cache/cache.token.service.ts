import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { TokenDto } from '../../common/token';
import { serverConfig } from '@dcts/config';
import { idUtils } from '@dcts/common';
import { ScheduleService } from '../schedule/schedule.service';
import { IpInfoDto } from '../../common/ipInfo';

const currentConfig = serverConfig.currentConfig();

@Injectable()
export class CacheTokenService {
  readonly UUID_TOKEN = 'zzz:uuid:token';
  readonly SORT_UUID = 'sort:uuid';
  readonly UUID1_UUID = 'zzz:uuid1:uuid';
  readonly VERIFICATION_CODE = 'zzz:verification:code';
  readonly PASSWORD_KEY = 'zzz:password:key';

  readonly EMAIL_CODE = 'zzz:email:code';

  constructor(
    private readonly redis: RedisService,
    private readonly scheduleService: ScheduleService,
  ) {
    this.scheduleService.addScheduleFunc('sys:cache:delOfflineUsers', this.delOfflineUsers.bind(this));
  }

  private async delOfflineUsers() {
    const delUuids = [];
    const allCount = await this.redis.zcard(this.SORT_UUID);
    const pageSize = 10;
    let cursor = 0;
    let ifStop = false;
    do {
      const thisPageSize = Math.min(allCount - cursor, pageSize);
      const uuids = await this.redis.zrevrange(this.SORT_UUID, cursor, cursor + thisPageSize - 1);
      for (const uuid of uuids) {
        const tokenDto = await this.verifyToken(uuid);
        if (!tokenDto) {
          delUuids.push(uuid);
        }
      }
      cursor += thisPageSize;
      if (cursor >= allCount) {
        ifStop = true;
      }
    } while (!ifStop);
    await this.redis.zrem(this.SORT_UUID, ...delUuids);
  }

  /**
   * 生成token
   * @param userId
   * @param username
   * @param loginRole
   * @param netInfo
   */
  async genToken(userId: string, username: string, loginRole: string, netInfo: IpInfoDto) {
    const nowTimestamp = Date.now();
    const jwtConstants = currentConfig.jwtConstants;
    const expireTimeStamp = nowTimestamp + jwtConstants.expireTime * 1000;
    const payload: TokenDto = {
      userid: userId,
      username: username,
      loginRole: loginRole,
      loginTime: new Date(),
      loginIp: netInfo.ip,
      loginBrowser: netInfo.browser,
      loginOs: netInfo.os,
      expireTimeStamp: expireTimeStamp,
    };
    const uuid = idUtils.randomUUID();
    await this.redis.zadd(this.SORT_UUID, nowTimestamp, uuid);
    await this.redis.setex(`${this.UUID_TOKEN}:${uuid}`, jwtConstants.expireTime, JSON.stringify(payload));
    return uuid;
  }

  /**
   * 解析token
   * @param tokenUuid
   */
  async verifyToken(tokenUuid: string): Promise<TokenDto | null> {
    const payloadString = await this.redis.get(`${this.UUID_TOKEN}:${tokenUuid}`);
    if (!payloadString) {
      return null;
    }
    try {
      const decoded = JSON.parse(payloadString) as TokenDto;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * 删除token
   * @param tokenUuids
   */
  async deleteToken(...tokenUuids: string[]) {
    await this.redis.del(...tokenUuids.map((tokenUuid) => `${this.UUID_TOKEN}:${tokenUuid}`));
  }

  /**
   * 保存验证码内容
   * @param uuid
   * @param code
   */
  async saveVerificationCode(uuid: string, code: string) {
    await this.redis.setex(`${this.VERIFICATION_CODE}:${uuid}`, currentConfig.VERIFICATION_CODE_EXPIRE_TIME, code);
  }

  /**
   * 获取验证码内容
   * @param uuid
   */
  async getVerificationCode(uuid: string) {
    return this.redis.get(`${this.VERIFICATION_CODE}:${uuid}`);
  }

  /**
   * 删除验证码内容
   * @param uuid
   */
  async deleteVerificationCode(uuid: string) {
    await this.redis.del(`${this.VERIFICATION_CODE}:${uuid}`);
  }

  /**
   * 保存密码公钥私钥
   * @param uuid
   * @param key
   */
  async savePasswordKey(uuid: string, key: { publicKey: string; privateKey: string }) {
    const time = currentConfig.VERIFICATION_CODE_EXPIRE_TIME;
    await this.redis.setex(`${this.PASSWORD_KEY}:${uuid}`, time, JSON.stringify(key));
  }

  /**
   * 获取密码公钥私钥
   * @param uuid
   */
  async getPasswordKey(uuid: string) {
    const s = await this.redis.get(`${this.PASSWORD_KEY}:${uuid}`);
    try {
      return JSON.parse(s) as { publicKey: string; privateKey: string };
    } catch {
      return null;
    }
  }

  /**
   * 删除密码公钥私钥
   * @param uuid
   */
  async deletePasswordKey(uuid: string) {
    await this.redis.del(`${this.PASSWORD_KEY}:${uuid}`);
  }

  async saveEmailCode(email: string, code: string) {
    await this.redis.setex(`${this.EMAIL_CODE}:${email}`, currentConfig.VERIFICATION_CODE_EXPIRE_TIME, code);
  }

  async getEmailCode(email: string) {
    return this.redis.get(`${this.EMAIL_CODE}:${email}`);
  }

  async deleteEmailCode(email: string) {
    await this.redis.del(`${this.EMAIL_CODE}:${email}`);
  }
}
