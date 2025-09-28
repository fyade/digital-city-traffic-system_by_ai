import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import { mail126Config, serverConfig } from '@dcts/config';

@Injectable()
export class MailService {
  // private transport = nodemailer.createTransport({
  //   host: mail126Config.host,
  //   secure: true,
  //   auth: {
  //     user: mail126Config.user,
  //     pass: mail126Config.authpass,
  //   },
  // });

  // 示例代码
  // async init() {
  //   await this.transport.sendMail({
  //     from: `"console-${serverConfig.currentConfig().mode}" ${mail126Config.user}`,
  //     to: '',
  //     subject: `test subject ${new Date().toISOString()}`,
  //     text: `test text ${new Date().toISOString()}`,
  //   });
  // }
}
