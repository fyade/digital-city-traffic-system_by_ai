import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { publicConfig } from "@dcts/config";
import { R } from "../../../common/R";
import { ExternalService } from "./external.service";
import { Authorize } from "../../../decorator/authorize.decorator";
import { AddRouteInformationDto } from "./dto";

@Controller('/dcts/external')
@ApiTags(`${publicConfig.APP_NAME}/外部api`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({transform: true}))
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {
  }

  @Post('/add-route-information')
  @ApiOperation({
    summary: '添加路线信息'
  })
  @Authorize({
    permission: 'dcts:external:addRouteInformation',
    label: '添加路线信息'
  })
  async addRouteInformation(@Body() dto: AddRouteInformationDto): Promise<R> {
    return this.externalService.addRouteInformation(dto)
  }
}
