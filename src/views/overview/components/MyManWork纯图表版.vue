<template>
  <el-card shadow="always" :body-style="{height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span>我的工时</span>
      <el-button type="text" @click="isDialogShow = true">填报工时</el-button>
    </el-row>
    <div class="man-work">
      <div class="pei-warp">
        <PieNestedChart ref="home-pei-chart" chart-id="home-pei-chart" height="100%" />
      </div>
      <div class="chart-warp">
        <MyCharts ref="radar" chart-id="radar-chart" height="100%" />
      </div>
      <div class="pei-warp">
        <PieNestedChart ref="home-pei-chart2" chart-id="home-pei-chart2" height="100%" />
        <!-- <el-row v-if="this.totalCount !==0"> -->
        <!--   <el-col :span="8" :offset="9"> -->
        <!--     <div -->
        <!--       style="font-size:13px;color:#909399;margin-top:-50px;" -->
        <!--       v-if="this.totalCount <= 8 && this.totalCount != 0" -->
        <!--     >感谢您的付出.</div> -->
        <!--   </el-col> -->
        <!--   <el-col :span="8" :offset="10"> -->
        <!--     <div -->
        <!--       style="font-size:13px;color:#909399;margin-top:-50px;" -->
        <!--       v-if="this.totalCount > 8 " -->
        <!--     >辛苦了.</div> -->
        <!--   </el-col> -->
        <!-- </el-row> -->
        <!-- <el-table :data="workhouerlist"> -->
        <!--   <el-table-column prop="time" label="时间" width="60"></el-table-column> -->
        <!--   <el-table-column label="总工时" prop="total_count" width="60"></el-table-column> -->
        <!--   <el-table-column label="任务" prop="task_count" width="60"></el-table-column> -->
        <!--   <el-table-column label="加班" prop="overtime_count" width="60"></el-table-column> -->
        <!-- </el-table> -->
      </div>
    </div>

    <el-dialog :visible.sync="isDialogShow" width="460px">
      <h4 slot="title">工时填报</h4>
      <el-form
        :model="TaskForm"
        label-width="80px"
        label-position="left"
        :rules="rules"
        ref="taskForm"
      >
        <el-form-item label="选择任务" prop="task_id">
          <el-select v-model="TaskForm.task_id" placeholder="请选择填报任务" @change="selMyTask">
            <el-option
              v-for="item in MyStandardTaskList"
              :key="item.task.id"
              :label="item.task.name"
              :value="item.task.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="TaskForm.title"></el-input>
        </el-form-item>
        <el-form-item label="完成内容" prop="content">
          <el-input type="textarea" v-model="TaskForm.content"></el-input>
        </el-form-item>
        <el-form-item label="完成进度" prop="content">
          <el-row type="flex" align="middle">
            <el-col :span="10">
              <el-input-number
                v-model="TaskForm.schedule"
                :min="0"
                :max="100"
                :step="10"
                @blur="BlurText($event)"
              ></el-input-number>
            </el-col>
            <el-col :span="14">
              <el-progress
                :percentage="TaskForm.schedule"
                :color="customColors"
                :text-inside="true"
                :stroke-width="20"
              ></el-progress>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="剩余工时">{{leaveTime?leaveTime:0}}</el-form-item>
        <el-form-item label="工时 (h)" prop="labor_hour">
          <el-input-number
            :disabled="leaveTime?false:true"
            v-model="TaskForm.labor_hour"
            placeholder="小时"
            :min="0"
            :max="leaveTime < 24? leaveTime: 24"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="TaskForm.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitWorkHourFrom"
          :loading="submitLoading"
          :disabled="leaveTime?false:true"
        >提交</el-button>
      </span>
    </el-dialog>
  </el-card>
  <!-- <el-row>
      <el-col :span="12">本周工时(h)：{{weekHour.total_count}}</el-col>
      <el-col :span="12">本月工时(h)：{{monthHour.total_count}}</el-col>
  </el-row>-->
</template>

