import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { serverConfig } from "@ms/config";
import { timeUtils } from "@ms/common";

declare const module: any;

const banner = '数字孪生城市交通管理系统后端启动成功。';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    req['TIMEZONE'] = 'Asia/Shanghai'; // 设置全局时区
    next();
  });
  const node_env = serverConfig.currentConfig();
  if (node_env.ifShowSwagger) {
    const swaggerOptions = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('数字孪生城市交通管理系统')
      .setDescription('数字孪生城市交通管理系统接口文档')
      .setVersion(serverConfig.currentVersion)
      .build();
    const swaggerDocuemnt = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('/api', app, swaggerDocuemnt);
  }
  await app.listen(node_env.port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  console.info(banner);
  console.info(`${timeUtils.time()} ${node_env.mode} ${node_env.port}`);
}

bootstrap();
