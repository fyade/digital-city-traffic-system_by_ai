export class TokenDto {
  userid: string;
  username: string;
  loginRole: string;
  loginTime: Date;
  loginIp: string;
  loginOs: string;
  loginBrowser: string;
  expireTimeStamp: number;
}

export class WsTokenDto extends TokenDto {
  pageContext: string | null;
}
