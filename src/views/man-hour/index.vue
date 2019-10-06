<style lang="scss" scoped>
.el-card {
  margin-top: 30px;
}
</style>
<template>
  <div ref="drawer-parent">
    <template v-if="!authDaysOff">
      <div style="display:flex">
        <chart ref="man-hour" chart-id="man-hour" />
        <chart ref="dayoff-hour" chart-id="dayoff-hour" />
      </div>
    </template>
    <template v-else>
      <chart ref="man-hour" chart-id="man-hour" />
    </template>
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
        <el-table-column label="工时详情" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="font-size:15px"
              icon="el-icon-time"
              @click="showDetail(scope.row)"
            ></el-button>
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
      <el-tabs v-model="activeName">
        <el-tab-pane label="每日工时" name="first">
          <el-table
            :data="dayManWork"
            v-loading="detailLoading"
            :border="false"
            :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
            :cell-style="{borderRight:0}"
            highlight-current-row
          >
            <el-table-column label="日期">
              <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="work_hours" label="工时"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="任务明细" name="second">
          <div style="overflow-x:auto">
            <el-table
              :data="taskList"
              :border="false"
              :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
              :cell-style="{borderRight:0}"
              highlight-current-row
            >
              <el-table-column label="任务名称" prop="name" show-overflow-tooltip></el-table-column>
              <el-table-column label="制作内容" prop="content" show-overflow-tooltip></el-table-column>
              <el-table-column label="制作环节" prop="dept.name"></el-table-column>
              <el-table-column label="任务主管" prop="manager.name"></el-table-column>
              <el-table-column label="记录工时" prop="record_hour"></el-table-column>
              <el-table-column label="创建时间" prop="create_time" width="90px">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="开始时间" prop="start_date" width="90px">
                <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="结束时间" prop="end_date" width="90px">
                <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加班明细" name="third">
          <div style="overflow-x:auto">
            <el-table
              :data="overtime_list"
              :border="false"
              :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
              :cell-style="{borderRight:0}"
              highlight-current-row
            >
              <el-table-column label="申请人" prop="creator.username"></el-table-column>
              <el-table-column label="加班工时" prop="overtime_hour"></el-table-column>
              <el-table-column label="加班原因" prop="reason" show-overflow-tooltip></el-table-column>
              <el-table-column label="相关任务" prop="task" align="center">
                <el-table-column label="任务名称" prop="task.name" show-overflow-tooltip></el-table-column>
                <el-table-column label="制作内容" prop="task.content" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属项目" prop="task.project.name" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属镜头" prop="task.asset.name" show-overflow-tooltip></el-table-column>
              </el-table-column>
              <el-table-column label="创建时间" prop="creator_date" width="90px">
                <template slot-scope="scope">{{scope.row.creator_date|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="开始时间" prop="start_time" width="90px">
                <template slot-scope="scope">{{scope.row.start_time|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="结束时间" prop="end_time" width="90px">
                <template slot-scope="scope">{{scope.row.end_time|dateFormat}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<script>
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import * as Ajax from "@/api/manHour";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { getDayOffList } from "@/api/checkingIn";
export default {
  name: "my-man-hour",
  mixins: [thumbtackMixin],
  components: { Chart, Gantt },
  data() {
    return {
      detailLoading: false,
      dayManWork: [],
      currentPName: "", //点击详情选中的项目名作为抽屉Title
      showdrawer: false,
      projectCount: [], //我的每个标准项目工时，
      activeName: "first",
      taskList: [], //任务明细
      overtime_list: [], //加班明细
      authDaysOff: null
    };
  },
  methods: {
    showDetail(row) {
      this.currentPName = `${row.name} 工时详情`;
      this.showdrawer = true;
      this.detailLoading = true;
      let data = { project_day_id: row.id };
      let data2 = { project_id: row.id };

      Ajax.getManHour(data)
        .then(({ data }) => {
          this.dayManWork = [...data.msg.date_list];
        })
        .finally(() => {
          this.detailLoading = false;
        });
      Ajax.getManHour(data2).then(({ data }) => {
        if (data.status === 0) {
          this.taskList = [...data.msg.task_list];
          this.overtime_list = [...data.msg.overtime_list];
        }
      });
    },
    //获取工时和调休统计并渲染饼状图
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
      let payload = { my_daysoff: "" };
      this.$refs["dayoff-hour"].openLoading();
      getDayOffList(payload).then(({ data }) => {
        if(!data.auth.daysoff_operate){
          let Data = data.msg[0].off_count;
          //console.log(data.msg)
        let chartData = [
          {
            name: "已调休时长",
            value: Data.have_off_hour
          },
          {
            name: "可调休时长",
            value: Data.allow_off_hour
          }
        ];
        this.$refs["dayoff-hour"].initChart("调休统计", chartData);
        }else{
          return;
        }
        
        
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
    getDayOffList({ my_daysoff: "" }).then(({ data }) => {
      this.authDaysOff = data.auth.daysoff_operate;
     // console.log(this.authDaysOff);
    });
    this.getStatistics();
  }
};
</script>
