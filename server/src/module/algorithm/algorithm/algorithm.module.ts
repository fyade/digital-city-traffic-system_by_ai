import { Module } from '@nestjs/common';
import { AlgorithmController } from './algorithm.controller';
import { AlgorithmService } from './algorithm.service';
import { InterfaceFacadeService } from '../interface/interface.facade.service';
import { InterfaceGroupFacadeService } from '../interface-group/interface-group.facade.service';

@Module({
  controllers: [AlgorithmController],
  providers: [AlgorithmService, InterfaceFacadeService, InterfaceGroupFacadeService],
})
export class AlgorithmModule {
}
