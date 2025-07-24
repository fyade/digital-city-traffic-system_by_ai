import { Injectable } from "@nestjs/common";
import { MysqlPrismaService } from '../../prisma/mysql.prisma.service';
import { DicTypeDto } from "../module/main/sys-manage/dic-type/dto";
import { final } from "../../util/base";
import { DicDataDto } from "../module/main/sys-manage/dic-data/dto";

@Injectable()
export class CommonService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
  ) {
  }

  async selDicDataOfType(perm: string, label: string = '') {
    const dicTypeDto = await this.mysqlPrisma.findFirst<DicTypeDto>('sys_dic_type', {
      type: perm,
      ifDisabled: final.N,
    });
    const ret: DicDataDto[] = [];
    if (dicTypeDto) {
      const dicDataDtos = await this.mysqlPrisma.findAll<DicDataDto>('sys_dic_data', {
        data: { label: label, dicTypeId: dicTypeDto.id, ifDisabled: final.N },
        orderBy: true,
      });
      ret.push(...dicDataDtos);
    }
    return ret;
  }
}
