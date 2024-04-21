<template>
  <div class="box8">
    <div class="title">
      <p>预约渠道数据统计</p>
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
  let option = {
    tooltip: {
      // show: false // 弹层数据去掉
    },
    legend: {
      show: false,
    },
    radar: {
      center: ["50%", "50%"], // 外圆的位置
      radius: "70%",
      axisName: {
        name: {
          color: "#fff",
          fontSize: 12,
          fontWeight: 400,
        },
      },
      // TODO:
      indicator: [
        {
          name: "抖音",
          max: 100,
        },
        {
          name: "微信",
          max: 100,
        },
        {
          name: "美团",
          max: 100,
        },
        {
          name: "大众点评",
          max: 100,
        },
        {
          name: "其他",
          max: 100,
        },
        {
          name: "电话",
          max: 100,
        },
      ],
      splitArea: {
        // 坐标轴在 grid 区域中的分隔区域，默认不显示。
        show: true,
        areaStyle: {
          // 分隔区域的样式设置。
          color: ["#1c2330"], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
        },
      },
      axisLine: {
        // 指向外圈文本的分隔线样式
        lineStyle: {
          // color: 'rgba(255,255,255,0.2)'
          color: "rgba(255,255,255,0.7)",
        },
      },
      splitLine: {
        lineStyle: {
          type: "solid",
          color: "#1781BA", // 分隔线颜色
          width: 1, // 分隔线线宽
        },
      },
    },
    series: [
      {
        type: "radar",
        symbolSize: 5,
        symbol: "circle",
        data: [
          {
            // TODO:
            value: [80, 80, 80, 70, 60, 50],
            name: "数据统计",
            areaStyle: {
              color: "#39B2FF",
              opacity: 0.3,
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#00A2FF",
                  },
                  {
                    offset: 1,
                    color: "#0060FF",
                  },
                ],
                false
              ),
              width: 1,
            },
            color: "#81B8CC ",
            borderColor: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#00DEFF",
                },
                {
                  offset: 1,
                  color: "#1598FF",
                },
              ],
              false
            ),
            borderWidth: 0.5,
            opacity: 1,
            // itemStyle: {

            // },
          },
        ],
      },
    ],
  };

  mychart.setOption(option);
});
</script>

<style scoped lang="scss">
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
    margin: 20px, 0px;
  }
}
</style>
