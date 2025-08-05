import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { LogOperationQueueJobDataDto, LogOperationWsQueueJobDataDto, LogScheduledTaskQueueJobDataDto } from "./dto";

@Injectable()
export class QueueoService {
  constructor(
      @InjectQueue('log-operation-queue') private readonly logOperationQueue: Queue,
      @InjectQueue('log-operation-ws-queue') private readonly logOperationWsQueue: Queue,
      @InjectQueue('log-scheduled-task-queue') private readonly logScheduledTaskQueue: Queue,
  ) {
  }

  getLogOperationQueue(): Queue<LogOperationQueueJobDataDto> {
    return this.logOperationQueue
  }

  async addLogOperationQueue(name: string, data: LogOperationQueueJobDataDto) {
    await this.logOperationQueue.add(name, data)
  }

  getLogOperationWsQueue(): Queue<LogOperationWsQueueJobDataDto> {
    return this.logOperationWsQueue
  }

  async addLogOperationWsQueue(name: string, data: LogOperationWsQueueJobDataDto) {
    await this.logOperationWsQueue.add(name, data)
  }

  getLogScheduledTaskQueue(): Queue<LogScheduledTaskQueueJobDataDto> {
    return this.logScheduledTaskQueue
  }

  async addLogScheduledTaskQueue(name: string, data: LogScheduledTaskQueueJobDataDto) {
    await this.logScheduledTaskQueue.add(name, data)
  }
}
