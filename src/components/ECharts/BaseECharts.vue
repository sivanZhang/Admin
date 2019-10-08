<template>
  <div :id="chartId" :style="{height:height,width:width}" v-loading="loading" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
export default {
  name: "base-echarts",
  props: {
    chartId: {
      type: String,
      default: "echart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "480px"
    }
  },
  data() {
    return {
      chart: null,
      loading: false,
      hasData: true
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 父组件调用,开启加载动画
    openLoading() {
      this.loading = true;
    },
    /**
     * 父组件直接调用该方法即可渲染，但是父组件必须在其 mounted() 钩子中调用
     *
     * @param {Object} option echarts配置
     *
     */
    initChart(cuntomOption) {
      const option = {
        title: {
          text: "基础雷达图"
        },
        tooltip: {},
        legend: {
          data: ["预算分配（Allocated Budget）", "实际开销（Actual Spending）"]
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: "销售（sales）", max: 6500 },
            { name: "管理（Administration）", max: 16000 },
            { name: "信息技术（Information Techology）", max: 30000 },
            { name: "客服（Customer Support）", max: 38000 },
            { name: "研发（Development）", max: 52000 },
            { name: "市场（Marketing）", max: 25000 }
          ]
        },
        series: [
          {
            name: "预算 vs 开销（Budget vs spending）",
            type: "radar",
            // areaStyle: {normal: {}},
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: "预算分配（Allocated Budget）"
              }
            ]
          }
        ]
      };
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption({...option,...cuntomOption});
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>