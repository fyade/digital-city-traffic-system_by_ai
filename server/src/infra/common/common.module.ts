import { Global, Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { DiscoveryService } from "@nestjs/core";

@Global()
@Module({
  providers: [CommonService, DiscoveryService],
  exports: [CommonService],
})
export class CommonModule {
}
