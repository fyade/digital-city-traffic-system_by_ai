import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ThreeDFileGroupService } from './three-d-file-group.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { ThreeDFileGroupSelListDto, ThreeDFileGroupSelAllDto, ThreeDFileGroupInsOneDto, ThreeDFileGroupUpdOneDto, ThreeDFileGroupInsMoreDto, ThreeDFileGroupUpdMoreDto } from './dto';

@Controller('/dcts/asset/three-d-file-group')
@ApiTags('数智交通全域调度系统/资产管理/三维文件组')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class ThreeDFileGroupController {
  constructor(private readonly threeDFileGroupService: ThreeDFileGroupService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询三维文件组',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:selList',
    label: '分页查询三维文件组',
  })
  async selThreeDFileGroup(@Query() dto: ThreeDFileGroupSelListDto): Promise<R> {
    return this.threeDFileGroupService.selThreeDFileGroup(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有三维文件组',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:selAll',
    label: '查询所有三维文件组',
  })
  async selAllThreeDFileGroup(@Query() dto: ThreeDFileGroupSelAllDto): Promise<R> {
    return this.threeDFileGroupService.selAllThreeDFileGroup(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个三维文件组（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:selOnes',
    label: '查询多个三维文件组（根据id）',
  })
  async selOnesThreeDFileGroup(@Query() ids: Record<string, string>): Promise<R> {
    return this.threeDFileGroupService.selOnesThreeDFileGroup(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个三维文件组',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:selOne',
    label: '查询单个三维文件组',
  })
  async selOneThreeDFileGroup(@Param('id') id: string): Promise<R> {
    return this.threeDFileGroupService.selOneThreeDFileGroup(Number(id));
  }

  @Post()
  @ApiOperation({
    summary: '新增三维文件组',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:ins',
    label: '新增三维文件组',
  })
  async insThreeDFileGroup(@Body() dto: ThreeDFileGroupInsOneDto): Promise<R> {
    return this.threeDFileGroupService.insThreeDFileGroup(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增三维文件组',
  })
  @ApiBody({
    isArray: true,
    type: ThreeDFileGroupInsOneDto,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:inss',
    label: '批量新增三维文件组',
  })
  async insThreeDFileGroups(@Body() dto: ThreeDFileGroupInsMoreDto): Promise<R> {
    return this.threeDFileGroupService.insThreeDFileGroups(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改三维文件组',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:upd',
    label: '修改三维文件组',
  })
  async updThreeDFileGroup(@Body() dto: ThreeDFileGroupUpdOneDto): Promise<R> {
    return this.threeDFileGroupService.updThreeDFileGroup(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改三维文件组',
  })
  @ApiBody({
    isArray: true,
    type: ThreeDFileGroupUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:upds',
    label: '批量修改三维文件组',
  })
  async updThreeDFileGroups(@Body() dto: ThreeDFileGroupUpdMoreDto): Promise<R> {
    return this.threeDFileGroupService.updThreeDFileGroups(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除三维文件组',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileGroup:del',
    label: '删除三维文件组',
  })
  async delThreeDFileGroup(@Body() ids: number[]): Promise<R> {
    return this.threeDFileGroupService.delThreeDFileGroup(ids);
  }
}
