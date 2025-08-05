import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JunctionPositionService } from './junction-position.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { JunctionPositionSelListDto, JunctionPositionSelAllDto, JunctionPositionInsOneDto, JunctionPositionUpdOneDto, JunctionPositionInsMoreDto, JunctionPositionUpdMoreDto } from './dto';
import { publicConfig } from "@dcts/config";

@Controller('/dcts/junction/junction-position')
@ApiTags(`${publicConfig.APP_NAME}/路口管理/路口位置`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class JunctionPositionController {
  constructor(private readonly junctionPositionService: JunctionPositionService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询路口位置',
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:selList',
    label: '分页查询路口位置',
  })
  async selJunctionPosition(@Query() dto: JunctionPositionSelListDto): Promise<R> {
    return this.junctionPositionService.selJunctionPosition(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有路口位置',
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:selAll',
    label: '查询所有路口位置',
  })
  async selAllJunctionPosition(@Query() dto: JunctionPositionSelAllDto): Promise<R> {
    return this.junctionPositionService.selAllJunctionPosition(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个路口位置（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:selOnes',
    label: '查询多个路口位置（根据id）',
  })
  async selOnesJunctionPosition(@Query() ids: number[]): Promise<R> {
    return this.junctionPositionService.selOnesJunctionPosition(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个路口位置',
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:selOne',
    label: '查询单个路口位置',
  })
  async selOneJunctionPosition(@Param('id') id: number): Promise<R> {
    return this.junctionPositionService.selOneJunctionPosition(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增路口位置',
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:ins',
    label: '新增路口位置',
  })
  async insJunctionPosition(@Body() dto: JunctionPositionInsOneDto): Promise<R> {
    return this.junctionPositionService.insJunctionPosition(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增路口位置',
  })
  @ApiBody({
    isArray: true,
    type: JunctionPositionInsOneDto,
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:inss',
    label: '批量新增路口位置',
  })
  async insJunctionPositions(@Body() dto: JunctionPositionInsMoreDto): Promise<R> {
    return this.junctionPositionService.insJunctionPositions(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改路口位置',
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:upd',
    label: '修改路口位置',
  })
  async updJunctionPosition(@Body() dto: JunctionPositionUpdOneDto): Promise<R> {
    return this.junctionPositionService.updJunctionPosition(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改路口位置',
  })
  @ApiBody({
    isArray: true,
    type: JunctionPositionUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:upds',
    label: '批量修改路口位置',
  })
  async updJunctionPositions(@Body() dto: JunctionPositionUpdMoreDto): Promise<R> {
    return this.junctionPositionService.updJunctionPositions(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除路口位置',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:junction:junctionPosition:del',
    label: '删除路口位置',
  })
  async delJunctionPosition(@Body() ids: number[]): Promise<R> {
    return this.junctionPositionService.delJunctionPosition(ids);
  }
}
