import { PageDto } from "../../../../common/dto/PageDto";
import { ApiProperty } from "@nestjs/swagger";

export class WsOnlineUserSelListDto extends PageDto {
  @ApiProperty({ description: '用户id', required: false })
  userid: string;

  @ApiProperty({ description: '用户名', required: false })
  username: string;

  @ApiProperty({ description: '登录身份', required: false })
  loginRole: string;

  @ApiProperty({ description: '页面上下文', required: false })
  pageContext: string;
}
