import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('/dcts/dcts-test')
@ApiTags('dcts/测试')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({transform: true}))
export class DctsTestController {
}
