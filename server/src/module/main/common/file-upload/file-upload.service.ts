import { HttpException, Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { final } from '../../../../util/base';
import {
  FileChunkDto,
  FileDto,
  FileSelListDto,
  FileUploadOneChunk_check,
  FileUploadOneChunk_merge,
  FileUploadOneChunk_upload,
} from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { saveFile } from '../../../../util/FileUtils';
import { Exception } from "../../../../exception/exception";
import { UnknownException } from "../../../../exception/unknown.exception";
import { serverConfig } from "@dcts/config";
import { idUtils, timeUtils } from "@dcts/common";
import { WinstonService } from "../../../../infra/winston/winston.service";

const SparkMD5 = require('spark-md5');

@Injectable()
export class FileUploadService {
  private env: ReturnType<typeof serverConfig.currentConfig>;
  private directoryPrefix = 'YYYY/MM/DD/';

  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly winston: WinstonService,
  ) {
    this.env = serverConfig.currentConfig();
    this.bcs.setFieldSelectParam('tbl_file', {
      notNullKeys: ['fileName', 'fileNewName', 'fileSize', 'fileMd5', 'ifChunk', 'chunkNum', 'ifMerge', 'ifFirst', 'ifFinished', 'module'],
      numberKeys: ['fileSize', 'chunkNum'],
    });
    this.bcs.setFieldSelectParam('tbl_file_chunk', {
      notNullKeys: ['fileName', 'fileNewName', 'fileSize', 'fileMd5', 'ifChunk', 'chunkNum', 'ifMerge', 'ifFirst', 'ifFinished', 'module'],
      numberKeys: ['fileSize', 'chunkNum'],
      ifUpdateRole: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
    });
  }

  async selList(dto: FileSelListDto): Promise<R> {
    const data = await this.mysqlPrisma.findPage<FileDto, FileSelListDto>('tbl_file', {
      data: dto,
      orderBy: {
        createTime: 'desc',
      },
    });
    for (let i = 0; i < data.list.length; i++) {
      if (data.list[i].ifChunk === final.Y && data.list[i].ifMerge === final.N) {
        const count = await this.mysqlPrisma.count('tbl_file_chunk', {
          data: {
            fileMd5: data.list[i].fileMd5,
            ifFinished: final.Y,
          },
        });
        data.list[i]['uploadedCount'] = count;
      }
    }
    return R.ok(data);
  }

  async fileUploadOneFull(file, {
                            fileName = '',
                            module = null,
                          }: {
                            fileName?: string
                            module?: string | null
                          } = {},
  ): Promise<R> {
    try {
      const fileName2 = fileName || file.originalname;
      const fileMd5 = SparkMD5.hash(file.buffer);
      // 如果已有相同文件，则不用上传了
      const sameFile = await this.mysqlPrisma.findFirst<FileDto>('tbl_file', {
        // fileName: fileName2,
        fileMd5: fileMd5,
        ifChunk: final.N,
        ifFinished: final.Y,
      });
      const fileSize = file.size;
      const fileSuffix = fileName2.substring(fileName2.lastIndexOf('.'));
      const fileUUID = idUtils.randomUUID();
      const s = timeUtils.formatDate(new Date(), { format: this.directoryPrefix, ifUseUTC: true });
      const fileNewName1 = fileUUID + fileSuffix;
      const fileNewName2 = s + fileNewName1;
      const fillObj = {
        fileName: fileName2,
        fileNewName: fileNewName2,
        fileSize: fileSize,
        fileMd5: fileMd5,
        ifChunk: final.N,
        ifFirst: final.Y,
        ifFinished: final.N,
        module: module,
      };
      if (sameFile) {
        // 如果已有相同文件，直接存库
        fillObj.fileNewName = sameFile.fileNewName;
        fillObj.fileSize = sameFile.fileSize;
        fillObj.ifFirst = final.N;
        fillObj.ifFinished = final.Y;
        await this.mysqlPrisma.create<FileDto>('tbl_file', fillObj);
      } else {
        // 如果无相同文件，先存下库，ifFinished字段设为false，然后存文件，最后更新库
        const newVar = await this.mysqlPrisma.create<FileDto>('tbl_file', fillObj);
        saveFile(this.env.file.uploadPath, fileNewName1, file.buffer, { a: s });
        await this.mysqlPrisma.updateById<FileDto>('tbl_file', {
          id: newVar.id,
          ifFinished: final.Y,
        });
      }
      return R.ok(fillObj.fileNewName);
    } catch (e) {
      this.winston.error(e);
      throw new UnknownException(this.bcs.getUserData().reqId, e as HttpException);
    }
  }

  async fileUploadOneChunkCheck(dto: FileUploadOneChunk_check): Promise<R> {
    const fileName = dto.fileName;
    const fileSuffix = fileName.substring(fileName.lastIndexOf('.'));
    const fileUUID = idUtils.randomUUID();
    const s = timeUtils.formatDate(new Date(), { format: this.directoryPrefix, ifUseUTC: true });
    const fileNewName1 = fileUUID + fileSuffix;
    const fileNewName2 = s + fileNewName1;
    const sameFile = await this.mysqlPrisma.findAll<FileDto>('tbl_file', {
      data: {
        // fileName: dto.fileName,
        fileMd5: dto.fileMd5,
        ifChunk: final.Y,
        deleted: final.N,
      },
    });
    if (sameFile.length > 0) {
      // 已存在
      // 是否合并
      let b = true;
      for (const sameFileElement of sameFile) {
        if (sameFileElement.ifMerge === final.N) {
          b = false;
        }
      }
      const sameFileElement1 = sameFile[0];
      if (b) {
        // 已合并
        // 保存文件信息至数据库
        const fillObj = {
          fileName: fileName,
          fileNewName: sameFileElement1.fileNewName,
          fileSize: sameFileElement1.fileSize,
          fileMd5: sameFileElement1.fileMd5,
          ifChunk: final.Y,
          chunkNum: sameFileElement1.chunkNum,
          ifFirst: final.N,
          ifMerge: final.Y,
          ifFinished: final.Y,
        };
        await this.mysqlPrisma.create<FileDto>('tbl_file', fillObj);
        return R.ok({
          merge: true,
          fileNewName: sameFileElement1.fileNewName,
          count: 0,
          uploadedIndexs: [],
        });
      } else {
        // 未合并
        // 保存文件信息至数据库
        const fillObj = {
          fileName: fileName,
          fileNewName: sameFileElement1.fileNewName,
          fileSize: sameFileElement1.fileSize,
          fileMd5: sameFileElement1.fileMd5,
          ifChunk: final.Y,
          chunkNum: sameFileElement1.chunkNum,
          ifFirst: final.N,
          ifMerge: final.N,
          ifFinished: final.N,
        };
        await this.mysqlPrisma.create<FileDto>('tbl_file', fillObj);
        const findMany = await this.mysqlPrisma.findAll<FileChunkDto>('tbl_file_chunk', {
          data: {
            fileNewName: sameFileElement1.fileNewName,
            fileMd5: dto.fileMd5,
            ifFinished: final.Y,
            deleted: final.N,
          },
        });
        return R.ok({
          merge: false,
          fileNewName: sameFileElement1.fileNewName,
          count: findMany.length,
          uploadedIndexs: findMany.map(item => item.chunkIndex),
        });
      }
    } else {
      // 不存在，保存文件信息至数据库
      const fillObj = {
        fileName: fileName,
        fileNewName: fileNewName2,
        fileSize: dto.fileSize,
        fileMd5: dto.fileMd5,
        ifChunk: final.Y,
        chunkNum: dto.chunkNum,
        ifFirst: final.Y,
        ifMerge: final.N,
        ifFinished: final.N,
      };
      await this.mysqlPrisma.create<FileDto>('tbl_file', fillObj);
      return R.ok({
        merge: false,
        fileNewName: fileNewName2,
        count: 0,
        uploadedIndexs: [],
      });
    }
  }

  async fileUploadOneChunkUpload(dto: FileUploadOneChunk_upload): Promise<R> {
    dto.chunkIndex = Number(dto.chunkIndex);
    try {
      const s = timeUtils.formatDate(new Date(), { format: this.directoryPrefix, ifUseUTC: true });
      const chunkName1 = idUtils.randomUUID();
      const chunkName2 = s + chunkName1;
      // 保存文件信息至数据库
      const info = await this.mysqlPrisma.create<FileChunkDto>('tbl_file_chunk', {
        fileMd5: dto.fileMd5,
        fileNewName: dto.fileNewName,
        chunkName: chunkName2,
        chunkIndex: dto.chunkIndex,
        ifFinished: final.N,
      });
      // 保存文件
      saveFile(this.env.file.uploadPath, chunkName1, dto.file.buffer, { a: s });
      // 更新文件信息
      await this.mysqlPrisma.updateById<FileChunkDto>('tbl_file_chunk', {
        id: info.id,
        ifFinished: final.Y,
      });
      return R.ok(true);
    } catch (e) {
      this.winston.error(e);
      throw new UnknownException(this.bcs.getUserData().reqId, e as HttpException)
    }
  }

  async fileUploadOneChunkMerge(dto: FileUploadOneChunk_merge): Promise<R> {
    const fileInfos = await this.mysqlPrisma.findAll<FileDto>('tbl_file', {
      data: {
        fileNewName: dto.fileNewName,
        fileMd5: dto.fileMd5,
        deleted: final.N,
      },
    });
    const fileInfo = fileInfos[0];
    const chunks = await this.mysqlPrisma.findAll<FileChunkDto>('tbl_file_chunk', {
      data: {
        fileNewName: fileInfo.fileNewName,
        fileMd5: fileInfo.fileMd5,
      },
      orderBy: {
        chunkIndex: 'asc',
      },
    });
    if (chunks.length !== fileInfo.chunkNum) {
      throw new Exception('合并失败，请重试。');
    }
    const outputFile = path.join(this.env.file.uploadPath, fileInfo.fileNewName);
    const outputFd = fs.openSync(outputFile, 'w');
    // 创建一个 Promise 数组，每个 Promise 处理一个文件块的写入
    const promises = chunks.map((chunk) => {
      const file = path.join(this.env.file.uploadPath, chunk.chunkName);
      const inputFd = fs.openSync(file, 'r');
      const buffer = Buffer.alloc(4096); // 4KB 缓冲区，你可以根据实际情况调整大小
      function write() {
        const bytesRead = fs.readSync(inputFd, buffer, 0, buffer.length, null);
        if (bytesRead > 0) {
          fs.writeSync(outputFd, buffer, 0, bytesRead, null);
          write();
        }
      }

      return new Promise((resolve, reject) => {
        write();
        fs.closeSync(inputFd);
        resolve(true);
      });
    });
    // 使用 Promise.all 等待所有写入操作完成
    Promise.all(promises)
      .then(() => {
        fs.closeSync(outputFd);
      })
      .catch((error) => {
        this.winston.error(error);
      });
    for (let i = 0; i < fileInfos.length; i++) {
      try {
        await this.mysqlPrisma.updateById<FileDto>('tbl_file', {
          id: fileInfos[i].id,
          ifMerge: final.Y,
          ifFinished: final.Y,
        });
      } catch (e) {
        this.winston.error(e);
      }
    }
    return R.ok(true);
  }
}
