import * as Cesium from "cesium";
import { CronJob } from "cron";
import { CalculateLightsInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import { ClockModule } from "@/views/dashboard/functionModules/clockModule.ts";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { ID_PREFIX_SIGNAL_LIGHT } from "@/views/dashboard/functionModules/constant.ts";
import signalLight1Svg from "@/assets/images2/signal-light-1.png";

const canvasWidth = 60
const canvasHeight = 16
const canvasCircleDiameter = 10
const canvasPadding = (canvasHeight - canvasCircleDiameter) / 2

const LONG_TASK_INTERVAL = 10; // 长任务执行间隔（分钟）

/**
 * 信号灯模块
 */
export class SignalLightModule {
  private cModule: ClockModule | null = null

  public setCModule(cModule: ClockModule) {
    this.cModule = cModule;
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
  }

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
            || (rp.start <= currentTime + 1000 * 60 * LONG_TASK_INTERVAL && rp.end >= currentTime + 1000 * 60 * LONG_TASK_INTERVAL)
            || (currentTime <= rp.start && rp.end <= currentTime + 1000 * 60 * LONG_TASK_INTERVAL)
            || (rp.start <= currentTime && currentTime + 1000 * 60 * LONG_TASK_INTERVAL <= rp.end)
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
      const entity = this.viewer.entities.getById(`${ID_PREFIX_SIGNAL_LIGHT}${shortTaskData.signalLightChildId}`);
      if (!entity || !entity.billboard) {
        continue;
      }
      if (rps.length === 0) {
        // 把实体变成静态图片
        entity.billboard.width = new Cesium.ConstantProperty(24)
        entity.billboard.height = new Cesium.ConstantProperty(24)
        entity.billboard.image = new Cesium.ConstantProperty(signalLight1Svg)
      } else {
        // 修改为对应颜色的信号灯
        entity.billboard.width = new Cesium.ConstantProperty(canvasWidth)
        entity.billboard.height = new Cesium.ConstantProperty(canvasHeight)
        const rp1 = rps[0];
        const leftTime = Math.floor((rp1.end - currentTime) / 1000);
        if (rp1.color === 'red') {
          entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('red', leftTime))
        } else if (rp1.color === 'green') {
          entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('green', leftTime))
        } else if (rp1.color === 'yellow') {
          if (ifHalfSecond) {
            entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('yellow', leftTime))
          } else {
            entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('', leftTime))
          }
        } else {
          entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('', leftTime))
        }
      }
    }
  }
}

const lightCanvasMap = new Map<string, HTMLCanvasElement>();

function getLightCanvas(color: 'red' | 'green' | 'yellow' | '', time: number) {
  const canvas0 = lightCanvasMap.get(`${color}.${time}`);
  if (canvas0) {
    return canvas0
  }
  const trafficLightCanvas = createTrafficLightCanvas(color, time);
  if (trafficLightCanvas) {
    lightCanvasMap.set(`${color}.${time}`, trafficLightCanvas);
    return trafficLightCanvas
  }
  return null
}

/**
 * 使用Canvas动态生成信号灯图像
 * @param activeColor
 * @param time
 */
function createTrafficLightCanvas(activeColor = '', time = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null
  }

  // 绘制灯框
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 绘制红灯
  ctx.beginPath();
  ctx.arc((canvasPadding + canvasCircleDiameter) - canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'red' ? 'red' : '#400';
  ctx.fill();

  // 绘制黄灯
  ctx.beginPath();
  ctx.arc((canvasPadding + canvasCircleDiameter) * 2 - canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'yellow' ? 'yellow' : '#440';
  ctx.fill();

  // 绘制绿灯
  ctx.beginPath();
  ctx.arc((canvasPadding + canvasCircleDiameter) * 3 - canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'green' ? '#0f0' : '#004';
  ctx.fill();

  // 绘制倒数
  ctx.font = `${canvasCircleDiameter * 1.2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${time}`, ((canvasPadding + canvasCircleDiameter) * 3 + canvasWidth) / 2, canvasHeight / 2)

  return canvas;
}
