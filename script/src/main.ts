import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { publicConfig, scriptConfig } from "@dcts/config";
import { timeUtils } from "@dcts/common";

const banner = `${publicConfig.APP_NAME}脚本启动成功。`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const node_env = scriptConfig.currentConfig()
  await app.listen(node_env.port);
  console.info(banner);
  console.info(`${timeUtils.time()} ${node_env.mode} ${node_env.port}`);
}

bootstrap();
