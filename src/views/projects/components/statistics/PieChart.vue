<template>
  <div :id="id" :style="{height:height,width:width}" v-loading="loading"/>
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
      default: "320px"
    },
    id:{
      type: String,
      default: "chart"
    }
  },
  data() {
    return {
      chart: null,
      loading:true
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id));
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
      let keys = Object.keys(data);
      let chartData = keys.map(t => {
        return { name: t, value: data[t] };
      });
      let options ={
        title:{
          text:title,
          textStyle:{
            fontSize:14
          },
          left:'center',
          top:0
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          data: keys,
          bottom:'0'
        },
        series: [
          {
            name: title,
            type: "pie",
            data: chartData,
            radius:[0,100],
          },
        ]
      }
      this.chart.setOption(options)
      this.loading=false
    }
  }
};
</script>
