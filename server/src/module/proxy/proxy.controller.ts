import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { Authorize } from '../../decorator/authorize.decorator';
import { R } from '../../common/R';

@Controller('/sys/proxy')
@ApiTags('系统/代理')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class ProxyController {
  constructor(
    private readonly proxyService: ProxyService
  ) {
  }
}
