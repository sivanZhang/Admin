<template>
  <div id="statistics" class="text-center">
    
    <div>
      <el-progress
        type="circle"
        :percentage="projectProgress"
        :color="colors"
        :format="format"
      ></el-progress>
    </div>
    <div style="margin-top:15px">
      <label for>项目进度</label>
    </div>
    <el-divider />
    <el-row>
      <el-col :span="12">
        <label for>资产状态统计</label>
        <chart ref="asset-chart" id="asset-chart" />
      </el-col>
      <el-col :span="12">
        <label for>任务状态统计</label>
        <chart ref="task-chart" id="task-chart" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as Ajax from "@/api/statistics";
import Chart from "./PieChart";
import { nextTick } from "q";
export default {
  name: "all-statistics",
  components: { Chart },
  data() {
    const HttpParams = {
      project_id: this.$route.params.id
    };
    return {
      projectProgress: 0,
      HttpParams,
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
    format(percentage) {
        return percentage === 100 ? '完成' : `${percentage}%`;
      },
    //获取项目进度
    getProjectProgress() {
      Ajax.getProjectStatistic(this.HttpParams).then(({ data }) => {
        this.projectProgress = data.msg.replace("%", "") - 0;
      });
    },
    //获取资产状态统计
    getAssetStatistics() {
      Ajax.getAssetStatistic(this.HttpParams).then(({ data }) => {
        this.$refs["asset-chart"].initChart("", data.msg);
      });
    },
    //获取任务状态统计
    getTaskStatistics() {
      Ajax.getTaskStatistic(this.HttpParams).then(({ data }) => {
        this.$refs["task-chart"].initChart("", data.msg);
      });
    }
  },
  created() {
    this.getProjectProgress();
  },
  mounted() {
    this.$nextTick(() => {
      this.getAssetStatistics();
      this.getTaskStatistics();
    });
  }
};
</script>
<style lang="scss" scoped>
#statistics {
  position: relative;
  width: 100%;
}
</style>