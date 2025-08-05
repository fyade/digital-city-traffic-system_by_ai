import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import { AddRouteInformationDto } from "./dto";

@Injectable()
export class ExternalService {
  async addRouteInformation(dto: AddRouteInformationDto): Promise<R> {
    console.log('dto', dto)
    return R.ok('hello world')
  }
}
