import * as Cesium from "cesium";
import { CronJob } from "cron";
import { CalculateLightsInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import { ClockModule } from "@/views/dashboard/functionModules/clockModule.ts";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";

const LONG_TASK_INTERVAL = 10; // 长任务执行间隔（分钟）

/**
 * 信号灯模块
 */
export class SignalLightModule {
  private cModule: ClockModule | null = null

  public setCModule(cModule: ClockModule) {
    this.cModule = cModule;
  }

  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: VersionDataModule) {
    this.vdModule = vdModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }


  private jobs: CronJob<null, null>[] = [];

  public init() {
    // 长间隔任务
    const job = new CronJob(
        `0 */${LONG_TASK_INTERVAL} * * * *`,
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

  private datas: CalculateLightsInPolygonVo[] = []
  private shortTaskDatas: CalculateLightsInPolygonVo[] = []
  private ifRunLongTask = false

  public addTask(calculateLightResult: CalculateLightsInPolygonVo[]) {
    this.datas = calculateLightResult
    this.longIntervalTask()
    if (!this.vdModule) {
      return
    }
    if (!this.meModule) {
      return;
    }
    if (!this.viewer) {
      return;
    }
    const slcIds = calculateLightResult.map(item => item.signalLightChildId);
    this.vdModule.setHistoryRunningSignalLightIds(slcIds)
    const last0 = this.vdModule.getHistoryRunningSignalLightIds(0)
    const last1 = this.vdModule.getHistoryRunningSignalLightIds(-1)
    if (!last0 || !last1) {
      return;
    }
    const filter = last1.data.filter(id => !last0.data.includes(id));
    for (const id of filter) {
      this.meModule.setSignalLightToPic(id)
    }
  }

  // 需要刷新的组id
  private needRefreshGroupIds: number[] = []

  /**
   * 长间隔任务
   * @private
   */
  private longIntervalTask() {
    if (this.ifRunLongTask) {
      return
    }
    if (!this.cModule) {
      return;
    }
    if (this.cModule.currentTime === 0) {
      const timeout = setTimeout(() => {
        this.longIntervalTask()
        clearTimeout(timeout)
      }, 100);
      return;
    }
    this.ifRunLongTask = true
    const currentTime = this.cModule.currentTime;
    this.shortTaskDatas = []
    for (const _data of this.datas) {
      const data = deepClone<typeof _data>(_data);
      data.runParam = data.runParam.filter(rp => {
        return (rp.start <= currentTime && rp.end >= currentTime)
            || (rp.start <= currentTime + 1000 * 60 * LONG_TASK_INTERVAL * 2 && rp.end >= currentTime + 1000 * 60 * LONG_TASK_INTERVAL * 2)
            || (currentTime <= rp.start && rp.end <= currentTime + 1000 * 60 * LONG_TASK_INTERVAL * 2)
            || (rp.start <= currentTime && currentTime + 1000 * 60 * LONG_TASK_INTERVAL * 2 <= rp.end)
      })
      this.shortTaskDatas.push(data)
    }
    this.ifRunLongTask = false
  }

  /**
   * 短间隔任务
   * @private
   */
  private shortIntervalTask() {
    this._shortIntervalTask(false)
    const timeout = setTimeout(() => {
      this._shortIntervalTask(true)
      clearTimeout(timeout)
    }, 500);
  }

  private _shortIntervalTask(ifHalfSecond: boolean) {
    if (!this.cModule) {
      return
    }
    if (!this.meModule) {
      return;
    }
    if (!this.viewer) {
      return;
    }
    // 以服务器时间为准，实时渲染信号灯
    const currentTime = this.cModule.currentTime;
    for (const shortTaskData of this.shortTaskDatas) {
      const rps: typeof shortTaskData.runParam = []
      for (let rp of shortTaskData.runParam) {
        if (rps.length > 0) {
          continue;
        }
        // 当前信号灯颜色
        if (rp.start <= currentTime && currentTime <= rp.end) {
          rps.push(rp)
        }
      }
      if (rps.length === 0) {
        // 把实体变成静态图片
        this.meModule.setSignalLightToPic(shortTaskData.signalLightChildId)
      } else {
        // 修改为对应颜色的信号灯
        const rp1 = rps[0];
        const leftTime = Math.floor((rp1.end - currentTime) / 1000);
        this.meModule.setSignalLightColor(shortTaskData.signalLightChildId, rp1.color, ifHalfSecond, leftTime)
      }
      if (
          shortTaskData.runParam.length === 0
          || (shortTaskData.runParam.length > 0 && shortTaskData.runParam[shortTaskData.runParam.length - 1].end - currentTime <= 1000 * 60 * LONG_TASK_INTERVAL)
      ) {
        if (!this.needRefreshGroupIds.includes(shortTaskData.signalLightGroupId)) {
          this.needRefreshGroupIds.push(shortTaskData.signalLightGroupId)
          console.log(shortTaskData.signalLightGroupId, '短任务即将结束', shortTaskData)
        }
      }
    }
  }
}
