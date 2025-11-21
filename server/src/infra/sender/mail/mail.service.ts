import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mail126Config, publicConfig, serverConfig } from '@dcts/config';

@Injectable()
export class MailService {
  private transport = nodemailer.createTransport({
    host: mail126Config.host,
    secure: true,
    auth: {
      user: mail126Config.user,
      pass: mail126Config.authpass,
    },
  });

  // 示例代码
  // async init() {
  //   await this.transport.sendMail({
  //     from: `"dcts-${serverConfig.currentConfig().mode}" ${mail126Config.user}`,
  //     to: '',
  //     subject: `test subject ${new Date().toISOString()}`,
  //     text: `test text ${new Date().toISOString()}`,
  //   });
  // }

  private async sendmail(to: string, subject: string, text: string) {
    await this.transport.sendMail({
      from: `"dcts-${serverConfig.currentConfig().mode}" ${mail126Config.user}`,
      to: to,
      subject: subject,
      text: text,
    });
  }

  async sendCode(to: string, code: string, time: number) {
    await this.sendmail(
        to,
        `来自${publicConfig.APP_NAME}的验证码`,
        `您好，欢迎使用${publicConfig.APP_NAME}，您的验证码是${code}，验证码${time / 60}分钟内有效。`
    )
  }
}
