import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { CodeGenColumnDto } from './dto';

@Injectable()
export class CodeGenColumnFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async findByTableId(tableId: number) {
    return this.mysqlPrisma.findAll<CodeGenColumnDto>('sys_code_gen_column', {
      data: { tableId: tableId },
      orderBy: true,
    });
  }
}
