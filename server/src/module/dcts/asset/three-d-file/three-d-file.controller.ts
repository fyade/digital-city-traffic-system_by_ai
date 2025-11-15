import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ThreeDFileService } from './three-d-file.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { ThreeDFileSelListDto, ThreeDFileSelAllDto, ThreeDFileInsOneDto, ThreeDFileUpdOneDto, ThreeDFileInsMoreDto, ThreeDFileUpdMoreDto } from './dto';

@Controller('/dcts/asset/three-d-file')
@ApiTags('数智交通全域调度系统/资产管理/三维文件')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class ThreeDFileController {
  constructor(private readonly threeDFileService: ThreeDFileService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询三维文件',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:selList',
    label: '分页查询三维文件',
  })
  async selThreeDFile(@Query() dto: ThreeDFileSelListDto): Promise<R> {
    return this.threeDFileService.selThreeDFile(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有三维文件',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:selAll',
    label: '查询所有三维文件',
  })
  async selAllThreeDFile(@Query() dto: ThreeDFileSelAllDto): Promise<R> {
    return this.threeDFileService.selAllThreeDFile(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个三维文件（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:selOnes',
    label: '查询多个三维文件（根据id）',
  })
  async selOnesThreeDFile(@Query() ids: Record<string, string>): Promise<R> {
    return this.threeDFileService.selOnesThreeDFile(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个三维文件',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:selOne',
    label: '查询单个三维文件',
  })
  async selOneThreeDFile(@Param('id') id: string): Promise<R> {
    return this.threeDFileService.selOneThreeDFile(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增三维文件',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:ins',
    label: '新增三维文件',
  })
  async insThreeDFile(@Body() dto: ThreeDFileInsOneDto): Promise<R> {
    return this.threeDFileService.insThreeDFile(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增三维文件',
  })
  @ApiBody({
    isArray: true,
    type: ThreeDFileInsOneDto,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:inss',
    label: '批量新增三维文件',
  })
  async insThreeDFiles(@Body() dto: ThreeDFileInsMoreDto): Promise<R> {
    return this.threeDFileService.insThreeDFiles(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改三维文件',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:upd',
    label: '修改三维文件',
  })
  async updThreeDFile(@Body() dto: ThreeDFileUpdOneDto): Promise<R> {
    return this.threeDFileService.updThreeDFile(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改三维文件',
  })
  @ApiBody({
    isArray: true,
    type: ThreeDFileUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:upds',
    label: '批量修改三维文件',
  })
  async updThreeDFiles(@Body() dto: ThreeDFileUpdMoreDto): Promise<R> {
    return this.threeDFileService.updThreeDFiles(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除三维文件',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFile:del',
    label: '删除三维文件',
  })
  async delThreeDFile(@Body() ids: number[]): Promise<R> {
    return this.threeDFileService.delThreeDFile(ids);
  }
}
