<template>
  <div :id="id" :style="{height:height,width:width}" />
</template>

<script>
require("echarts/theme/macarons"); // echarts theme
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import resize from "./resize";

export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "340px"
    },
    id:{
      type: String,
      default: "chart"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    //title=图标title，data=表单数据
    initChart(title='', data = {}) {
      this.chart = echarts.init(document.getElementById(this.id));
      let keys = Object.keys(data);
      let chartData = keys.map(t => {
        return { name: t, value: data[t] };
      });
      let options ={
        title:{
          text:title,
          textStyle:{
            fontSize:14
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          bottom: "10",
          data: keys
        },
        series: [
          {
            name: title,
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: chartData,
            animationEasing: "cubicInOut",
            animationDuration: 2600
          }
        ]
      }
      this.$nextTick(()=>{
        this.chart.setOption(options)
      });
    }
  }
};
</script>
