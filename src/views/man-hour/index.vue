<style lang="scss" scoped>
.el-card {
  margin-top: 30px;
}
</style>
<template>
  <div ref="drawer-parent">
    <chart ref="man-hour" chart-id="man-hour" />
    <el-card shadow="never">
      <div slot="header">项目工时列表</div>
      <el-table :data="projectCount">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="creator_name" label="创建者"></el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">{{scope.row.date_start|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="结束日期">
          <template slot-scope="scope">{{scope.row.date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="task_count" label="任务工时"></el-table-column>
        <el-table-column prop="overtime_count" label="加班工时"></el-table-column>
        <el-table-column prop="project_count" label="总工时"></el-table-column>
        <el-table-column label="每日工时" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size:15px" icon="el-icon-time" @click="showDetail(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <Drawer
      :title="currentPName"
      scrollable
      closable
      v-model="showdrawer"
      width="526"
      :inner="isInner"
      :transfer="false"
      :mask="false"
    >
      <el-table :data="dayManWork" v-loading="detailLoading">
        <el-table-column label="日期">
          <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="work_hours" label="工时"></el-table-column>
      </el-table>
    </Drawer>
  </div>
</template>

<script>
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import * as Ajax from "@/api/manHour";
import thumbtackMixin from "@/utils/thumbtack-mixin";
export default {
  name: "my-man-hour",
  mixins: [thumbtackMixin],
  components: { Chart, Gantt },
  data() {
    return {
      detailLoading:false,
      dayManWork: [],
      currentPName: "", //点击详情选中的项目名作为抽屉Title
      showdrawer: false,
      projectCount: [] //我的每个标准项目工时
    };
  },
  methods: {
    showDetail(row) {
      this.currentPName = `${row.name}每日工时`;
      this.showdrawer = true;
      this.detailLoading = true
      let data = { project_day_id: row.id };
      Ajax.getManHour(data).then(({ data }) => {
        this.dayManWork = [...data.msg.date_list];
      }).finally(()=>{
        this.detailLoading = false
      })
    },
    //获取工时统计并渲染饼状图
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
