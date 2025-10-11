import { UseThree } from "@/views/three/core/useThree.ts";

class UseDashboardThree extends UseThree {
  constructor() {
    super();
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 外部访问 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件覆盖及初始化 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  protected init() {
    super.init();
  }

  destroy() {
    super.destroy();
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
}

export function createDashboardThree() {
  return new UseDashboardThree()
}

export let useDashboardThree = createDashboardThree()
