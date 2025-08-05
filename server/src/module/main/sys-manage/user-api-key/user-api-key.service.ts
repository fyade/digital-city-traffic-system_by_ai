import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { UserApiKeyDto, UserApiKeySelListDto, UserApiKeySelAllDto, UserApiKeyInsOneDto, UserApiKeyUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { idUtils } from '@dcts/common';

@Injectable()
export class UserApiKeyService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_user_api_key', {
      notNullKeys: ['userId', 'userRole', 'apiKey'],
    });
  }

  async selUserApiKey(dto: UserApiKeySelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<UserApiKeyDto, UserApiKeySelListDto>('sys_user_api_key', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllUserApiKey(dto: UserApiKeySelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<UserApiKeyDto>('sys_user_api_key', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesUserApiKey(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<UserApiKeyDto>('sys_user_api_key', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserApiKey(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<UserApiKeyDto>('sys_user_api_key', Number(id));
    return R.ok(res);
  }

  async insUserApiKey(dto: UserApiKeyInsOneDto): Promise<R> {
    dto.apiKey = idUtils.genId()
    const res = await this.mysqlPrisma.create<UserApiKeyDto>('sys_user_api_key', dto);
    return R.ok(res);
  }

  async insUserApiKeys(dtos: UserApiKeyInsOneDto[]): Promise<R> {
    dtos.forEach(dto => {
      dto.apiKey = idUtils.genId()
    })
    const res = await this.mysqlPrisma.createMany<UserApiKeyDto>('sys_user_api_key', dtos);
    return R.ok(res);
  }

  async updUserApiKey(dto: UserApiKeyUpdOneDto): Promise<R> {
    delete dto.apiKey
    const res = await this.mysqlPrisma.updateById<UserApiKeyDto>('sys_user_api_key', dto);
    return R.ok(res);
  }

  async updUserApiKeys(dtos: UserApiKeyUpdOneDto[]): Promise<R> {
    dtos.forEach(dto => {
      delete dto.apiKey
    })
    const res = await this.mysqlPrisma.updateMany<UserApiKeyDto>('sys_user_api_key', dtos);
    return R.ok(res);
  }

  async delUserApiKey(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<UserApiKeyDto>('sys_user_api_key', ids);
    return R.ok(res);
  }
}
