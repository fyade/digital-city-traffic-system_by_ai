import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserFlightRouteUserApplyService } from './user-flight-route-user-apply.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { UserFlightRouteUserApplySelListDto, UserFlightRouteUserApplySelAllDto, UserFlightRouteUserApplyInsOneDto, UserFlightRouteUserApplyUpdOneDto, UserFlightRouteUserApplyInsMoreDto, UserFlightRouteUserApplyUpdMoreDto } from './dto';

@Controller('/dcts/airspace/user-flight-route-user-apply')
@ApiTags('数智交通全域调度系统/空域管理/[用户]用户申请航线')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class UserFlightRouteUserApplyController {
  constructor(private readonly userFlightRouteUserApplyService: UserFlightRouteUserApplyService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询[用户]用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:selList',
    label: '分页查询[用户]用户申请航线',
  })
  async selUserFlightRouteUserApply(@Query() dto: UserFlightRouteUserApplySelListDto): Promise<R> {
    return this.userFlightRouteUserApplyService.selUserFlightRouteUserApply(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有[用户]用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:selAll',
    label: '查询所有[用户]用户申请航线',
  })
  async selAllUserFlightRouteUserApply(@Query() dto: UserFlightRouteUserApplySelAllDto): Promise<R> {
    return this.userFlightRouteUserApplyService.selAllUserFlightRouteUserApply(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个[用户]用户申请航线（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:selOnes',
    label: '查询多个[用户]用户申请航线（根据id）',
  })
  async selOnesUserFlightRouteUserApply(@Query() ids: Record<string, string>): Promise<R> {
    return this.userFlightRouteUserApplyService.selOnesUserFlightRouteUserApply(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个[用户]用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:selOne',
    label: '查询单个[用户]用户申请航线',
  })
  async selOneUserFlightRouteUserApply(@Param('id') id: number): Promise<R> {
    return this.userFlightRouteUserApplyService.selOneUserFlightRouteUserApply(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增[用户]用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:ins',
    label: '新增[用户]用户申请航线',
  })
  async insUserFlightRouteUserApply(@Body() dto: UserFlightRouteUserApplyInsOneDto): Promise<R> {
    return this.userFlightRouteUserApplyService.insUserFlightRouteUserApply(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增[用户]用户申请航线',
  })
  @ApiBody({
    isArray: true,
    type: UserFlightRouteUserApplyInsOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:inss',
    label: '批量新增[用户]用户申请航线',
  })
  async insUserFlightRouteUserApplys(@Body() dto: UserFlightRouteUserApplyInsMoreDto): Promise<R> {
    return this.userFlightRouteUserApplyService.insUserFlightRouteUserApplys(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改[用户]用户申请航线',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:upd',
    label: '修改[用户]用户申请航线',
  })
  async updUserFlightRouteUserApply(@Body() dto: UserFlightRouteUserApplyUpdOneDto): Promise<R> {
    return this.userFlightRouteUserApplyService.updUserFlightRouteUserApply(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改[用户]用户申请航线',
  })
  @ApiBody({
    isArray: true,
    type: UserFlightRouteUserApplyUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:upds',
    label: '批量修改[用户]用户申请航线',
  })
  async updUserFlightRouteUserApplys(@Body() dto: UserFlightRouteUserApplyUpdMoreDto): Promise<R> {
    return this.userFlightRouteUserApplyService.updUserFlightRouteUserApplys(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除[用户]用户申请航线',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRouteUserApply:del',
    label: '删除[用户]用户申请航线',
  })
  async delUserFlightRouteUserApply(@Body() ids: number[]): Promise<R> {
    return this.userFlightRouteUserApplyService.delUserFlightRouteUserApply(ids);
  }
}
