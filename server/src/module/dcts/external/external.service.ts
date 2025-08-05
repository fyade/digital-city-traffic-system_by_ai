import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import { HelloDto } from "./dto";

@Injectable()
export class ExternalService {
  async hello(dto: HelloDto): Promise<R> {
    return R.ok('hello world')
  }
}
