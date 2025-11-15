import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { CodeGenTableDto } from './dto';

@Injectable()
export class CodeGenTableFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getById(id: number) {
    return this.mysqlPrisma.findById<CodeGenTableDto>('sys_code_gen_table', id);
  }
}
