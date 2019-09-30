<template>
  <div id="statistics" class="text-center">
    <div>
      <el-progress type="circle" :percentage="projectProgress" :color="colors" :format="format"></el-progress>
    </div>
    <div style="margin-top:15px">
      <label for>项目进度</label>
    </div>
    <el-divider />
    <!-- 甘特图组件 -->
    <Gantt v-loading="ganttLoading" id="gantt" :gantt-data="ganttData" />
    <el-divider />
    <el-row>
      <el-col :span="12">
        <label for>资产状态统计</label>
        <!-- 图表组件 -->
        <chart ref="asset-chart" chart-id="asset-chart" />
      </el-col>
      <el-col :span="12">
        <label for>任务状态统计</label>
        <!-- 图表组件 -->
        <chart ref="task-chart" chart-id="task-chart" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as Ajax from "@/api/statistics";
import Chart from "./PieChart";
import Gantt from "./Gantt";
export default {
  name: "all-statistics",
  components: { Chart, Gantt },
  data() {
    return {
      ganttLoading:false,
      ganttData: [],//传给甘特图的数据
      projectProgress: 0,
      HttpParams: {//http传参对象
        project_id: this.$route.params.id
      },
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#6f7ad3", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 }
      ]
    };
  },
  methods: {
    //指定进度条文字内容。
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    },
    //获取项目进度
    getProjectProgress() {
      Ajax.getProjectStatistic(this.HttpParams).then(({ data }) => {
        this.projectProgress = data.msg.replace("%", "") - 0;
      });
    },
    //获取资产状态统计  并传参调用图表组件的初始化方法
    getAssetStatistics() {
      Ajax.getAssetStatistic(this.HttpParams).then(({ data }) => {
        this.$refs["asset-chart"].initChart("", data.msg);
      });
    },
    //获取任务状态统计  并传参调用图表组件的初始化方法
    getTaskStatistics() {
      Ajax.getTaskStatistic(this.HttpParams).then(({ data }) => {
        this.$refs["task-chart"].initChart("", data.msg);
      });
    },
    //获取甘特图数据
    getGantt() {
      this.ganttLoading=true
      Ajax.getGanttData({ id: this.$route.params.id }).then(({ data }) => {
        const arr = [...data.msg];
        this.ganttLoading=false
        this.ganttData = arr.map((t, i) => {
          return {
            id: t.deptid,
            label: t.deptname,
            type: "task",//线条样式
            start: t.start * 1000,//开始时间
            end: t.end * 1000,//结束时间
            duration: t.last * 60 * 60 * 1000,//工时
            /* style: {
              base: {//颜色
                fill: "#26C6DA",
                stroke: "#4DD0E1"
              }
            } */
          };
        });
      });
    }
  },
  created() {
    this.getProjectProgress();
    this.getGantt();
  },
  mounted() {
    this.getAssetStatistics();
    this.getTaskStatistics();
  }
};
</script>
<style lang="scss" scoped>
#statistics {
  position: relative;
  width: 100%;
  #gantt {
    padding-bottom: 15px;
  }
}
</style>