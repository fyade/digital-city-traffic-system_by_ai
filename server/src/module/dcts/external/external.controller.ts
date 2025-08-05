import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { publicConfig } from "@dcts/config";
import { R } from "../../../common/R";
import { ExternalService } from "./external.service";
import { Authorize } from "../../../decorator/authorize.decorator";
import { HelloDto } from "./dto";

@Controller('/dcts/external')
@ApiTags(`${publicConfig.APP_NAME}/外部api`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({transform: true}))
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {
  }

  @Post('/hello')
  @ApiOperation({
    summary: 'hello'
  })
  @Authorize({
    permission: 'dcts:external:hello',
    label: 'hello'
  })
  async hello(@Body() dto: HelloDto): Promise<R> {
    return this.externalService.hello(dto)
  }
}
