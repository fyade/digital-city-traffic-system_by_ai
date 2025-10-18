import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ThreeDFileUnitService } from './three-d-file-unit.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { ThreeDFileUnitSelListDto, ThreeDFileUnitSelAllDto, ThreeDFileUnitInsOneDto, ThreeDFileUnitUpdOneDto, ThreeDFileUnitInsMoreDto, ThreeDFileUnitUpdMoreDto } from './dto';

@Controller('/dcts/asset/three-d-file-unit')
@ApiTags('数智交通全域调度系统/资产管理/三维文件单元')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class ThreeDFileUnitController {
  constructor(private readonly threeDFileUnitService: ThreeDFileUnitService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询三维文件单元',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:selList',
    label: '分页查询三维文件单元',
  })
  async selThreeDFileUnit(@Query() dto: ThreeDFileUnitSelListDto): Promise<R> {
    return this.threeDFileUnitService.selThreeDFileUnit(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有三维文件单元',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:selAll',
    label: '查询所有三维文件单元',
  })
  async selAllThreeDFileUnit(@Query() dto: ThreeDFileUnitSelAllDto): Promise<R> {
    return this.threeDFileUnitService.selAllThreeDFileUnit(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个三维文件单元（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:selOnes',
    label: '查询多个三维文件单元（根据id）',
  })
  async selOnesThreeDFileUnit(@Query() ids: Record<string, string>): Promise<R> {
    return this.threeDFileUnitService.selOnesThreeDFileUnit(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个三维文件单元',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:selOne',
    label: '查询单个三维文件单元',
  })
  async selOneThreeDFileUnit(@Param('id') id: number): Promise<R> {
    return this.threeDFileUnitService.selOneThreeDFileUnit(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增三维文件单元',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:ins',
    label: '新增三维文件单元',
  })
  async insThreeDFileUnit(@Body() dto: ThreeDFileUnitInsOneDto): Promise<R> {
    return this.threeDFileUnitService.insThreeDFileUnit(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增三维文件单元',
  })
  @ApiBody({
    isArray: true,
    type: ThreeDFileUnitInsOneDto,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:inss',
    label: '批量新增三维文件单元',
  })
  async insThreeDFileUnits(@Body() dto: ThreeDFileUnitInsMoreDto): Promise<R> {
    return this.threeDFileUnitService.insThreeDFileUnits(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改三维文件单元',
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:upd',
    label: '修改三维文件单元',
  })
  async updThreeDFileUnit(@Body() dto: ThreeDFileUnitUpdOneDto): Promise<R> {
    return this.threeDFileUnitService.updThreeDFileUnit(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改三维文件单元',
  })
  @ApiBody({
    isArray: true,
    type: ThreeDFileUnitUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:upds',
    label: '批量修改三维文件单元',
  })
  async updThreeDFileUnits(@Body() dto: ThreeDFileUnitUpdMoreDto): Promise<R> {
    return this.threeDFileUnitService.updThreeDFileUnits(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除三维文件单元',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:asset:threeDFileUnit:del',
    label: '删除三维文件单元',
  })
  async delThreeDFileUnit(@Body() ids: number[]): Promise<R> {
    return this.threeDFileUnitService.delThreeDFileUnit(ids);
  }
}
