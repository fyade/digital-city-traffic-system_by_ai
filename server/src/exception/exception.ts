import { HttpException } from '@nestjs/common';

export class Exception extends HttpException {
  constructor(msg: string, code: number = 400) {
    super(msg, code);
  }
}
