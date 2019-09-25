<template>
  <div id="statistics">
    <label for>项目进度统计</label>
    <el-row type="flex" justify="center">
      <el-progress type="circle" :percentage="projectProgress"></el-progress>
    </el-row>
    <el-divider />
    <chart ref="asset-chart" id="asset-chart" />
    <el-divider />
    <chart ref="task-chart" id="task-chart" />
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
      projectProgress: 50,
      HttpParams
    };
  },
  methods: {
    //获取项目进度
    getProjectProgress() {
      Ajax.getProjectStatistic(this.HttpParams).then(({ data }) => {
        this.projectProgress = data.msg.replace("%", "") - 0;
      });
    },
    //获取资产状态统计
    getAssetStatistics() {
      Ajax.getAssetStatistic(this.HttpParams).then(({ data }) => {
        this.$refs["asset-chart"].initChart("资产状态统计", data.msg);
      });
    },
    //获取任务状态统计
    getTaskStatistics() {
      Ajax.getTaskStatistic(this.HttpParams).then(({ data }) => {
        this.$refs["task-chart"].initChart("任务状态统计", data.msg);
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