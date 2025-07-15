import { CronJob } from "cron";
import { getSysTime } from "@/api/common/sys.ts";

/**
 * 时钟模块
 */
export class ClockModule {
  private setCurrentTimeCB: (() => void) | null = null

  public setSetCurrentTimeCB(func: () => void) {
    this.setCurrentTimeCB = func
  }


  private jobs: CronJob<null, null>[] = [];
  private __currentTime = 0
  private _currentTime = 0

  get currentTime(): number {
    return this._currentTime;
  }

  private set currentTime(value: number) {
    this._currentTime = value;
    if (this.setCurrentTimeCB) {
      this.setCurrentTimeCB()
    }
  }

  public init() {
    // 长间隔任务
    const job = new CronJob(
        '0 */10 * * * *',
        this.longIntervalTask.bind(this),
        null,
        true
    );
    // 短间隔任务
    const job1 = new CronJob(
        '*/1 * * * * *',
        this.shortIntervalTask.bind(this),
        null,
        true
    );
    this.jobs.push(job, job1)
    this.longIntervalTask()
  }

  public destroy() {
    for (const job of this.jobs) {
      job.stop()
    }
    this.jobs = []
  }

  private longIntervalTask() {
    getSysTime().then(res => {
      this.__currentTime = new Date(res).getTime();
      this.calculateCurrentTime()
    })
  }

  private shortIntervalTask() {
    this._shortIntervalTask()
    const timeout = setTimeout(() => {
      this._shortIntervalTask()
      clearTimeout(timeout)
    }, 500);
  }

  private _shortIntervalTask() {
    if (this.__currentTime === 0) {
      return
    }
    this.__currentTime += 500
    this.calculateCurrentTime()
  }

  private calculateCurrentTime() {
    const a = 500 - this.__currentTime % 500;
    const timeout = setTimeout(() => {
      this.currentTime = this.__currentTime + a
      clearTimeout(timeout)
    }, a);
  }

  /**
   * 获取当前服务器时间
   */
  public getServerTime() {
  }
}
