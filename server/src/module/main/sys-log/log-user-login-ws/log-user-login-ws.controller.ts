import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LogUserLoginWsService } from './log-user-login-ws.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { LogUserLoginWsSelListDto, LogUserLoginWsSelAllDto, LogUserLoginWsInsOneDto, LogUserLoginWsUpdOneDto, LogUserLoginWsInsMoreDto, LogUserLoginWsUpdMoreDto } from './dto';

@Controller('/main/sys-log/log-user-login-ws')
@ApiTags('主系统/系统日志/WS登录日志')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class LogUserLoginWsController {
  constructor(private readonly logUserLoginWsService: LogUserLoginWsService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询WS登录日志',
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:selList',
    label: '分页查询WS登录日志',
  })
  async selLogUserLoginWs(@Query() dto: LogUserLoginWsSelListDto): Promise<R> {
    return this.logUserLoginWsService.selLogUserLoginWs(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有WS登录日志',
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:selAll',
    label: '查询所有WS登录日志',
  })
  async selAllLogUserLoginWs(@Query() dto: LogUserLoginWsSelAllDto): Promise<R> {
    return this.logUserLoginWsService.selAllLogUserLoginWs(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个WS登录日志（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:selOnes',
    label: '查询多个WS登录日志（根据id）',
  })
  async selOnesLogUserLoginWs(@Query() ids: Record<string, string>): Promise<R> {
    return this.logUserLoginWsService.selOnesLogUserLoginWs(Object.values(ids).map(Number));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个WS登录日志',
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:selOne',
    label: '查询单个WS登录日志',
  })
  async selOneLogUserLoginWs(@Param('id') id: number): Promise<R> {
    return this.logUserLoginWsService.selOneLogUserLoginWs(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增WS登录日志',
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:ins',
    label: '新增WS登录日志',
  })
  async insLogUserLoginWs(@Body() dto: LogUserLoginWsInsOneDto): Promise<R> {
    return this.logUserLoginWsService.insLogUserLoginWs(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增WS登录日志',
  })
  @ApiBody({
    isArray: true,
    type: LogUserLoginWsInsOneDto,
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:inss',
    label: '批量新增WS登录日志',
  })
  async insLogUserLoginWss(@Body() dto: LogUserLoginWsInsMoreDto): Promise<R> {
    return this.logUserLoginWsService.insLogUserLoginWss(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改WS登录日志',
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:upd',
    label: '修改WS登录日志',
  })
  async updLogUserLoginWs(@Body() dto: LogUserLoginWsUpdOneDto): Promise<R> {
    return this.logUserLoginWsService.updLogUserLoginWs(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改WS登录日志',
  })
  @ApiBody({
    isArray: true,
    type: LogUserLoginWsUpdOneDto,
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:upds',
    label: '批量修改WS登录日志',
  })
  async updLogUserLoginWss(@Body() dto: LogUserLoginWsUpdMoreDto): Promise<R> {
    return this.logUserLoginWsService.updLogUserLoginWss(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除WS登录日志',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysLog:logUserLoginWs:del',
    label: '删除WS登录日志',
  })
  async delLogUserLoginWs(@Body() ids: number[]): Promise<R> {
    return this.logUserLoginWsService.delLogUserLoginWs(ids);
  }
}