<script>
import PieNestedChart from "@/components/ECharts/PieNestedChart";
import MyCharts from "@/components/ECharts/BaseECharts";
import { getMyManHour } from "@/api/manHour";
import { addTaskRecord, queryTask } from "@/api/task";
import AXIOS from "axios";
import dayjs from "dayjs";
let option = {
  tooltip: {
    formatter: "{a} <br/>{c} {b}"
  },
  grid: {
    x: 0, //默认是80px
    y: 0, //默认是60px
    x2: 0, //默认80px
    y2: 0, //默认60px
    bottom: 0 //距离容器下边界30像素
  },
  series: [
    {
      name: "工时",
      type: "gauge",
      center: ["50%", "50%"], // 默认全局居中
      min: 0,
      max: 24,
      radius: "100%",
      splitNumber: 12, //max/splitNumber每个刻度代表多少
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: [[0.167, "#91c7ae"], [0.334, "#63869e"], [1, "#c23531"]],
          width: 10
        }
      },
      axisTick: {
        // 坐标轴小标记
        length: 0 // 属性length控制线长
      },
      splitLine: {
        // 分隔线
        length: 14, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle（详见lineStyle）控制线条样式
          color: "auto"
        }
      },
      title: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontSize: 12
      }
    }
  ]
};
export default {
  components: {
    MyCharts,
    PieNestedChart
  },
  props: {
    MyStandardTaskList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      leaveTime: 0,
      totalCount: "",
      TaskForm: {
        type: 0,
        date: dayjs().format("YYYY/MM/DD"),
        task_id: null,
        labor_hour: 0
      },
      rules: {
        labor_hour: [
          { required: true, message: "请输入工时", trigger: "blur" }
        ],
        task_id: [{ required: true, message: "请选择任务", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入完成内容", trigger: "blur" }],
        schedule: [
          { required: true, message: "请输入完成进度", trigger: "blur" }
        ],
        date: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
      },
      weekHour: {},
      monthHour: {},
      isDialogShow: false,
      submitLoading: false,
      customColors: [
        {
          color: "#f56c6c",
          percentage: 20
        },
        {
          color: "#e6a23c",
          percentage: 40
        },
        {
          color: "#6f7ad3",
          percentage: 60
        },
        {
          color: "#1989fa",
          percentage: 80
        },
        {
          color: "#5cb87a",
          percentage: 100
        }
      ]
    };
  },
  computed: {
    workhouerlist() {
      return [
        {
          time: "近一周",
          task_count: this.weekHour.task_count,
          overtime_count: this.weekHour.overtime_count,
          total_count: this.weekHour.total_count
        },
        {
          time: "近一月",
          task_count: this.monthHour.task_count,
          overtime_count: this.monthHour.overtime_count,
          total_count: this.monthHour.total_count
        }
      ];
    }
  },
  mounted() {
    this.getMyWorkHours();
  },
  methods: {
    //进度输入框限制只能输入整数
    BlurText(e) {
      let boolean = new RegExp("^[1-9][0-9]*$").test(e.target.value);
      if (!boolean) {
        this.$message.error("请输入正整数");
        e.target.value = "0";
        this.TaskForm.schedule = "";
      }
    },
    selMyTask(val) {
      queryTask({ id: val }).then(({ data }) => {
        this.leaveTime = data.msg.surplus_labor_hour;
      });
    },
    getMyWorkHours() {
      let today = dayjs().format("YYYY/MM/DD");
      let params = { total_count: "", end: today };
      //查询当天
      getMyManHour({ ...params, start: today }).then(({ data }) => {
        option.series[0].data = [{ value: data.total_count, name: "今日(h)" }];
        this.totalCount = data.total_count;
        this.$refs.radar.initChart(option);
      });
      //查询近一周
      let httpFn = [
        getMyManHour({
          ...params,
          start: dayjs()
            .subtract(1, "week")
            .format("YYYY/MM/DD")
        }),
        getMyManHour({
          ...params,
          start: dayjs()
            .subtract(1, "month")
            .format("YYYY/MM/DD")
        })
      ];
      AXIOS.all(httpFn).then(
        AXIOS.spread((...arg) => {
          this.weekHour = arg[0].data;
          this.monthHour = arg[1].data;
          let option2 = {
            title:{
              text:`近一周(h):${this.weekHour.total_count}`,
              textAlign:'left',
              textStyle:{
                fontSize:12,
                fintWeigt:'normal',
              },
              top:0,
              left:"center",
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}工时: {c} ({d}%)"
            },
            series: [
              {
                name: "近一周",
                label: {
                  normal: {
                    position: "inner"
                  }
                },
                type: "pie",
                radius: [0, '80%'],
                data: [
                  { value: this.weekHour.overtime_count, name: "加班" },
                  { value: this.weekHour.task_count, name: "任务" }
                ]
              },
            ]
          };
          let option3 = {
            title:{
              text:`近一月(h):${this.monthHour.total_count}`,
              textAlign:'left',
              textStyle:{
                fontSize:12,
                fintWeigt:'normal',
              },
              top:0,
              left:"center",
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}工时: {c} ({d}%)"
            },
            series: [
              {
                name: "近一月",
                label: {
                  normal: {
                    position: "inner"
                  }
                },
                type: "pie",
                radius: [0, '80%'],
                data: [
                  { value: this.monthHour.overtime_count, name: "加班" },
                  { value: this.monthHour.task_count, name: "任务" }
                ]
              }
            ]
          };
          this.$refs["home-pei-chart"].initChart(option2);
          this.$refs["home-pei-chart2"].initChart(option3);
        })
      );
    },
    submitWorkHourFrom() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          addTaskRecord(this.TaskForm)
            .then(({ data }) => {
              if (data.status === 0) {
                this.getMyWorkHours();
                this.$message.success(data.msg);
                this.isDialogShow = false;
              } else {
                this.$message.warning(data.msg);
              }
            })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.man-work {
  height: 100%;
  width: 100%;
  display: flex;
  .chart-warp {
    flex: 0 0 40%;
  }
  .pei-warp{
    flex: 0 0 30%;
  }
}
</style>