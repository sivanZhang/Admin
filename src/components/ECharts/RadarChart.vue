<template>
  <div :id="chartId" :class="className" :style="{height:height,width:width}" v-loading="loading"/>
</template>

<script>
import echarts from "echarts";
const DefaultOption = {
  title: {
        text: '基础雷达图'
    },
    tooltip: {},
    legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
    },
    radar: {
        // shape: 'circle',
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
           }
        },
        indicator: [
           { name: '销售（sales）', max: 6500},
           { name: '管理（Administration）', max: 16000},
           { name: '信息技术（Information Techology）', max: 30000},
           { name: '客服（Customer Support）', max: 38000},
           { name: '研发（Development）', max: 52000},
           { name: '市场（Marketing）', max: 25000}
        ]
    },
    series: [{
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        // areaStyle: {normal: {}},
        data : [
            {
                value : [4300, 10000, 28000, 35000, 50000, 19000],
                name : '预算分配（Allocated Budget）'
            }
        ]
    }]
};
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    chartId: {
      type: String,
      default: "chart"
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
      loading:false
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartId));
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
     * @param {Object} customOption 参考上面DefaultOption里面配置 
     *
     */
    initChart(customOption = {}) {
      let option = Object.assign({}, DefaultOption, customOption);
      this.chart.setOption(option);
      this.loading = false;
    }
  }
};
</script>
