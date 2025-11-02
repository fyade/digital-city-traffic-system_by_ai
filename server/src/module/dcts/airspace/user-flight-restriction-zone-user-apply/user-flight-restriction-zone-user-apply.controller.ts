import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserFlightRestrictionZoneUserApplyService } from './user-flight-restriction-zone-user-apply.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { UserFlightRestrictionZoneUserApplySelListDto, UserFlightRestrictionZoneUserApplySelAllDto, UserFlightRestrictionZoneUserApplyInsOneDto, UserFlightRestrictionZoneUserApplyUpdOneDto, UserFlightRestrictionZoneUserApplyInsMoreDto, UserFlightRestrictionZoneUserApplyUpdMoreDto } from './dto';

@Controller('/dcts/airspace/user-flight-restriction-zone-user-apply')
@ApiTags('数智交通全域调度系统/空域管理/[用户]用户申请空域')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class UserFlightRestrictionZoneUserApplyController {
  constructor(private readonly userFlightRestrictionZoneUserApplyService: UserFlightRestrictionZoneUserApplyService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询[用户]用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:selList',
    label: '分页查询[用户]用户申请空域',
  })
  async selUserFlightRestrictionZoneUserApply(@Query() dto: UserFlightRestrictionZoneUserApplySelListDto): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.selUserFlightRestrictionZoneUserApply(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有[用户]用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:selAll',
    label: '查询所有[用户]用户申请空域',
  })
  async selAllUserFlightRestrictionZoneUserApply(@Query() dto: UserFlightRestrictionZoneUserApplySelAllDto): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.selAllUserFlightRestrictionZoneUserApply(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个[用户]用户申请空域（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:selOnes',
    label: '查询多个[用户]用户申请空域（根据id）',
  })
  async selOnesUserFlightRestrictionZoneUserApply(@Query() ids: Record<string, string>): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.selOnesUserFlightRestrictionZoneUserApply(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个[用户]用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:selOne',
    label: '查询单个[用户]用户申请空域',
  })
  async selOneUserFlightRestrictionZoneUserApply(@Param('id') id: number): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.selOneUserFlightRestrictionZoneUserApply(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增[用户]用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:ins',
    label: '新增[用户]用户申请空域',
  })
  async insUserFlightRestrictionZoneUserApply(@Body() dto: UserFlightRestrictionZoneUserApplyInsOneDto): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.insUserFlightRestrictionZoneUserApply(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增[用户]用户申请空域',
  })
  @ApiBody({
    isArray: true,
    type: UserFlightRestrictionZoneUserApplyInsOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:inss',
    label: '批量新增[用户]用户申请空域',
  })
  async insUserFlightRestrictionZoneUserApplys(@Body() dto: UserFlightRestrictionZoneUserApplyInsMoreDto): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.insUserFlightRestrictionZoneUserApplys(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改[用户]用户申请空域',
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:upd',
    label: '修改[用户]用户申请空域',
  })
  async updUserFlightRestrictionZoneUserApply(@Body() dto: UserFlightRestrictionZoneUserApplyUpdOneDto): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.updUserFlightRestrictionZoneUserApply(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改[用户]用户申请空域',
  })
  @ApiBody({
    isArray: true,
    type: UserFlightRestrictionZoneUserApplyUpdOneDto,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:upds',
    label: '批量修改[用户]用户申请空域',
  })
  async updUserFlightRestrictionZoneUserApplys(@Body() dto: UserFlightRestrictionZoneUserApplyUpdMoreDto): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.updUserFlightRestrictionZoneUserApplys(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除[用户]用户申请空域',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'dcts:airspace:userFlightRestrictionZoneUserApply:del',
    label: '删除[用户]用户申请空域',
  })
  async delUserFlightRestrictionZoneUserApply(@Body() ids: number[]): Promise<R> {
    return this.userFlightRestrictionZoneUserApplyService.delUserFlightRestrictionZoneUserApply(ids);
  }
}
