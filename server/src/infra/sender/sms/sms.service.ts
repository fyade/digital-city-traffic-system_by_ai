import { Injectable } from '@nestjs/common';
// import { serverConfig, tencentSmsConfig } from '@dcts/config';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { R } from '../../../common/R';

@Injectable()
export class SmsService {
  // private env = serverConfig.currentConfig();
  // private smsClient = new tencentcloud.sms.v20210111.Client({
  //   credential: {
  //     secretId: tencentSmsConfig.secretId,
  //     secretKey: tencentSmsConfig.secretKey,
  //   },
  //   region: 'ap-nanjing',
  // });

  // 示例代码
  // async init() {
  //   await this.smsClient.SendSms(
  //     {
  //       SmsSdkAppId: tencentSmsConfig.SmsSdkAppId,
  //       SignName: tencentSmsConfig.SignName,
  //       TemplateId: tencentSmsConfig.template.yzm.id,
  //       TemplateParamSet: [],
  //       PhoneNumberSet: ['+86'],
  //     },
  //     (err, response) => {},
  //   );
  // }
}
