import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { LogOperationWsQueueJobDataDto } from "./dto";
import { PrismaoService } from "../../prisma/prismao.service";

@Processor('log-operation-ws-queue')
@Injectable()
export class LogOperationWsConsumer extends WorkerHost {
  constructor(private readonly prismao: PrismaoService) {
    super();
  }

  async process(job: Job<LogOperationWsQueueJobDataDto>) {
    const data = job.data;
    await this.prismao.getOrigin().log_operation_ws.create({
      data: {
        socket_id: data.socketId,
        call_ip: data.callIp,
        host_name: data.hostName,
        ws_perms: data.wsPerms,
        user_id: data.userId,
        login_role: data.loginRole,
        if_success: data.ifSuccess,
        remark: data.remark,
        create_time: data.createTime
      }
    })
  }
}
