<template>
  <div id="statistics" class="text-center">
    <div>
      <el-row>
        <el-col :span="5" align="middle">
          <div>
            <label for>项目进度</label>
          </div>
          <div style="margin-top:80px">
            <el-progress
              type="circle"
              :percentage="projectProgress"
              :color="colors"
              :format="format"
            ></el-progress>
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
    <!-- 燃尽图和外包数据 -->
    <el-row>
      <el-col :span="12">
        <LineChart chart-id="line-chart1" ref="line-chart1" />
      </el-col>
      <el-col :span="12">
        <label for>工时统计图</label>
        <chart chart-id="line-chart2" ref="line-chart2" />
      </el-col>
    </el-row>
    <!-- 提交审核次数 -->
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
      <el-divider />
    </template>
    <el-divider />
    <el-row>
      <!-- 柱状图组件 -->
      <BarChart ref="task-count" chart-id="task-count" />
    </el-row>
    <template v-if="$route.query.type == 0">
      <el-divider />
      <el-row>
        <!-- 柱状图组件 -->
        <BarChart ref="grade" chart-id="grade" />
      </el-row>
    </template>

    <el-divider />
    <!-- 甘特图组件 -->
    <Gantt v-loading="ganttLoading" id="gantt" :gantt-data="ganttData" :customOptions="ganttTasks" />
    <!-- 甘特图组件 -->
    <Gantt
      v-loading="ganttStatLoading"
      id="gantt-stat"
      :gantt-data="ganttStatData"
      :customHeaderOption="customHeaderOption"
      :customOptions="customOptions"
    />
  </div>
</template>

