<template>
  <div>
    <div style="padding-top:15px">
      <el-row>
        <el-col :span="4">
          <el-switch v-model="value1" active-text="图表" inactive-text="表格"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="19">
          <div style="width:100%;padding-top:15px">
            <!-- 燃尽图 +table -->
            <template v-if="burnShow">
              <el-row>
                <LineChart chart-id="line-chart2" ref="line-chart2" v-if="value1" />
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
          </div>
        </el-col>
        <!-- 超期的镜头数量 +table-->
        <el-col :span="5" align="middle">
          <div style="padding:17px 0px">
            <label for>超期镜头数量</label>
          </div>
          <chart ref="asset-chart1" chart-id="asset-chart1" v-if="value1" />
          <el-table
            :data="overdueNum"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width:180px"
            v-if="!value1"
          >
            <el-table-column prop="name" label="镜头状态"></el-table-column>
            <el-table-column prop="value" label="数量" width="80"></el-table-column>
          </el-table>
        </el-col>
        <!--  -->
      </el-row>
    </div>
    <el-divider />
   <!-- 任务预判断 --> 
    <div>
      <el-row>
        <el-col :span="2">
          <label for style="width:80px">任务预判断</label>
        </el-col>
        <el-col :span="4">
          <el-switch v-model="progress" active-text="滞后" inactive-text="超前"></el-switch>
        </el-col>
      </el-row>
      <div v-if="progress">
        <el-table
          :data="progressPredict "
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          style="padding-top:15px;width:100%"
          highlight-current-row
          default-expand-all
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="缩略图" align="center" width="180px">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset__image"
                style="width: 180px;height: 100px;cursor: pointer; display:block;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.asset__image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <el-image
                    :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                  ></el-image>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="asset__name" label="镜头名称" width="100"></el-table-column>
          <el-table-column prop="asset__frame" label="资产帧数" width="100">
            <template slot-scope="scope">{{scope.row.asset__frame?scope.row.asset__frame:'-'}}</template>
          </el-table-column>
          <el-table-column prop="asset__session" label="资产场次">
            <template slot-scope="scope">{{scope.row.asset__session?scope.row.asset__session:'-'}}</template>
          </el-table-column>
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="content" label="任务内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_date" label="任务开始时间">
            <template slot-scope="scope">{{scope.row.start_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="end_date" label="任务结束时间">
            <template slot-scope="scope">{{scope.row.end_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="executors" label="任务执行人"></el-table-column>
          <el-table-column prop="deviation" label="偏离值"></el-table-column>
        </el-table>
      </div>
      <div v-if="!progress">
        <el-table
          :data="progressPredict1 "
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          style="padding-top:15px;width:100%"
          highlight-current-row
          default-expand-all
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="缩略图" align="center" width="180px">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset__image"
                style="width: 180px;height: 100px;cursor: pointer; display:block;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.asset__image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <el-image
                    :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                  ></el-image>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="asset__name" label="镜头名称" width="100"></el-table-column>
          <el-table-column prop="asset__frame" label="资产帧数" width="100">
            <template slot-scope="scope">{{scope.row.asset__frame?scope.row.asset__frame:'-'}}</template>
          </el-table-column>
          <el-table-column prop="asset__session" label="资产场次">
            <template slot-scope="scope">{{scope.row.asset__session?scope.row.asset__session:'-'}}</template>
          </el-table-column>
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="content" label="任务内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_date" label="任务开始时间">
            <template slot-scope="scope">{{scope.row.start_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="end_date" label="任务结束时间">
            <template slot-scope="scope">{{scope.row.end_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="executors" label="任务执行人"></el-table-column>
          <el-table-column prop="deviation" label="偏离值"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 距离截止日期为1天还未提交的任务 -->
    <div style="padding-top:30px">
      <el-row>
        <el-col :span="20">
          <label for style="padding-top:15px">距离截止日期为1天还未提交的任务</label>
        </el-col>
      </el-row>
      <el-table
        :data="notSubmitList "
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="缩略图" align="center" width="180px">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 180px;height: 100px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="asset__name" label="镜头名称"></el-table-column>
        <el-table-column prop="asset__frame" label="资产帧数">
          <template slot-scope="scope">{{scope.row.asset__frame?scope.row.asset__frame:'-'}}</template>
        </el-table-column>
        <el-table-column prop="asset__session" label="资产场次">
          <template slot-scope="scope">{{scope.row.asset__session?scope.row.asset__session:'-'}}</template>
        </el-table-column>
        <el-table-column prop="asset__frame_range" label="帧数范围">
          <template
            slot-scope="scope"
          >{{scope.row.asset__frame_range?scope.row.asset__frame_range:'-'}}</template>
        </el-table-column>
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="content" label="制作内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="executors" label="任务执行人"></el-table-column>
        <el-table-column prop="link.content" label="环节制作内容"></el-table-column>
        <el-table-column prop="link.dept__name" label="环节工种"></el-table-column>
        <el-table-column prop="link.title" label="环节标题"></el-table-column>
      </el-table>
    </div>
    <!-- 超期的任务数量与任务执行人排名 -->
    <div style="padding-top:30px">
      <el-row>
        <el-col :span="20">
          <label for style="padding-top:15px">超期的任务数量与任务执行人排名</label>
        </el-col>
      </el-row>
      <el-table
        :data="overdueUserName"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="overdue_tasknum" label="总的超期的任务数量"></el-table-column>
        <el-table-column  label="任务执行人">
          <template slot-scope="scope">
            <div v-for="(todo,index) of scope.row.executor_overduetask" :key="index">
              {{todo.user_name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="超期的任务数量">
          <template slot-scope="scope">
            <div v-for="(todo,index) of scope.row.executor_overduetask" :key="index">
              {{todo.overdue_tasknum}}
            </div>
            
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查询项目中提交审批数目最多的资产和任务 -->
    <div style="padding-top:30px">
      <el-row>
        <el-col :span="20">
          <label for style="padding-top:15px">项目中提交审批数目最多的资产</label>
        </el-col>
      </el-row>
      <el-table
        :data="assetMaxSubmit"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
        :border="false"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="缩略图" align="center" width="180px">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 180px;height: 100px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="镜头名称"></el-table-column>
        <el-table-column prop="schedule" label="进度" width="160px">
          <template slot-scope="scope">
            <el-progress :stroke-width="12" :percentage="scope.row.schedule"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="small_status" label="小状态">
          <template slot-scope="scope">{{scope.row.small_status|taskMinStatus}}</template>
        </el-table-column>
        <el-table-column prop="task_num" label="任务数量"></el-table-column>
        <el-table-column prop="session" label="场次">
          <template slot-scope="scope">{{scope.row.session?scope.row.session:'-'}}</template>
        </el-table-column>
        <el-table-column prop="episode" label="集数">
          <template slot-scope="scope">{{scope.row.episode?scope.row.episode:'-'}}</template>
        </el-table-column>
        <el-table-column prop="frame" label="帧数">
          <template slot-scope="scope">{{scope.row.frame?scope.row.frame:'-'}}</template>
        </el-table-column>
        <el-table-column prop="frame_range" label="帧数范围" width="120px">
          <template slot-scope="scope">{{scope.row.frame_range?scope.row.frame_range:'-'}}</template>
        </el-table-column>
        <el-table-column prop="pro_reference" label="制作参考">
          <template slot-scope="scope">{{scope.row.pro_reference?scope.row.pro_reference:'-'}}</template>
        </el-table-column>
        <el-table-column prop="report" label="画面调整信息" width="120px">
          <template slot-scope="scope">{{scope.row.report?scope.row.report:'-'}}</template>
        </el-table-column>
        <el-table-column prop="retime" label="变速信息" width="120px">
          <template slot-scope="scope">{{scope.row.retime?scope.row.retime:'-'}}</template>
        </el-table-column>
        <el-table-column prop="inner_version" label="版本号" width="90px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="制作内容" width="150px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
        </el-table-column>
        <el-table-column prop="level" label="难度等级">
          <template slot-scope="scope">{{scope.row.level|Level}}</template>
        </el-table-column>
        <el-table-column prop="id" label="资产ID"></el-table-column>
        <el-table-column prop="creator_name" label="创建人"></el-table-column>
        <el-table-column prop="creator_id" label="创建人ID"></el-table-column>
        <el-table-column label="当前环节" align="center" width="160px">
          <el-table-column prop="link" label="工种" align="left">
            <template slot-scope="scope">
              <div v-for="(todo,index) of scope.row.link" :key="index">{{todo.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="截止日期" align="left" width="95px">
            <template slot-scope="scope">
              <div
                v-for="(todo,index) of scope.row.link"
                :key="index"
                style="position:top"
              >{{todo.date_end|dateFormat}}</div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="create_date" label="创建日期" width="160px">
          <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="160px">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="end_date" label="结束日期" width="160px">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_date_end" label="计划截止日期" width="160px">
          <template slot-scope="scope">{{scope.row.total_date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="submit_num" label="提交的数量" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div style="padding-top:20px">
      <el-row>
        <el-col :span="20">
          <label for style="padding-top:15px">项目中提交审批数目最多的任务</label>
        </el-col>
      </el-row>
      <el-table
        :data="taskMaxSubmit "
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
        :border="false"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="缩略图" align="center" width="180px">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.asset.image"
              style="width: 180px;height: 100px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="asset.name" label="镜头名称">
          <template slot-scope="scope">{{scope.row.asset.name?scope.row.asset.name:'-'}}</template>
        </el-table-column>
        <el-table-column prop="asset.id" label="镜头号"></el-table-column>
        <el-table-column prop="episode" label="集数">
          <template slot-scope="scope">{{scope.row.episode?scope.row.episode:'-'}}</template>
        </el-table-column>
        <el-table-column prop="session" label="场次">
          <template slot-scope="scope">{{scope.row.session?scope.row.session:'-'}}</template>
        </el-table-column>
        <el-table-column prop="content" label="制作内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="end_date" label="截止日期" width="100px">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="executor.name" label="执行人"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{scope.row.status|taskStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="schedule" label="进度" width="160px">
          <template slot-scope="scope">
            <el-progress
              :stroke-width="12"
              :percentage="scope.row.schedule"
              v-if="scope.row.status != 3 && scope.row.status != 4"
            ></el-progress>
            <div v-if="scope.row.status == 3">{{scope.row.statements}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template slot-scope="scope">{{scope.row.priority|taskPriority}}</template>
        </el-table-column>
        <el-table-column prop="grade" label="难度等级">
          <template slot-scope="scope">{{scope.row.grade|taskgrade}}</template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="100px">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hour" align="center" label="预设时间（小时）" width="130px"></el-table-column>
        <el-table-column label="最后提交时间" header-align="left" width="100px">
          <template slot-scope="scope">{{scope.row.latest_submit_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="id" label="任务ID" width="80px"></el-table-column>
        <el-table-column prop="name" label="任务名称" width="100px"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="100px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="creator.name" label="创建者"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { taskProgress, notSubmitTask } from "@/api/task";
import * as Ajax from "@/api/statistics";
import Chart from "@/components/ECharts/PieChart";
import LineChart from "@/components/ECharts/LineMarker";
// import maxSubmitList from "./components/maxSubmitList";
import { log } from "util";
import { type } from "os";
export default {
  name: "progressContral",
  components: {
    Chart,
    LineChart
    // maxSubmitList
  },
  data() {
    return {
      progressPredict: [],
      progressPredict1: [],
      progress: true,
      value1: true,
      notSubmitList: [],
      overdueNum: [],
      overdueUserName: [],
      burnShow: true,
      burnOutTable: [],
      assetMaxSubmit: [],
      taskMaxSubmit: []
    };
  },
  watch: {
    value1: {
      handler: function(newVal, oldVal) {
        if (newVal == true) {
          this.getAssetStatistics();
          this.getBurnOut();
        }
      }
    }
  },
  created() {
    this.taskProgressPredict();
    this.notSubmitTaskList();
    this.getOverDueTaskS();
    this.getAssetMaxSubmitS();
  },
  mounted() {
    this.getAssetStatistics();
    this.getBurnOut();
  },
  methods: {
    //任务预判断
    taskProgressPredict() {
      let data = {
        project_id: this.$route.params.id,
        prejudgment: ""
      };
      taskProgress(data).then(({ data }) => {
        this.progressPredict = data.positive_message;
        this.progressPredict1 = data.native_message;
      });
    },
    //距离截止日期为1天还未提交的任务
    notSubmitTaskList() {
      let data = {
        project_id: this.$route.params.id,
        not_submit: ""
      };
      notSubmitTask(data).then(({ data }) => {
        this.notSubmitList = data.msg;
      });
    },
    //超期的任务数量与任务执行人排名
    getOverDueTaskS() {
      let data = {
        project_id: this.$route.params.id,
        overdue: ""
      };
      Ajax.getOverDueTask(data).then(({ data }) => {
        this.overdueUserName=[...data.msg];
      });
    },
    //查询项目中提交审批数目最多的资产和任务
    getAssetMaxSubmitS() {
      let data = {
        project_id: this.$route.params.id,
        max_submit: ""
      };
      Ajax.getAssetMaxSubmit(data).then(({ data }) => {
        this.assetMaxSubmit = data.asset;
        this.taskMaxSubmit = data.task;
      });
    },
    //获取镜头状态统计  并传参调用图表组件的初始化方法
    getAssetStatistics() {
      // this.$refs["asset-chart"].openLoading();
      Ajax.getOverDueAsset({
        project_id: this.$route.params.id,
        overdue: ""
      }).then(({ data }) => {
        let chartData = [
          {
            name: "超期",
            value: data.overdue_assetnum
          }
        ];
        this.overdueNum = chartData;
        this.$refs["asset-chart1"].initChart("", chartData);
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
          this.$refs["line-chart2"].initChart(customOption);
        }
      });
    }
  }
};
</script>