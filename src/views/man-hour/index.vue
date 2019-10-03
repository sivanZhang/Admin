<template>
  <div>
    <chart ref="man-hour" chart-id="man-hour" />
    <el-table :data="projectCount">
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="creator_name" label="创建者"></el-table-column>
      <el-table-column label="开始日期">
        <template slot-scope="scope">{{scope.row.date_end|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="结束日期">
        <template slot-scope="scope">{{scope.row.date_end|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task_count" label="任务工时"></el-table-column>
      <el-table-column prop="overtime_count" label="加班工时"></el-table-column>
      <el-table-column prop="project_count" label="总工时"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import * as Ajax from "@/api/manHour";
export default {
  name: "my-man-hour",
  components: { Chart, Gantt },
  data() {
    return {
      projectCount: [] //我的每个标准项目工时
    };
  },
  methods: {
    getStatistics() {
      let data = { total_count: "" };
      this.$refs["man-hour"].openLoading();
      Ajax.getManHour(data).then(({ data }) => {
        let chartData = [
          {
            name: "任务工时",
            value: data.task_count
          },
          {
            name: "加班工时",
            value: data.overtime_count
          }
        ];
        this.$refs["man-hour"].initChart("工时统计", chartData);
      });
    },
    getProjectsHour() {
      let data = { project_count: "" };
      Ajax.getManHour(data).then(({ data }) => {
        this.projectCount = [...data.msg];
      });
    }
  },
  created() {
    this.getProjectsHour();
  },
  mounted() {
    this.getStatistics();
  }
};
</script>
