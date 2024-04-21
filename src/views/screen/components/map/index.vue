<template>
  <div class="box4" ref="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
//引入中国的地图的json
import chinaJSON from "./china.json";
//获取图形图表的dom节点
let map = ref();

//注册中国地图
echarts.registerMap("china", chinaJSON as any);
onMounted(() => {
  let mychart = echarts.init(map.value);
  //设置配置项
  mychart.setOption({
    //地图组件
    geo: {
      map: "china", //中国地图
      roam: true, //鼠标缩放的效果
      //地图的位置调试
      left: 100,
      top: 150,
      right: 100,
      zoom: 1.2,
      bottom: 0,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        color: "white",
        fontSize: 10,
      },

      itemStyle: {
        //每一个多边形的样式
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "skyblue", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: "red",
        },
        label: {
          fontSize: 20,
        },
      },
    },
    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: "lines", //航线的系列
        data: [
          {
            coords: [
              [87.617733, 43.792818], // 起点
              [91.132212, 29.660361], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [91.132212, 29.660361], // 起点
              [100.132212, 25.660361], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [100.132212, 25.660361], // 起点
              [109.132212, 18.660361], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [109.132212, 18.660361], // 起点
              [117.132212, 25.660361], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [117.132212, 25.660361], // 起点
              [125.132212, 44.060361], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [125.132212, 44.060361], // 起点
              [116.405285, 39.904989], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [112.304436, 37.618179], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [112.304436, 37.618179], // 起点
              [106.504962, 29.533155], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [106.504962, 29.533155], // 起点
              [104.065735, 30.659462], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [106.504962, 29.533155], // 起点
              [104.065735, 30.659462], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [104.065735, 30.659462], // 起点
              [101.778916, 36.623178], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
          {
            coords: [
              [101.778916, 36.623178],
              [87.617733, 43.792818],
            ],
            // 统一的样式设置
            lineStyle: {
              color: "red",
              width: 5,
            },
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          symbol: "arrow",
          color: "yellow",
          symbolSize: 10,
        },
      },
    ],
  });
});
</script>

<style scoped></style>
