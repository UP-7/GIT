<template>
  <div class="container">
    <!-- 数据大屏展示区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"> </Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Couter class="couter"></Couter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//把div拽回来
import { ref, onMounted } from "vue";
//引入顶部子组件
import Top from "./components/top/index.vue";
//引入左侧三个组件
import Tourist from "./components/tourist/index.vue";
import Sex from "./components/sex/index.vue";
import Age from "./components/age/index.vue";
import Map from "./components/map/index.vue";
import Line from "./components/line/index.vue";
import Rank from "./components/rank/index.vue";
import Year from "./components/year/index.vue";
import Couter from "./components/couter/index.vue";
//获取数据大屏显示内容的dom元素
let screen = ref();
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});
//定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}
//监听视口的变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url("./images/bg.png") no-repeat;
  background-size: cover;
  .screen {
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    position: fixed;
    left: 50%;
    top: 50%;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .right {
        flex: 1;
      }
      .left {
        height: 1040px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
      }
    }
  }
}
.center {
  flex: 2;
  display: flex;
  flex-direction: column;
  .map {
    flex: 4;
  }
  .line {
    flex: 1;
  }
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  .rank {
    flex: 1.5;
  }
  .year {
    flex: 1;
  }
  .couter {
    flex: 1;
  }
}
</style>
