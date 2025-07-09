import * as Cesium from "cesium";

/**
 * 信号灯模块
 */
export class SignalLightModule {
  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }


  /**
   * 信号灯渲染示例代码
   */
  public test() {
    // 定时切换信号灯状态
    const states = ['red', 'green', 'yellow'];
    let currentState = 0;

    setInterval(() => {
      currentState = (currentState + 1) % states.length;
      const trafficLightCanvas1 = createTrafficLightCanvas(states[currentState]);
      if (trafficLight.billboard && trafficLightCanvas1) {
        trafficLight.billboard.image = new Cesium.ConstantProperty(trafficLightCanvas1.toDataURL());
      }
    }, 5000); // 每5秒切换一次

    if (!this.viewer) {
      return
    }
    const trafficLightCanvas = createTrafficLightCanvas('red');
    if (!trafficLightCanvas) {
      return;
    }
    // 创建信号灯实体（垂直排列红黄绿三个灯）
    const trafficLight = this.viewer.entities.add({
      name: '交通信号灯',
      position: Cesium.Cartesian3.fromDegrees(118.92670292539172, 32.12639492204489),
      billboard: {
        image: trafficLightCanvas,
        width: 80,
        height: 30,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    });
  }
}

/**
 * 使用Canvas动态生成信号灯图像
 * @param activeColor
 */
function createTrafficLightCanvas(activeColor = '') {
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 30;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null
  }

  // 绘制灯框
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, 80, 30);

  // 绘制红灯
  ctx.beginPath();
  ctx.arc(15, 15, 10, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'red' ? 'red' : '#400';
  ctx.fill();

  // 绘制黄灯
  ctx.beginPath();
  ctx.arc(40, 15, 10, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'yellow' ? 'yellow' : '#440';
  ctx.fill();

  // 绘制绿灯
  ctx.beginPath();
  ctx.arc(65, 15, 10, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'green' ? '#0f0' : '#004';
  ctx.fill();

  return canvas;
}
