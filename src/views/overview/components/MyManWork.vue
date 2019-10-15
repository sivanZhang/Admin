<template>
  <el-card>
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span>我的工时</span>
      <el-button type="text">填报工时</el-button>
    </el-row>
    <MyCharts ref="radar" chart-id="radar-chart" />
    <el-divider />
    <el-row>
      <el-col :span="12">本周：{{weekHour.total_count}}</el-col>
      <el-col :span="12">本月：{{monthHour.total_count}}</el-col>
    </el-row>
  </el-card>
</template>

<script>
import MyCharts from "@/components/ECharts/BaseECharts";
import { getMyManHour } from "@/api/manHour";
import AXIOS from "@/utils/request";
import dayjs from "dayjs";
let option = {
  tooltip: {
    formatter: "{a} <br/>{c} {b}"
  },
  series: [
    {
      name: "今日工时",
      type: "gauge",
      min: 0,
      max: 12,
      splitNumber: 12,
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: [[0.333, "#91c7ae"], [0.666, "#63869e"], [1, "#c23531"]],
          width: 8
        }
      },
      axisTick: {
        // 坐标轴小标记
        length: 15, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: "auto"
        }
      },
      splitLine: {
        // 分隔线
        length: 20, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle（详见lineStyle）控制线条样式
          color: "auto"
        }
      },
      title: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: "bolder",
        fontSize: 18
      }
    }
  ]
};
export default {
  components: {
    MyCharts
  },
  data() {
      return {
          weekHour:{},
          monthHour:{}
      }
  },
  mounted() {
    this.getMyWorkHours();
  },
  methods: {
    getMyWorkHours() {
      let today = dayjs().format("YYYY/MM/DD");
      let params = { total_count: '', end: today };
      //查询当天
      getMyManHour({ ...params, start: today }).then(({ data }) => {
        option.series[0].data = [{ value: data.overtime_count, name: "今日(h)" }];
        this.$refs.radar.initChart(option);
      });
        //查询近一周
        getMyManHour({
          ...params,
          start: dayjs()
            .subtract(1, "week")
            .format("YYYY/MM/DD")
        }).then(({ data }) => {
            this.weekHour = {...data}
        });
        //查询近一年
        getMyManHour({
          ...params,
          start: dayjs()
            .subtract(1, "month")
            .format("YYYY/MM/DD")
        }).then(({ data }) => {
            this.monthHour ={
                ...data
            }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>