import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SpatialDataService } from "./spatial-data.service";
import { Authorize } from "../../../../decorator/authorize.decorator";
import { R } from "../../../../common/R";
import { AaaaaaaaDto } from "./dto";

@Controller('/dcts/spatial-data')
@ApiTags('数字孪生城市交通管理系统/空间数据')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({transform: true}))
export class SpatialDataController {
  constructor(private readonly spatialDataService: SpatialDataService) {
  }

  @Get('/aaaaaaaaaaaaaa')
  @ApiOperation({
    summary: 'aaaaaaaaaaaaa',
  })
  @Authorize({
    permission: 'dcts:spatialData:aaaaaaaaaaaaaaaaaaa',
    label: 'aaaaaaaaaaaaaaaa',
  })
  async aaaaaaaaaaaaa(@Query() dto: AaaaaaaaDto): Promise<R> {
    return R.ok(null)
  }
}
