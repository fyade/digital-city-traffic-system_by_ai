import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { funcUtils } from "@dcts/common";

/**
 * 通用 Three 类
 */
export class UseThree {
  private static instance: UseThree | null = null
  private container: string | null = null
  protected scene: THREE.Scene | null = null
  protected camera: THREE.PerspectiveCamera | null = null
  protected renderer: THREE.WebGLRenderer | null = null
  private resizeObserver: ResizeObserver | null = null

  private ifAddHelper = true

  constructor() {
    if (!UseThree.instance) {
      UseThree.instance = this
    }
    return UseThree.instance
  }

  /**
   * 初始化
   * @protected
   */
  protected init() {
    if (!this.scene) {
      return
    }

    if (this.ifAddHelper) {
      // 坐标轴
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    }

    if (this.ifAddHelper) {
      // 标定点
      const colors = [
        0xff0000,
        0x00ff00,
        0x0000ff,
      ];
      const positions: [number, number, number][] = [
        [10, 0, 0],
        [0, 10, 0],
        [0, 0, 10],
      ]
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({color: colors[i]});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(...positions[i]);
        this.scene.add(cube);
      }
    }
  }

  /**
   * 销毁
   */
  public destroy() {
    UseThree.instance = null
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 通用工具函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 获取元素尺寸
   * @private
   */
  private getElSize() {
    let width = 0, height = 0
    if (this.container) {
      const element = document.getElementById(this.container);
      if (element) {
        width = element.clientWidth
        height = element.clientHeight
      }
    }
    return {
      width,
      height
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 通用基础对象函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 硬件状态变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 三维通用变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件封装 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 设置容器
   * @param container
   */
  public setContainer(container: string) {
    this.container = container
    const elSize = this.getElSize();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, elSize.width / elSize.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    const element = document.getElementById(this.container);
    if (!element) {
      return
    }
    element.appendChild(this.renderer.domElement)

    this.bodyResize()
    this.resizeObserver = new ResizeObserver(this.bodyResizeDebounce);
    this.resizeObserver.observe(element)

    this.camera = new THREE.PerspectiveCamera(75, elSize.width / elSize.height, 0.1, 1000);
    this.camera.position.set(2, 5, 20)
    this.camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    // controls.dampingFactor = 0.1;
    controls.update();

    // 光
    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light)

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    }
    animate()

    this.init()
  }

  /**
   * 页面尺寸变化
   * @private
   */
  private bodyResize() {
    const elSize = this.getElSize();
    if (!this.renderer) {
      return
    }
    if (!this.camera) {
      return;
    }
    this.renderer.setSize(elSize.width, elSize.height)
    this.camera.aspect = elSize.width / elSize.height
    this.camera.updateProjectionMatrix()
  }

  private bodyResizeDebounce = funcUtils.debounce(this.bodyResize.bind(this), 100)
}
