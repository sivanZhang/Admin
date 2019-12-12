<template>
  <div id="statistics" class="text-center">
    <el-row>
      <el-col align="right">
        <el-switch v-model="value1" active-text="图表" inactive-text="表格"></el-switch>
      </el-col>
    </el-row>
    <!-- 项目进度、镜头状态统计、任务状态统计 +table -->
    <el-row>
      <el-col :span="5" align="middle">
        <div>
          <label for>项目进度</label>
        </div>
        <div style="margin-top:80px">
          <el-progress type="circle" :percentage="projectProgress" :color="colors" :format="format"></el-progress>
        </div>
      </el-col>
      <el-col :span="8">
        <label for>镜头状态统计</label>
        <!-- 图表组件  +table-->
        <chart ref="asset-chart" chart-id="asset-chart" v-if="value1" />
        <div style="padding:10px">
          <el-table
            :data="assetStatusTable"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            v-if="!value1"
          >
            <el-table-column prop="name" label="镜头状态"></el-table-column>
            <el-table-column prop="value" label="个数"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="11">
        <label for>任务状态统计</label>
        <!-- 图表组件  +table-->
        <chart ref="task-chart" chart-id="task-chart" v-if="value1" />
        <div style="padding:10px" v-if="!value1">
          <el-table
            :data="taskStatusTable"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column prop="name" label="任务状态"></el-table-column>
            <el-table-column prop="value" label="个数"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 燃尽图 +table-->
    <template v-if="burnShow">
      <el-divider />
      <el-row>
        <LineChart chart-id="line-chart1" ref="line-chart1" v-if="value1" />
        <div v-if="!value1" style="padding-top:10px">
          <div style="padding-bottom:10px">
            <label for>项目燃尽图</label>
          </div>
          <el-table
            :data="burnOutTable"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column prop="dates" label="日期"></el-table-column>
            <el-table-column prop="plan_worktimes" label="计划工作时长"></el-table-column>
            <el-table-column prop="real_worktimes" label="实际工作时长"></el-table-column>
          </el-table>
        </div>
      </el-row>
    </template>
    <!-- 内部工时统计图和外部工时统计图 +table-->
    <el-divider />
    <div>
      <el-row v-if="value1">
        <el-col :span="12">
          <label for>内部工时统计图</label>
          <PieNestedChart
            chart-id="line-chart2-loopInner2"
            ref="line-chart2-loopInner2"
            v-if="inner&&value1"
          />
          <chart
            chart-id="line-chart2-loopInner"
            ref="line-chart2-loopInner"
            v-if="!inner&&value1"
          />
        </el-col>
        <el-col :span="12">
          <label for>外部工时统计图</label>
          <PieNestedChart
            chart-id="line-chart2-loop2"
            ref="line-chart2-loop2"
            v-if="outer&&value1"
          />
          <chart chart-id="line-chart2-loop" ref="line-chart2-loop" v-if="!outer&&value1" />
        </el-col>
      </el-row>
      <el-row v-else>
        <div style="padding-bottom:10px">
          <label for>工时统计图</label>
        </div>
        <el-table
          :data="exportDataTable"
          v-if="!value1"
          :border="true"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column prop="name" label="工时统计类别"></el-table-column>
          <el-table-column prop="times" label="时长"></el-table-column>
          <el-table-column label="各部门耗时" align="center">
            <el-table-column label="部门">
              <template slot-scope="scope">
                <div v-for="(item,index) of scope.row.depts" :key="index">{{item.dept}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="depts.times" label="时长">
              <template slot-scope="scope">
                <div v-for="(item,index) of scope.row.depts" :key="index">{{item.times}}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- 提交审核次数统计 +table-->
    <template v-if="show_inner">
      <el-row v-if="value1">
        <el-col :span="12">
          <label for>内审提交统计</label>
          <!-- 图表组件 -->
          <chart ref="commit-inner" chart-id="commit-inner" />
        </el-col>
        <el-col :span="12">
          <label for>外审提交统计</label>
          <!-- 图表组件 -->
          <chart ref="commit-outer" chart-id="commit-outer" />
        </el-col>
      </el-row>
      <el-row v-else>
        <div style="padding-top:10px">
          <div style="padding-bottom:10px">
            <label for>提交审核次数统计</label>
          </div>
          <el-table
            :data="approveTimeTable"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column prop="name" label="提交类型"></el-table-column>
            <el-table-column label="提交记录" align="center">
              <el-table-column label="人员名称">
                <template slot-scope="scope">
                  <div v-for="(item,index) of scope.row.users" :key="index">{{item.submit_name}}</div>
                </template>
              </el-table-column>
              <el-table-column label="提交次数">
                <template slot-scope="scope">
                  <div v-for="(item,index) of scope.row.users" :key="index">{{item.num}}</div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </template>
    <!-- 资产实际耗时与计划耗时top10 +table-->
    <template>
      <el-divider />
      <div style="margin-top:40px">
        <el-row>
          <el-col :span="12" v-if="plan">
            <BarChart
              ref="assetTimePlan"
              chart-id="assetTimePlan"
              style="height:400px"
              v-if="value1"
            />
            <div v-else>
              <div style="padding-bottom:10px">
                <label for>资产计划耗时Top10</label>
              </div>
              <el-table
                :data="assetTimePlan"
                :border="true"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="asset_name" label="资产名称"></el-table-column>
                <el-table-column prop="delta" label="计划耗时"></el-table-column>
                <el-table-column prop="actual_delta" label="实际耗时"></el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="12" v-if="actual">
            <BarChart
              ref="assetTimeActual"
              chart-id="assetTimeActual"
              style="height:400px"
              v-if="value1"
            />
            <div v-else>
              <div style="padding-bottom:10px">
                <label for>资产实际耗时Top10</label>
              </div>
              <el-table
                :data="assetTimeActual"
                :border="true"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="asset_name" label="资产名称"></el-table-column>
                <el-table-column prop="delta" label="实际耗时"></el-table-column>
                <el-table-column prop="plan_delta" label="计划耗时"></el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- 镜头和任务分布 +table -->
    <template v-if="asssetTask">
      <el-divider />
      <div style="margin-top:40px">
        <el-row v-if="value1">
          <!-- 柱状图组件 -->
          <BarChart ref="task-count" chart-id="task-count" style="height:400px" />
        </el-row>
        <el-row v-else>
          <div style="padding-bottom:10px">
            <label for>镜头和任务分布</label>
          </div>
          <el-table
            :data="assetTaskTable"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column prop="user" label="人员名称"></el-table-column>
            <el-table-column prop="asset" label="拥有资产数量"></el-table-column>
            <el-table-column prop="task" label="拥有任务数量"></el-table-column>
          </el-table>
        </el-row>
      </div>
    </template>
    <!-- 总成绩排名 +table-->
    <template v-if="$route.query.type == 0&&showGrade">
      <el-divider />
      <el-row v-if="value1">
        <!-- 柱状图组件 -->
        <BarChart ref="grade" chart-id="grade" style="height:400px" />
      </el-row>
      <el-row v-else>
        <div style="padding-bottom:10px">
          <label for>总成绩排名</label>
        </div>
        <el-table
          :data="gradeTable"
          :border="true"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="name" label="练习生"></el-table-column>
          <el-table-column prop="grade" label="总成绩"></el-table-column>
        </el-table>
      </el-row>
    </template>

    <el-divider />
    <!-- 甘特图组件  +table-->
    <div class="gantt-header">
      <h4>项目各部门工时统计</h4>
      <div class="query-parent" v-if="value1">
        <el-select v-model="deptChoose" multiple placeholder="筛选工种">
          <el-option
            v-for="(item,index) of deptList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getGantt()">开始统计</el-button>
        <el-button type="primary" @click="refreshDept()">重置</el-button>
      </div>
    </div>
    <Gantt
      v-if="value1"
      v-loading="ganttLoading"
      id="gantt"
      :gantt-data="ganttData"
      :customOptions="ganttTasks"
      :customHeaderOption="GanttHeader"
    />
    <div v-if="!value1">
      <el-table
        :data="projectGantTable"
        :border="true"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column label="部门名称" prop="deptname"></el-table-column>
        <el-table-column label="开始时间" prop="start">
          <template slot-scope="scope">{{scope.row.start|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="结束时间" prop="end">
          <template slot-scope="scope">{{scope.row.end|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="总工时" prop="last"></el-table-column>
      </el-table>
    </div>
    <!-- 甘特图组件 +table -->
    <el-divider />
    <div class="gantt-header">
      <h4>人员工时统计</h4>
      <div class="query-parent" v-if="value1">
        <el-select v-model="userChoose" multiple laceholder="筛选人员">
          <el-option
            v-for="(item,index) of userList"
            :key="index"
            :label="item.username"
            :value="item.userid"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="userChange()">开始统计</el-button>
        <el-button type="primary" @click="refreshUser()">重置</el-button>
      </div>
    </div>
    <Gantt
      v-loading="ganttStatLoading"
      :gantt-data="ganttStatData"
      :customHeaderOption="customHeaderOption"
      :customOptions="customOptions"
      v-if="value1"
    />
    <div v-if="!value1">
      <el-table
        :data="userGantTable"
        :border="true"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :span-method="objectSpanMethod"
      >
        <el-table-column label="人员名称" prop="name"></el-table-column>
        <el-table-column label="开始时间" prop="start">
          <template slot-scope="scope">{{scope.row.start|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="结束时间" prop="end">
          <template slot-scope="scope">{{scope.row.end|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="计划工时（小时）" prop="plan"></el-table-column>
        <el-table-column label="实际工时（小时）" prop="actual"></el-table-column>
        <el-table-column label="进度" prop="progress">
          <template slot-scope="scope">
            <el-progress :stroke-width="12" :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as Ajax from "@/api/statistics";
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import PieNestedChart from "@/components/ECharts/PieNestedChart";
import dayjs from "dayjs";
export default {
  name: "all-statistics",
  components: { Chart, Gantt, LineChart, BarChart, PieNestedChart },
  props: ["click_id"],
  data() {
    return {
      showGrade: true,
      asssetTask: true,
      burnShow: true,
      inner: null,
      outer: null,
      deptList: [],
      deptChoose: [],
      userList: [],
      userChoose: [],
      user: [],
      ganttStatLoading: false,
      ganttLoading: false,
      ganttData: [], // 传给甘特图1的数据
      ganttStatData: [], // 传给甘特图2的数据
      projectProgress: 0,
      HttpParams: {
        // http传参对象
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
      //甘特图1的header配置,
      GanttHeader: {
        title: {
          label: ""
        }
      },
      //甘特图2 的header配置,
      customHeaderOption: {
        title: {
          label: ""
        }
      },
      //甘特图2的配置
      customOptions: {
        taskList: {
          //甘特图中的表格配置
          columns: [
            {
              id: 1,
              label: "人员名称",
              value: task => {
                if (task.parentId) {
                  return "";
                } else {
                  return task.name;
                }
              },
              width: 130,
              expander: true // 显示 "+" 拓展图标
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 100,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 100
            },
            {
              id: 4,
              label: "计划工时",
              value: "preinstall",
              width: 80
            },
            {
              id: 5,
              label: "实际工时",
              value: "actual",
              width: 80
            },
            {
              id: 6,
              label: "进度",
              value: task => `${task.progress}%`,
              width: 80,
              html: true
            }
          ]
        }
      },
      //甘特图1的配置
      ganttTasks: {
        taskList: {
          columns: [
            {
              id: 1,
              label: "工种名称",
              value: "label",
              width: 150
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 100,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 100
            },
            {
              id: 4,
              label: "总工时",
              value: "manhour",
              width: 80
            }
          ]
        }
      },
      assetTimePlan: [],
      assetTimeActual: [],
      plan: true,
      actual: true,
      value1: true,
      assetStatusTable: [],
      taskStatusTable: [],
      userGantTable: [],
      projectGantTable: [],
      burnOutTable: [],
      exportDataTable: [],
      approveTimeTable: [],
      assetTaskTable: [],
      gradeTable: []
    };
  },
  computed: {
    groupNum() {
      return new Set(this.userGantTable.map(item => item.name));
    }
  },
  watch: {
    value1: {
      handler: function(newVal, oldVal) {
        if (newVal == true) {
          this.getProjectProgress();
          this.getGantt();
          this.getganttStat();
          this.getAssetStatistics();
          this.getTaskStatistics();
          this.getBurnOut();
          this.exportData();
          this.getCommitCount();
          this.getAssetTask();
          this.getGradeChange();
          this.getAssetTimes();
        }
      }
    }
  },
  methods: {
    //指定进度条文字内容。
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    },
    //获取项目进度
    getProjectProgress() {
      Ajax.getProjectStatistic({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        this.projectProgress = data.msg.replace("%", "") - 0;
      });
    },
    //获取镜头状态统计  并传参调用图表组件的初始化方法
    getAssetStatistics() {
      // this.$refs["asset-chart"].openLoading();
      Ajax.getAssetStatistic({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.assetStatusTable = chartData;
        this.$refs["asset-chart"].initChart("", chartData);
      });
    },
    //获取任务状态统计  并传参调用图表组件的初始化方法
    getTaskStatistics() {
      // this.$refs["task-chart"].openLoading();
      Ajax.getTaskStatistic({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.taskStatusTable = chartData;
        this.$refs["task-chart"].initChart("", chartData);
      });
    },
    //获取项目参与人员
    getUser() {
      Ajax.getProjectMember({ id: this.$route.params.id, members: "" }).then(
        ({ data }) => {
          this.userList = [...data.msg];
        }
      );
    },
    userChange() {
      this.user = [];
      this.userList.forEach(item => {
        this.userChoose.forEach(t => {
          if (t === item.userid) {
            this.user.push({ name: item.username });
          }
        });
      });
      // console.log(this.user);
      // this.user =Array.from(this.user);
      // console.log(this.user)
      this.getganttStat();
    },
    //甘特图处理table数据
    Group(name) {
      return this.userGantTable.filter(item => item.name == name).length;
    },
    NameLen(name) {
      const tmp = Array.from(this.groupNum);
      const index = tmp.indexOf(name);
      let len = 0;
      for (let i = 0; i < index; i++) {
        len += this.Group(tmp[i]);
      }
      return len;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const len = this.Group(row.name);
        const lenName = this.NameLen(row.name);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    //重置人员甘特图
    refreshUser() {
      this.userChoose = [];
      this.user = [];
      this.getganttStat();
    },
    //获取甘特图2数据--人员
    getganttStat() {
      this.ganttStatLoading = true;
      this.ganttStatData = [];
      Ajax.getingExecutorChart({
        id: this.click_id ? this.click_id : this.$route.params.id,
        executors: ""
      })
        .then(({ data }) => {
          this.userGantTable = [];
          let arr = [...data.msg];
          console.log(arr,'arr')
          arr.map(item => {
            this.userGantTable.push({
              id: item[0],
              name: item[1],
              start: item[2],
              end: item[3],
              plan: item[4],
              progress: item[5],
              actual: item[6]
            });
          });
          if (this.user.length) {
            // this.ganttStatData = [];
            arr.map((t, i) => {
              this.user.forEach(item => {
                if (t[1] === item.name) {
                  let obj = {
                    id: t[0], // *
                    type: "task", // * 甘特图内图形显示类型
                    start: t[2] * 1000, // *任务开始时间
                    end: t[3] * 1000,
                    progress: t[5] || 0, // *进度
                    duration: t[4] * 60 * 60 * 1000, // *工时
                    label: `${t[1]} (${t[5] || 0}%)`, // *
                    collapsed: false, // * 有子节点默认是否收缩
                    name: t[1],
                    preinstall: t[4],
                    actual: t[6]
                  };
                  if (t[7]) {
                    obj.parentId = t[7];
                  }
                  this.ganttStatData.push(obj);
                }
              });
              console.log(this.ganttStatData,'this.ganttStatData')
            });
          } else {
            this.ganttStatData = [];
            this.ganttStatData = arr.map((t, i) => {
              let obj = {
                id: t[0], // *
                type: "task", // * 甘特图内图形显示类型
                start: t[2] * 1000, // *任务开始时间
                end: t[3] * 1000,
                progress: t[5] || 0, // *进度
                duration: t[4] * 60 * 60 * 1000, // *工时
                label: `${t[1]} (${t[5] || 0}%)`, // *
                collapsed: false, // * 有子节点默认是否收缩
                name: t[1],
                preinstall: t[4],
                actual: t[6]
              };
              if (t[7]) {
                obj.parentId = t[7];
              }
              return obj;
            });
          }
          // console.log(this.ganttStatData);
        })
        .finally(() => {
          this.ganttStatLoading = false;
        });
    },
    //重置部门甘特图
    refreshDept() {
      this.deptChoose = [];
      this.getGantt();
    },
    //获取甘特图1数据
    getGantt() {
      this.ganttData = [];
      this.ganttLoading = true;
      Ajax.getGanttData({
        id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        this.projectGantTable = [];
        const arr = [...data.msg];
        this.projectGantTable = [...data.msg];
        //获取项目的部门信息
        this.deptList = arr.map(t => {
          return {
            id: t.deptid,
            name: t.deptname
          };
        });
        this.ganttLoading = false;

        if (this.deptChoose.length) {
          // this.ganttData = [];
          arr.map((t, i, Arr) => {
            this.deptChoose.forEach(item => {
              if (t.deptid === item) {
                // console.log(t)
                this.ganttData.push({
                  id: t.deptid,
                  label: t.deptname,
                  type: "task", //线条样式
                  start: t.start * 1000, //开始时间
                  end: t.end * 1000, //结束时间
                  duration: t.last * 60 * 60 * 1000,
                  manhour: t.last
                });
              }
            });
          });
        } else {
          this.ganttData = [];
          arr.map((t, i, Arr) => {
            // console.log(t)
            this.ganttData.push({
              id: t.deptid,
              label: t.deptname,
              type: "task", //线条样式
              start: t.start * 1000, //开始时间
              end: t.end * 1000, //结束时间
              duration: t.last * 60 * 60 * 1000, //工时
              manhour: t.last
            });
          });
        }

        // console.log(this.ganttData);
      });
    },
    //获取燃尽图数据
    getBurnOut() {
      // this.$refs["line-chart1"].openLoading();
      Ajax.burnOut({
        id: this.click_id ? this.click_id : this.$route.params.id,
        bourout: ""
      }).then(({ data }) => {
        if (data.status === 0) {
          if (!data.dates.length) {
            this.burnShow = false;
            return;
          }
          data.dates.map((item, index) => {
            this.burnOutTable.push({
              dates: item,
              plan_worktimes: data.plan_worktimes[index],
              real_worktimes: data.real_worktimes[index]
            });
          });
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
      });
    },
    //外包数据
    exportData() {
      Ajax.exportTask({
        id: this.click_id ? this.click_id : this.$route.params.id,
        worktime: ""
      }).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let plan_depts = [];
        Object.keys(data.msg.plan_depts).map(item => {
          plan_depts.push({ dept: item, times: data.msg.plan_depts[item] });
        });
        let real_depts = [];
        Object.keys(data.msg.real_depts).map(item => {
          real_depts.push({ dept: item, times: data.msg.real_depts[item] });
        });
        let outsource_plan_depts = [];
        Object.keys(data.msg.outsource_plan_depts).map(item => {
          outsource_plan_depts.push({
            dept: item,
            times: data.msg.outsource_plan_depts[item]
          });
        });
        let outsource_real_depts = [];
        Object.keys(data.msg.outsource_real_depts).map(item => {
          outsource_real_depts.push({
            dept: item,
            times: data.msg.outsource_real_depts[item]
          });
        });
        this.exportDataTable = [
          {
            name: "内部计划工时统计",
            times: data.msg.plan_inner,
            depts: plan_depts
          },
          {
            name: "外部计划工时统计",
            times: data.msg.plan_outsource,
            depts: outsource_plan_depts
          },
          {
            name: "内部实际工时统计",
            times: data.msg.real_inner,
            depts: real_depts
          },
          {
            name: "外部实际工时统计",
            times: data.msg.real_outsource,
            depts: outsource_real_depts
          }
        ];

        if (
          data.msg.plan_inner == 0 &&
          data.msg.plan_outsource == 0 &&
          data.msg.real_inner == 0 &&
          data.msg.real_outsource == 0
        ) {
          //两个饼图
          this.inner = false;
          this.outer = false;
          let chartData_loop = keys.map(t => {
            switch (t) {
              case "plan_outsource":
                return { name: "外包总计划", value: data.msg[t] };

              case "real_outsource":
                return { name: "外包总实际", value: data.msg[t] };
            }
          });
          let chartData_loopInner = keys.map(t => {
            switch (t) {
              case "plan_inner":
                return { name: "内部总计划", value: data.msg[t] };

              case "real_inner":
                return { name: "内部总实际", value: data.msg[t] };
            }
          });
          this.$nextTick(() => {
            this.$refs["line-chart2-loop"].initChart("", chartData_loop);
            this.$refs["line-chart2-loopInner"].initChart(
              "",
              chartData_loopInner
            );
          });
          return;
        } else if (
          (data.msg.plan_inner !== 0 || data.msg.real_inner !== 0) &&
          (data.msg.plan_outsource !== 0 || data.msg.real_outsource !== 0)
        ) {
          //两个环形图
          this.inner = true;
          this.outer = true;
          let obj = [
            ...Object.keys(data.msg.outsource_plan_depts),
            ...Object.keys(data.msg.outsource_real_depts)
          ];
          let objInner = [
            ...Object.keys(data.msg.plan_depts),
            ...Object.keys(data.msg.real_depts)
          ];
          let values = [
            ...Object.values(data.msg.outsource_plan_depts),
            ...Object.values(data.msg.outsource_real_depts)
          ];
          let valuesInner = [
            ...Object.values(data.msg.plan_depts),
            ...Object.values(data.msg.real_depts)
          ];
          let chartData = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: obj
            },
            series: [
              {
                name: "工时",
                type: "pie",
                selectedMode: "single",
                radius: [0, "30%"],

                label: {
                  normal: {
                    position: "inner"
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: keys.map(t => {
                  switch (t) {
                    case "plan_outsource":
                      return { name: "外包总计划", value: data.msg[t] };
                    case "real_outsource":
                      return { name: "外包总实际", value: data.msg[t] };
                  }
                })
              },
              {
                name: "工时",
                type: "pie",
                radius: ["40%", "55%"],
                data: obj.map((t, index) => {
                  return { name: t, value: values[index] };
                })
              }
            ]
          };
          let chartData_inner = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: objInner
            },
            series: [
              {
                name: "工时",
                type: "pie",
                selectedMode: "single",
                radius: [0, "30%"],

                label: {
                  normal: {
                    position: "inner"
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: keys.map(t => {
                  switch (t) {
                    case "plan_inner":
                      return { name: "内部总计划", value: data.msg[t] };
                    case "real_inner":
                      return { name: "内部总实际", value: data.msg[t] };
                  }
                })
              },
              {
                name: "工时",
                type: "pie",
                radius: ["40%", "55%"],
                data: objInner.map((t, index) => {
                  return { name: t, value: valuesInner[index] };
                })
              }
            ]
          };
          this.$nextTick(() => {
            this.$refs["line-chart2-loopInner2"].initChart(chartData_inner);
            this.$refs["line-chart2-loop2"].initChart(chartData);
          });
        } else {
          if (
            data.msg.plan_inner == 0 &&
            data.msg.real_inner == 0 &&
            (data.msg.plan_outsource !== 0 || data.msg.real_outsource !== 0)
          ) {
            //内部为饼图，外部为环形图
            this.inner = false;
            this.outer = true;
            let obj = [
              ...Object.keys(data.msg.outsource_plan_depts),
              ...Object.keys(data.msg.outsource_real_depts)
            ];
            let values = [
              ...Object.values(data.msg.outsource_plan_depts),
              ...Object.values(data.msg.outsource_real_depts)
            ];
            let chartData_loopInner = keys.map(t => {
              switch (t) {
                case "plan_inner":
                  return { name: "内部总计划", value: data.msg[t] };

                case "real_inner":
                  return { name: "内部总实际", value: data.msg[t] };
              }
            });
            let chartData = {
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                x: "left",
                data: obj
              },
              series: [
                {
                  name: "工时",
                  type: "pie",
                  selectedMode: "single",
                  radius: [0, "30%"],

                  label: {
                    normal: {
                      position: "inner"
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: keys.map(t => {
                    switch (t) {
                      case "plan_outsource":
                        return { name: "外包总计划", value: data.msg[t] };
                      case "real_outsource":
                        return { name: "外包总实际", value: data.msg[t] };
                    }
                  })
                },
                {
                  name: "工时",
                  type: "pie",
                  radius: ["40%", "55%"],
                  data: obj.map((t, index) => {
                    return { name: t, value: values[index] };
                  })
                }
              ]
            };
            this.$nextTick(() => {
              this.$refs["line-chart2-loopInner"].initChart(
                "",
                chartData_loopInner
              );
              this.$refs["line-chart2-loop2"].initChart(chartData);
            });
          } else {
            //内部为环形图，外部为饼图
            this.inner = true;
            this.outer = false;
            let objInner = [
              ...Object.keys(data.msg.plan_depts),
              ...Object.keys(data.msg.real_depts)
            ];

            let valuesInner = [
              ...Object.values(data.msg.plan_depts),
              ...Object.values(data.msg.real_depts)
            ];
            let chartData_inner = {
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                x: "left",
                data: objInner
              },
              series: [
                {
                  name: "工时",
                  type: "pie",
                  selectedMode: "single",
                  radius: [0, "30%"],

                  label: {
                    normal: {
                      position: "inner"
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: keys.map(t => {
                    switch (t) {
                      case "plan_inner":
                        return { name: "内部总计划", value: data.msg[t] };
                      case "real_inner":
                        return { name: "内部总实际", value: data.msg[t] };
                    }
                  })
                },
                {
                  name: "工时",
                  type: "pie",
                  radius: ["40%", "55%"],
                  data: objInner.map((t, index) => {
                    return { name: t, value: valuesInner[index] };
                  })
                }
              ]
            };
            let chartData_loop = keys.map(t => {
              switch (t) {
                case "plan_outsource":
                  return { name: "外包总计划", value: data.msg[t] };

                case "real_outsource":
                  return { name: "外包总实际", value: data.msg[t] };
              }
            });
            this.$nextTick(() => {
              this.$refs["line-chart2-loopInner2"].initChart(chartData_inner);
              this.$refs["line-chart2-loop"].initChart("", chartData_loop);
            });
          }
        }
      });
    },
    //获取项目提交次数统计数据
    getCommitCount() {
      Ajax.proCommitCount({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        if (!data.inner_num.length) {
          this.show_inner = false;
        }
        this.approveTimeTable = [
          {
            name: "内部审核",
            users: data.inner_num
          },
          {
            name: "外部审核",
            users: data.out_num
          }
        ];
        let chartData = data.inner_num.map(t => {
          return { name: t.submit_name, value: t.num };
        });
        let chartData2 = data.out_num.map(t => {
          return { name: t.submit_name, value: t.num };
        });
        this.$refs["commit-inner"].initChart("", chartData);
        this.$refs["commit-outer"].initChart("", chartData2);
      });
    },
    //获取资产耗时
    getAssetTimes() {
      Ajax.assetTime({ project_id: this.$route.params.id }).then(({ data }) => {
        if (data.status === 0) {
          this.assetTimePlan = [...data.plan];
          this.assetTimeActual = [...data.actual];
          if (!Object.keys(this.assetTimePlan).length) {
            this.plan = false;
          } else {
            let keys = [];
            let data = [];
            let actual_delta = [];
            this.assetTimePlan.map(item => {
              keys.push(item.asset_name);
              data.push(item.delta);
              actual_delta.push(item.actual_delta);
            });

            let customOption = {
              title: {
                text: "资产计划耗时Top10",
                textStyle: {
                  //---主标题内容样式
                  color: "#000"
                  // height:"50px"
                },
                padding: [3, 0, 0, 0] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow"
                }
              },
              legend: {
                data: ["计划耗时", "实际耗时"]
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
                    rotate: 30,
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
                  name: "计划耗时",
                  type: "bar",
                  barWidth: 15,
                  data: data
                },
                {
                  name: "实际耗时",
                  type: "bar",
                  barWidth: 15,
                  data: actual_delta
                }
              ]
            };
            this.$refs["assetTimePlan"].initChart(customOption);
          }
          if (!Object.keys(this.assetTimeActual).length) {
            this.actual = false;
          } else {
            let keys2 = [];
            let data2 = [];
            let plan_delta = [];

            this.assetTimeActual.map(item => {
              keys2.push(item.asset_name);
              data2.push(item.delta);
              plan_delta.push(item.plan_delta);
            });

            let customOption2 = {
              title: {
                text: "资产实际耗时Top10",
                textStyle: {
                  //---主标题内容样式
                  color: "#000"
                  // height:"50px"
                },
                padding: [3, 0, 0, 0] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow"
                }
              },
              legend: {
                data: ["实际耗时", "计划耗时"]
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
                  data: keys2,
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
                  name: "实际耗时",
                  type: "bar",
                  barWidth: 15,
                  data: data2
                },
                {
                  name: "计划耗时",
                  type: "bar",
                  barWidth: 15,
                  data: plan_delta
                }
              ]
            };
            this.$refs["assetTimeActual"].initChart(customOption2);
          }
        }
      });
    },
    //统计项目成员的资产和任务信息
    getAssetTask() {
      Ajax.statisticMemberDetail({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        if (!data.user_id_list.length) {
          this.asssetTask = false;
          return;
        }
        let keys = Object.keys(data.task);
        let keys2 = Object.keys(data.user_asset);
        this.assetTaskTable = data.user_id_list.map((item, index) => {
          return {
            id: item,
            user: keys[index],
            task: data.task[keys[index]],
            asset: data.user_asset[keys2[index]]
          };
        });
        let customOption = {
          title: {
            text: "镜头和任务分布",
            textStyle: {
              //---主标题内容样式
              color: "#000"
              // height:"50px"
            },
            padding: [3, 0, 100, 100] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
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
              // nameGap :15,
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
              barWidth: 30,
              data: keys2.map(t => {
                return data.user_asset[t];
              })
            },
            {
              name: "任务个数",
              type: "bar",
              barWidth: 30,
              barMaxWidth: 50,
              barCategoryGap:'30%',
              barGap:'0%',
              data: keys.map(t => {
                return data.task[t];
              })
            }
          ]
        };
        this.$refs["task-count"].initChart(customOption);
      });
    },
    //成绩变化
    getGradeChange() {
      Ajax.MemberSort({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        data.sorted_grade.map((item, index) => {
          this.gradeTable.push({ name: item[0], grade: item[1] });
        });
        if (!data.sorted_grade.length) {
          this.showGrade = false;
          return;
        }
        let keys = Object.keys(data.sum_grade);
        // console.log("2222");
        // console.log(keys)
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
              barWidth: 30,
              barMaxWidth: 50,
              data: keys.map(t => {
                return data.sum_grade[t];
              })
            }
          ]
        };
        // let chartData2 =
        this.$refs["grade"].initChart(customOption);
      });
    }
  },
  created() {
    this.getUser();
  },
  mounted() {
    this.getProjectProgress();
    this.getGantt();
    this.getganttStat();
    this.getAssetStatistics();
    this.getTaskStatistics();
    this.getBurnOut();
    this.exportData();
    this.getCommitCount();
    this.getAssetTask();
    this.getGradeChange();
    this.getAssetTimes();
  }
};
</script>
<style lang="scss" scoped>
#statistics {
  position: relative;
  width: 100%;
}
.el-select {
  width: 180px;
}

.gantt-header {
  position: relative;
  .query-parent {
    position: absolute;
    bottom: -40px;
    text-align: left;
  }
}
</style>