<script>
import * as Ajax from "@/api/statistics";
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import dayjs from "dayjs";
export default {
  name: "all-statistics",
  components: { Chart, Gantt, LineChart, BarChart },
  data() {
    return {
      ganttStatLoading: false,
      ganttLoading: false,
      ganttData: [], // 传给甘特图的数据
      ganttStatData: [], // 传给甘特图2的数据
      projectProgress: 0,
      HttpParams: {
        // http传参对象
        project_id: this.$route.params.id
      },
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#6f7ad3", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 }
      ],
      show_inner: true,
      show_detail: true,
      customHeaderOption: {
        title: {
          label: "<h6 style='letter-spacing:initial'>人员工时统计:</h6>",
          html: true
        }
      },
      customOptions: {
        chart: {
          progress: {
            bar: false
          },
          expander: {
            display: true
          }
        },
        taskList: {
          expander: {
            straight: true
          },
          //甘特图中的表格配置
          columns: [
            {
              id: 1,
              label: "人员名称",
              value: task => {
                if (task.parentId) {
                  return "";
                } else {
                  return `<el-icon class="el-icon-arrow-right"> ${task.name}`;
                }
              },
              width: 200,
              html: true
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 120,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 120
            },
            {
              id: 4,
              label: "任务进度",
              value: task => `${task.progress}%`,
              width: 120,
              html: true
            }
          ]
        }
      },
      ganttTasks: {
        chart: {
          progress: {
            bar: false
          },
          expander: {
            display: true
          }
        },
        taskList: {
          //甘特图中的表格配置
          columns: [
            {
              id: 1,
              label: "工种名称",
              value: "label",
              width: 200
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 120,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 120
            }
          ]
        }
      }
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
    //获取甘特图2数据
    getganttStat() {
      this.ganttStatLoading = true;
      Ajax.getingExecutorChart({ id: this.$route.params.id, executors: "" })
        .then(({ data }) => {
          let arr = [...data.msg];
          this.ganttStatData = arr.map((t, i) => {
            let obj = {
              id: t[0],
              type: "task",
              start: t[2] * 1000,
              end: t[3] * 1000,
              progress: t[5] || 0,
              duration: t[4] * 60 * 60 * 1000,
              label: `${t[1]} (${t[5] || 0}%)`,
              collapsed: true,
              name: t[1]
            };
            if (t[7]) {
              obj.parentId = t[7];
            }
            return obj;
          });
          console.log(this.ganttStatData);
        })
        .finally(() => {
          this.ganttStatLoading = false;
        });
    },
    //获取甘特图1数据
    getGantt() {
      this.ganttLoading = true;
      Ajax.getGanttData({ id: this.$route.params.id }).then(({ data }) => {
        const arr = [...data.msg];
        this.ganttLoading = false;
        this.ganttData = arr.map((t, i, Arr) => {
          return {
            id: t.deptid,
            label: t.deptname,
            type: "task", //线条样式
            start: t.start * 1000, //开始时间
            end: t.end * 1000, //结束时间
            duration: t.last * 60 * 60 * 1000 //工时
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
          }
        }
      );
    },
    //外包数据
    exportData() {
      Ajax.exportTask({ id: this.$route.params.id, worktime: "" }).then(
        ({ data }) => {
          let keys = Object.keys(data.msg);
          // console.log(keys)
          let chartData = keys.map(t => {
            return { name: t, value: data.msg[t] };
          });
          // console.log(chartData)
          this.$refs["line-chart2"].initChart("", chartData);
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
    },
    //统计项目成员的资产和任务信息
    getAssetTask() {
      Ajax.statisticMemberDetail({ project_id: this.$route.params.id }).then(
        ({ data }) => {
          let keys = Object.keys(data.task);
          let keys2 = Object.keys(data.user_asset);
          let customOption = {
            title: {
              text: "镜头和任务分布",
              textStyle: {
                //---主标题内容样式
                color: "#000"
              },
              padding: [0, 0, 100, 100] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: ["镜头个数", "任务个数"]
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                data: keys,
                axisLabel: {
                  //---坐标轴 标签
                  show: true, //---是否显示
                  inside: false, //---是否朝内
                  interval: 0,
                  rotate: 0,
                  margin: 5 //---刻度标签与轴线之间的距离
                  //color:'red',				//---默认取轴线的颜色
                }
              }
            ],
            yAxis: [
              {
                type: "value"
              }
            ],
            series: [
              {
                name: "镜头个数",
                type: "bar",
                data: keys2.map(t => {
                  return data.user_asset[t];
                })
              },
              {
                name: "镜头个数",
                type: "bar",
                data: keys.map(t => {
                  return data.task[t];
                })
              }
            ]
          };
          // let chartData2 =
          this.$refs["task-count"].initChart(customOption);
          // this.$refs["asset-count"].initChart("", chartData2);
        }
      );
    },
    //成绩变化
    getGradeChange() {
      Ajax.MemberSort({ project_id: this.$route.params.id }).then(
        ({ data }) => {
          if(!data.sum_grade.length){
            return;
          }
          let keys = Object.keys(data.sum_grade);
          let customOption = {
            title: {
              text: "总成绩排名",
              textStyle: {
                //---主标题内容样式
                color: "#000"
              },
              padding: [0, 0, 100, 100] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: ["总成绩"]
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                data: keys,
                axisLabel: {
                  //---坐标轴 标签
                  show: true, //---是否显示
                  inside: false, //---是否朝内
                  interval: 0,
                  rotate: 0,
                  margin: 5 //---刻度标签与轴线之间的距离
                  //color:'red',				//---默认取轴线的颜色
                }
              }
            ],
            yAxis: [
              {
                type: "value"
              }
            ],
            series: [
              {
                name: "成绩",
                type: "bar",
                data: keys.map(t => {
                  return data.sum_grade[t];
                })
              }
            ]
          };
          // let chartData2 =
          this.$refs["grade"].initChart(customOption);
        }
      );
    }
  },
  created() {
    this.getProjectProgress();
    this.getGantt();
    this.getganttStat();
  },
  mounted() {
    this.getAssetStatistics();
    this.getTaskStatistics();
    this.getBurnOut();
    this.exportData();
    this.getCommitCount();
    this.getAssetTask();
    this.getGradeChange();
  }
};
</script>
<style lang="scss" scoped>
#statistics {
  position: relative;
  width: 100%;
  #gantt {
    margin-bottom: 15px;
  }
}
</style>