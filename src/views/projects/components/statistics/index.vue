<template>
  <div id="statistics" class="text-center">
    <div>
      <el-row>
        <el-col :span="5" align="middle">
          <div >
            <label for>项目进度</label>
          </div>
          <div style="margin-top:80px">
            <el-progress type="circle" :percentage="projectProgress" :color="colors" :format="format"></el-progress>
          </div>
        </el-col>
        <el-col :span="8">
          <label for>资产状态统计</label>
          <!-- 图表组件 -->
          <chart ref="asset-chart" chart-id="asset-chart" />
        </el-col>
        <el-col :span="11">
          <label for>任务状态统计</label>
          <!-- 图表组件 -->
          <chart ref="task-chart" chart-id="task-chart" />
        </el-col>
      </el-row>
    </div>

    <el-divider />
    <!-- 甘特图组件 -->
    <Gantt v-loading="ganttLoading" id="gantt" :gantt-data="ganttData" />
    <el-divider />
    <el-row>
      <el-col :span="12">
        <LineChart chart-id="line-chart1" ref="line-chart1" />
      </el-col>
      <el-col :span="12">
        <LineChart chart-id="line-chart2" ref="line-chart2" />
      </el-col>
    </el-row>

    <template v-if="show_inner">
      <el-divider />
      <el-row>
        <el-col :span="12">
          <label for>内网提交统计</label>
          <!-- 图表组件 -->
          <chart ref="commit-inner" chart-id="commit-inner" />
        </el-col>
        <el-col :span="12">
          <label for>外网提交统计</label>
          <!-- 图表组件 -->
          <chart ref="commit-outer" chart-id="commit-outer" />
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import * as Ajax from "@/api/statistics";
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import LineChart from "@/components/ECharts/LineMarker";
export default {
  name: "all-statistics",
  components: { Chart, Gantt, LineChart },
  data() {
    return {
      ganttLoading: false,
      ganttData: [], //传给甘特图的数据
      projectProgress: 0,
      HttpParams: {
        //http传参对象
        project_id: this.$route.params.id
      },
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#6f7ad3", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 }
      ],
      show_inner: true
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
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.$refs["asset-chart"].initChart("", chartData);
      });
    },
    //获取任务状态统计  并传参调用图表组件的初始化方法
    getTaskStatistics() {
      Ajax.getTaskStatistic(this.HttpParams).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.$refs["task-chart"].initChart("", chartData);
      });
    },
    //获取甘特图数据
    getGantt() {
      this.ganttLoading = true;
      Ajax.getGanttData({ id: this.$route.params.id }).then(({ data }) => {
        const arr = [...data.msg];
        this.ganttLoading = false;
        this.ganttData = arr.map((t, i) => {
          return {
            id: t.deptid,
            label: t.deptname,
            type: "task", //线条样式
            start: t.start * 1000, //开始时间
            end: t.end * 1000, //结束时间
            duration: t.last * 60 * 60 * 1000 //工时
            /* style: {
              base: {//颜色
                fill: "#26C6DA",
                stroke: "#4DD0E1"
              }
            } */
          };
        });
      });
    },
    //获取燃尽图数据
    getBurnOut() {
      this.$refs["line-chart1"].openLoading();
      Ajax.burnOut({ id: this.$route.params.id, bourout: "" }).then(
        ({ data }) => {
          if (data.status === 0) {
            let customOption = {
              title: {
                top: 20,
                text: "项目燃尽图",
                textStyle: {
                  fontWeight: 600,
                  fontSize: 16
                },
                left: "left",
                top: 0
              },
              tooltip: {
                trigger: "axis"
              },
              legend: {
                //图例
                data: ["计划工作时长", "实际工作时长"], // 名字
                tooltip: {
                  show: true
                }
              },
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.dates
                }
              ],
              yAxis: [
                {
                  type: "value"
                  /* name: "(%)", */
                }
              ],
              series: [
                // 线数据
                {
                  name: "计划工作时长",
                  type: "line",
                  smooth: true,
                  showSymbol: true,
                  data: data.plan_worktimes
                },
                {
                  name: "实际工作时长",
                  type: "line",
                  smooth: true, // 是否曲线
                  showSymbol: true, // 是否显示点
                  data: data.real_worktimes
                }
              ]
            };
            this.$refs["line-chart1"].initChart(customOption);
            this.$refs["line-chart2"].initChart("");
          }
        }
      );
    },
    //获取项目提交次数统计数据
    getCommitCount() {
      Ajax.proCommitCount({ project_id: this.$route.params.id }).then(
        ({ data }) => {
          if (!data.inner_num.length) {
            this.show_inner = false;
          }
          let chartData = data.inner_num.map(t => {
            return { name: t.submit_name, value: t.num };
          });
          let chartData2 = data.out_num.map(t => {
            return { name: t.submit_name, value: t.num };
          });
          this.$refs["commit-inner"].initChart("", chartData);
          this.$refs["commit-outer"].initChart("", chartData2);
        }
      );
    }
  },
  created() {
    this.getProjectProgress();
    this.getGantt();
  },
  mounted() {
    this.getAssetStatistics();
    this.getTaskStatistics();
    this.getBurnOut();
    this.getCommitCount();
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