<script setup lang="ts">
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
</script>

<template>
  <n-modal
      style="width: 60%;height: 60vh;"
      content-style="overflow: auto;"
      show
      preset="card"
      @close="gotoDashboardHome"
      @mask-click="gotoDashboardHome"
      title="操作指南"
  >
    <div class="el">
      <h3>三维地图操作指南</h3>
      <div class="line"></div>

      <div class="box">
        <div class="title">🎯<strong>基础视角控制</strong></div>
        <ul>
          <li>
            <p>👆<strong>鼠标左键按下 + 拖动：</strong>平移地图</p>
            <p class="beizhu">（保持当前高度水平移动相机）</p>
          </li>
          <li>
            <p>👆<strong>鼠标滚轮滚动：</strong>垂直升降相机</p>
          </li>
          <li>
            <p>👆<strong>鼠标右键按下 + 上下拖动：</strong>精细调节相机高度</p>
            <p class="beizhu">（向下拖动降低相机高度，向上拖动抬升相机高度）</p>
          </li>
          <li>
            <p>👆<strong>鼠标中键按下 + 拖动：</strong>调整观察角度</p>
            <p class="beizhu">（改变相机俯仰/偏转角度）</p>
          </li>
          <li>
            <p>🖱<strong>Windows触控板左键按下 + 单指滑动：</strong>平移地图</p>
            <p class="beizhu">（保持当前高度水平移动相机）</p>
          </li>
          <li>
            <p>🖱<strong>Windows触控板 + 双指上下滑动：</strong>精细调节相机高度</p>
            <p class="beizhu">（向下滑动降低相机高度，向上滑动抬升相机高度）</p>
          </li>
          <li>
            <p>🖱<strong>Windows触控板右键按下 + 单指上下滑动：</strong>精细调节相机高度</p>
            <p class="beizhu">（向下滑动降低相机高度，向上滑动抬升相机高度）</p>
          </li>
        </ul>
      </div>

      <div class="box">
        <div class="title">🎯<strong>聚焦状态下</strong></div>
        <ul>
          <li>
            <p>👆<strong>鼠标左键按下 + 拖动：</strong>围绕实体旋转观察</p>
            <p class="beizhu">（保持与实体的相对距离进行环形运动）</p>
          </li>
          <li>
            <p>👆<strong>鼠标滚轮滚动：</strong>调节相机距离</p>
          </li>
          <li>
            <p>👆<strong>鼠标右键按下 + 上下拖动：</strong>精细调节相机距离</p>
            <p class="beizhu">（向下拖动拉近距离，向上拖动拉远距离）</p>
          </li>
          <li>
            <p>🖱<strong>Windows触控板左键按下 + 单指滑动：</strong>围绕实体旋转观察</p>
            <p class="beizhu">（保持与实体的相对距离进行环形运动）</p>
          </li>
          <li>
            <p>🖱<strong>Windows触控板 + 双指上下滑动：</strong>精细调节相机距离</p>
            <p class="beizhu">（向下滑动拉近距离，向上滑动拉远距离）</p>
          </li>
          <li>
            <p>🖱<strong>Windows触控板右键按下 + 单指上下滑动：</strong>精细调节相机距离</p>
            <p class="beizhu">（向下滑动拉近距离，向上滑动拉远距离）</p>
          </li>
        </ul>
      </div>

      <div class="box">
        <div class="title">⚡<strong>快捷操作</strong></div>
        <ul>
          <li>
            <p>📍<strong>双击地图上的实体：</strong>快速聚焦该实体</p>
          </li>
        </ul>
      </div>

      <div class="box">
        <div class="title">⏰<strong>时间轴相关</strong></div>
        <ul>
          <li>
            <p>👆<strong>鼠标滚轮滚动：</strong>缩放时间轴</p>
          </li>
          <li>
            <p>👆<strong>鼠标右键按下 + 拖动：</strong>缩放时间轴</p>
          </li>
          <li>
            <p>👆<strong>鼠标左键按下：</strong>调整当前时间</p>
          </li>
          <li>
            <p>👆<strong>鼠标中键按下 + 拖动：</strong>拖动时间轴</p>
          </li>
        </ul>
      </div>

      <div class="box">
        <div class="title">💡<strong>使用提示</strong></div>
        <ul>
          <li>Windows触控板单指点击 = 鼠标左键</li>
          <li>Windows触控板双击点击 = 鼠标右键</li>
        </ul>
      </div>
    </div>
  </n-modal>
</template>

<style scoped>
.el {
  > .line {
    margin: 8px 0;
    height: 2px;
    background-color: #3498db;
  }

  > .box {
    margin: 12px 0;

    > .title {
      line-height: 2;
    }

    > ul {
      > li {
        margin: 12px 0;

        > .beizhu {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
