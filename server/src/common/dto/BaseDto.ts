import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty({description: 'createRole', required: false})
  createRole: string;

  @ApiProperty({description: 'updateRole', required: false})
  updateRole: string;

  @ApiProperty({description: 'createBy', required: false})
  createBy: string;

  @ApiProperty({description: 'updateBy', required: false})
  updateBy: string;

  @ApiProperty({description: 'createTime', required: false})
  createTime: string;

  @ApiProperty({description: 'updateTime', required: false})
  updateTime: string;

  @ApiProperty({description: 'deleted', required: false})
  deleted: string;

  constructor() {
    this.createRole = null;
    this.updateRole = null;
    this.createBy = null;
    this.updateBy = null;
    this.createTime = null;
    this.updateTime = null;
    this.deleted = null;
  }
}

export class BaseDto2 {
  @ApiProperty({description: 'createTime', required: false})
  createTime: string;

  constructor() {
    this.createTime = null;
  }
}

export class BaseDto3 {
  @ApiProperty({description: 'createRole', required: false})
  createRole: string;

  @ApiProperty({description: 'createBy', required: false})
  createBy: string;

  @ApiProperty({description: 'createTime', required: false})
  createTime: string;

  @ApiProperty({description: 'deleted', required: false})
  deleted: string;

  constructor() {
    this.createRole = null;
    this.createBy = null;
    this.createTime = null;
    this.deleted = null;
  }
}
