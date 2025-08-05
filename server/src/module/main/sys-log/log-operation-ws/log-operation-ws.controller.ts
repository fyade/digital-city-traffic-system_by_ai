import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LogOperationWsService } from './log-operation-ws.service';
import { Authorize } from '../../../../decorator/authorize.decorator';
import { R } from '../../../../common/R';
import { LogOperationWsSelListDto, LogOperationWsSelAllDto, LogOperationWsInsOneDto, LogOperationWsUpdOneDto, LogOperationWsInsMoreDto, LogOperationWsUpdMoreDto } from './dto';

@Controller('/main/sys-log/log-operation-ws')
@ApiTags('主系统/系统日志/系统WS操作日志')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class LogOperationWsController {
  constructor(private readonly logOperationWsService: LogOperationWsService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询系统WS操作日志',
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:selList',
    label: '分页查询系统WS操作日志',
  })
  async selLogOperationWs(@Query() dto: LogOperationWsSelListDto): Promise<R> {
    return this.logOperationWsService.selLogOperationWs(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有系统WS操作日志',
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:selAll',
    label: '查询所有系统WS操作日志',
  })
  async selAllLogOperationWs(@Query() dto: LogOperationWsSelAllDto): Promise<R> {
    return this.logOperationWsService.selAllLogOperationWs(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个系统WS操作日志（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:selOnes',
    label: '查询多个系统WS操作日志（根据id）',
  })
  async selOnesLogOperationWs(@Query() ids: number[]): Promise<R> {
    return this.logOperationWsService.selOnesLogOperationWs(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个系统WS操作日志',
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:selOne',
    label: '查询单个系统WS操作日志',
  })
  async selOneLogOperationWs(@Param('id') id: number): Promise<R> {
    return this.logOperationWsService.selOneLogOperationWs(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增系统WS操作日志',
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:ins',
    label: '新增系统WS操作日志',
  })
  async insLogOperationWs(@Body() dto: LogOperationWsInsOneDto): Promise<R> {
    return this.logOperationWsService.insLogOperationWs(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增系统WS操作日志',
  })
  @ApiBody({
    isArray: true,
    type: LogOperationWsInsOneDto,
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:inss',
    label: '批量新增系统WS操作日志',
  })
  async insLogOperationWss(@Body() dto: LogOperationWsInsMoreDto): Promise<R> {
    return this.logOperationWsService.insLogOperationWss(dto.items);
  }

  @Put()
  @ApiOperation({
    summary: '修改系统WS操作日志',
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:upd',
    label: '修改系统WS操作日志',
  })
  async updLogOperationWs(@Body() dto: LogOperationWsUpdOneDto): Promise<R> {
    return this.logOperationWsService.updLogOperationWs(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改系统WS操作日志',
  })
  @ApiBody({
    isArray: true,
    type: LogOperationWsUpdOneDto,
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:upds',
    label: '批量修改系统WS操作日志',
  })
  async updLogOperationWss(@Body() dto: LogOperationWsUpdMoreDto): Promise<R> {
    return this.logOperationWsService.updLogOperationWss(dto.items);
  }

  @Delete()
  @ApiOperation({
    summary: '删除系统WS操作日志',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysLog:logOperationWs:del',
    label: '删除系统WS操作日志',
  })
  async delLogOperationWs(@Body() ids: number[]): Promise<R> {
    return this.logOperationWsService.delLogOperationWs(ids);
  }
}
