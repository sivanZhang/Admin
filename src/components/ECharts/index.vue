<template>
   <div v-if="hasData" :id="chartId" :style="{height:height,width:width}" v-loading="loading" />
   <div v-else :style="{height:height,width:width}" class="no-data">
     暂无数据
   </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
export default {
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
      hasData:true,
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
     * @param {Object} customOption echarts配置
     *
     */
    initChart(customOption) {
      if(!customOption){
        this.hasData = false
        return
      }
      this.chart = echarts.init(document.getElementById(this.chartId));
      let option = Object.assign({}, customOption);
      this.chart.setOption(option);
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.no-data{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>