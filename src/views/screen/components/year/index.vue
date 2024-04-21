<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
//获取DOM节点
let charts = ref();
//组件挂载完毕
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  let mychart = echarts.init(charts.value);
  //设置配置项
  mychart.setOption({
    title: {
      text: "散点图",
      left: "40%",
      textStyle: {
        color: "white",
      },
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: 20,
      right: 0,
      top: 20,
      bottom: 20,
    },
    series: {
      type: "scatter",
      data: [33, 88, 21, 9, 788, 234, 456, 787, 541, 151],
      symbol: "diamond",
      label: {
        show: true,
      },
    },
  });
});
</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
