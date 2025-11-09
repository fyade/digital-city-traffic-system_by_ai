import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { LogOperationWsQueueJobDataDto } from "./dto";
import { MysqlPrismaoService } from "../prisma/mysql.prismao.service";

@Processor('log-operation-ws-queue')
@Injectable()
export class LogOperationWsConsumer extends WorkerHost {
  constructor(private readonly mysqlPrismao: MysqlPrismaoService) {
    super();
  }

  async process(job: Job<LogOperationWsQueueJobDataDto>) {
    const data = job.data;
    await this.mysqlPrismao.log_operation_ws.create({
      data: {
        socket_id: data.socketId,
        call_ip: data.callIp,
        host_name: data.hostName,
        ws_perms: data.wsPerms,
        user_id: data.userId,
        login_role: data.loginRole,
        req_param: data.reqParam,
        from: data.from,
        if_success: data.ifSuccess,
        remark: data.remark,
        create_time: data.createTime
      }
    })
  }
}
