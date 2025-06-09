import { Module } from "@nestjs/common";
import { DctsTestModule } from './dcts-test/dcts-test.module';

@Module({
  imports: [DctsTestModule]
})
export class DctsModule {
}
