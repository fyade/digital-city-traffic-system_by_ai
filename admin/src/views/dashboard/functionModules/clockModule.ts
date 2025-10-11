import * as Cesium from "cesium";
import { CronJob } from "cron";
import { getSysTime } from "@/api/common/sys.ts";

/**
 * 时钟模块
 */
export class ClockModule {
  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private setCurrentTimeCB: ((data: number) => void) | null = null

  public setSetCurrentTimeCB(func: (data: number) => void) {
    this.setCurrentTimeCB = func
  }
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


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

  private jobs: CronJob<null, null>[] = [];
  private __currentTime = 0
  private _currentTime = 0

  get currentTime(): number {
    return this._currentTime;
  }

  private set currentTime(value: number) {
    this._currentTime = value;
    if (this.setCurrentTimeCB) {
      this.setCurrentTimeCB(this.currentTime)
    }
  }

  public destroy() {
    for (const job of this.jobs) {
      job.stop()
    }
    this.jobs = []
  }

  private longIntervalTask() {
    getSysTime().then(res => {
      const date = new Date(res);
      this.__currentTime = date.getTime();
      this.calculateCurrentTime()
      if (!this.viewer) {
        return
      }
      this.viewer.timeline.zoomTo(
          Cesium.JulianDate.fromDate(new Date(this.__currentTime - 1000 * 60 * 60 * .5)),
          Cesium.JulianDate.fromDate(new Date(this.__currentTime + 1000 * 60 * 60 * .5)),
      )
      this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(date)
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

  public refreshServerTime() {
    this.longIntervalTask()
  }
}
