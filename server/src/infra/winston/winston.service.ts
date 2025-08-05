import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { serverConfig } from '@dcts/config';
import { numberUtils, timeUtils } from '@dcts/common';
import { Cron } from "@nestjs/schedule";

const env = serverConfig.currentConfig();

@Injectable()
export class WinstonService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.init()
  }

  private getLogPath() {
    const date = new Date();
    return env.log.logSavePath + `/${date.getFullYear()}/${numberUtils.addZero(date.getMonth() + 1)}`
  }

  private init() {
    const errorTransport = new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: this.getLogPath(),
      filename: '%DATE%.error.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: env.log.maxSizeOfKogFile,
      format: winston.format.combine(
          winston.format.printf((info) => {
            return `${timeUtils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')} [${info.level.padEnd(15)}]: ${info.message}`;
          }),
      ),
    });
    const infoTransport = new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: this.getLogPath(),
      filename: '%DATE%.info.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: env.log.maxSizeOfKogFile,
      format: winston.format.combine(
          winston.format.printf((info) => {
            return `${timeUtils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')} [${info.level.padEnd(15)}]: ${info.message}`;
          }),
      ),
    });
    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      transports: [errorTransport, infoTransport],
      exceptionHandlers: [errorTransport],
      rejectionHandlers: [errorTransport],
      exitOnError: false,
    });
  }

  @Cron('0 0 0 * * *')
  private refreshSaveDir() {
    this.logger.transports.forEach(transport => {
      if (transport instanceof winston.transports.DailyRotateFile) {
        transport.close()
      }
    })
    this.init()
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
}
