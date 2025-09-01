import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { publicConfig, serverConfig } from "@dcts/config";
import { timeUtils } from "@dcts/common";

declare const module: any;

const banner = `${publicConfig.APP_NAME}后端启动成功。`;

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
      .setTitle(publicConfig.APP_NAME)
      .setDescription(`${publicConfig.APP_NAME}接口文档`)
      .setVersion(serverConfig.currentVersion)
      .build();
    const swaggerDocuemnt = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('/doc-swagger', app, swaggerDocuemnt);
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
