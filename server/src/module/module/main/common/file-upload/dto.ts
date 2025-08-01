import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

interface MulterFile {
  fieldname: string;      // 表单字段名（如 "file"）
  originalname: string;   // 原始文件名（用户上传时的名字）
  encoding: string;       // 文件编码（如 '7bit'）
  mimetype: string;       // MIME 类型（如 'image/jpeg'）
  size: number;           // 文件大小（字节）
  destination: string;    // 存储目录（由 multer 配置决定）
  filename: string;       // 服务器上的文件名（可能被哈希重命名）
  path: string;           // 文件的完整存储路径
  buffer?: Buffer;        // 如果使用内存存储（memoryStorage），会有 buffer
}

export class FileDto extends BaseDto {
  id: string;

  fileName: string;

  fileNewName: string;

  fileSize: number;

  fileMd5: string;

  ifChunk: string;

  chunkNum: number;

  ifMerge: string;

  ifFirst: string;

  ifFinished: string;

  module: string;

  remark: string;
}

export class FileSelListDto extends PageDto {
  @ApiProperty({ description: '原文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '文件大小', required: false })
  fileSize: number;

  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '是否分片', required: false })
  ifChunk: string;

  @ApiProperty({ description: '分片数量', required: false })
  chunkNum: number;

  @ApiProperty({ description: '是否合并', required: false })
  ifMerge: string;

  @ApiProperty({ description: '是否首次上传', required: false })
  ifFirst: string;

  @ApiProperty({ description: '是否上传结束', required: false })
  ifFinished: string;

  @ApiProperty({ description: '业务模块', required: false })
  module: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class FileSelAllDto {
  @ApiProperty({ description: '原文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '文件大小', required: false })
  fileSize: number;

  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '是否分片', required: false })
  ifChunk: string;

  @ApiProperty({ description: '分片数量', required: false })
  chunkNum: number;

  @ApiProperty({ description: '是否合并', required: false })
  ifMerge: string;

  @ApiProperty({ description: '是否首次上传', required: false })
  ifFirst: string;

  @ApiProperty({ description: '是否上传结束', required: false })
  ifFinished: string;

  @ApiProperty({ description: '业务模块', required: false })
  module: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class FileChunkDto extends BaseDto {
  id: string;

  fileMd5: string;

  fileNewName: string;

  chunkName: string;

  chunkIndex: number;

  ifFinished: string;

  remark: string;
}

export class FileChunkSelListDto extends PageDto {
  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '分片名', required: false })
  chunkName: string;

  @ApiProperty({ description: '分片下标', required: false })
  chunkIndex: number;

  @ApiProperty({ description: '是否结束', required: false })
  ifFinished: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class FileChunkSelAllDto {
  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '分片名', required: false })
  chunkName: string;

  @ApiProperty({ description: '分片下标', required: false })
  chunkIndex: number;

  @ApiProperty({ description: '是否结束', required: false })
  ifFinished: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class FileUploadSelListDto2 extends PageDto {
  @ApiProperty({ description: '过滤相同文件', required: false })
  filterSame: string;
}

export class FileUploadOneFull_upload {
  @ApiProperty({ description: '文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '文件', required: false })
  file: MulterFile;
}

export class FileUploadOneChunk_check {
  @ApiProperty({ description: '文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '文件大小', required: false })
  fileSize: number;

  @ApiProperty({ description: '分片数量', required: false })
  chunkNum: number;
}

export class FileUploadOneChunk_upload {
  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '分片下标', required: false })
  chunkIndex: number;

  @ApiProperty({ description: '文件', required: false })
  file: MulterFile;
}

export class FileUploadOneChunk_merge {
  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;
}
