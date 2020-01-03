<script>
import MyInfo from "./components/MyInfo";
import MyFeedback from "./components/MyFeedback";
import MyTaskCount from "./components/MyTaskCount";
import MyManWork from "./components/MyManWork";
import MyApprove from "./components/MyApprove";
import noticeDetail from "@/components/Notice/components/notice-detail";
import MyAllocation from "./components/MyAllocation";
import MyReportCard from "./components/MyReportCard";
import MyRanking from "./components/MyRanking";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabApprove from "@/views/task/components/tab-approve";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
import { mapState } from "vuex";
import { putNotice } from "@/api/notice";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import {
  addTaskRecord,
  queryTaskRecord,
  queryTask,
  getStatusTaskList
} from "@/api/task";
let TimeOut = null;
export default {
  name: "HomePage",
  components: {
    MyInfo,
    MyTaskCount,
    MyFeedback,
    MyManWork,
    MyApprove,
    noticeDetail,
    MyAllocation,
    MyReportCard,
    MyRanking,
    //任务侧边栏相关
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
    tabApprove
  },
  mixins: [thumbtackMixin],
  data() {
    return {
      // 这三项是待分配镜头组件的侧边栏依赖
      link: [],
      isAssetDrawerShow: false,
      deptList: this.$store.state.login.userInfo.dept,
      MyTaskList: [],
      // 任务侧边栏相关
      isDrawerShow: false,
      TaskDetail: {
        name: ""
      },
      Link: "",
      Asset: "",
      detailLoading: false,
      LogList: [],
      logsLoading: false,
      TaskRecord: [],
      createLoading: false,
      activeRow: {}, //点击任务列表选中的列的数据
      surplus_labor_hour: null,
      trainingAuth: this.$store.state.login.userInfo.auth.view_training_project,
      system_auth: this.$store.state.login.userInfo.auth.system_auth,
      view_training_teacher:this.$store.state.login.userInfo.role.role
    };
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount"]),
    unreadList() {
      if (this.Notice && this.Notice.length) {
        return this.Notice.filter(t => !t.read);
      } else {
        return [];
      }
    }
  },
  created() {
    if(this.view_training_teacher!=null){
      return this.view_training_teacher=this.view_training_teacher.includes('练习生导师')
    }
    this.getMyTasks();
  },
  beforeRouteEnter(to, from, next) {
    // 刷新页面方法
    const timeOutCallBack = function() {
      this.$store.dispatch("tagsView/delAllCachedViews", this.$route);
      const { fullPath } = this.$route;
      this.$nextTick(() => {
        this.$router.replace({
          path: `/redirect${fullPath}`
        });
      });
    };
    // 此钩子函数中无法访问VUE实例（this），可在next回调的时候给个参数， setTimeout回调绑定vm为“this”，但必须bind因为是异步调用
    // 60000*15 = 延迟十五分钟刷新一次
    next(vm => {
      TimeOut = setTimeout(timeOutCallBack.bind(vm), 60000 * 15);
    });
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(TimeOut);
    next();
  },
  methods: {
    // 展示 待分配镜头组件的 侧边栏 并传值
    changeLinks(arr) {
      this.link = arr;
      this.isAssetDrawerShow = true;
    },
    // 点击消息触发，参数为点击的消息数据
    handelClickNoticeItem({ url, task_id, category }) {
      // category == 1 时候跳转到我的任务后需要打开任务的侧边栏，  在stroe中传递 id识别
      if (category == 1) {
        this.$store.commit("mine/setTaskId", task_id);
      }
      // 关闭notice的抽屉
      this.$store.commit("notice/SET_CARDSHOW", false);
      this.$router.push(url);
    },
    cancel() {
      this.isDialogShow = false;
    },
    addRecord() {
      this.createLoading = true;

      addTaskRecord(this.TaskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg);
            this.getMyTasks();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.isDialogShow = false;
          this.createLoading = false;
          this.isDrawerShow = false;
        })
        .catch(err => {
          this.createLoading = false;
        });
    },
    taskBoardRightShow(row) {
      this.isDrawerShow = true;

      this.activeRow = {
        ...row
      };
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.task.id,
          type: 0,
          date: new Date().toLocaleDateString()
        }
      );
      if (this.activeRow.task && this.activeRow.task.status === 2) {
        this.$nextTick(() => {
          this.$refs["tabApprove"].getMakeQequire(row.task.id);
        });
      }

      this.logsLoading = true;
      this.$refs["taskApprovelog"].getApproveLog(row.task.id);
      queryTaskRecord({
        task_id: row.task.id
      })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.detailLoading = true;
      this.$refs["taskDetail"].getDetail(row.task.id);
      queryTask({
        id: row.task.id
      }).then(({ data }) => {
        this.surplus_labor_hour = data.msg.surplus_labor_hour;
        //   this.TaskDetail = {
        //     ...data.msg
        //   };
        //   this.Asset = this.TaskDetail.asset;
        //   this.Link = this.TaskDetail.link_dept_name;
        //   this.detailLoading = false;
        // })
        // .catch(() => {
        //   this.detailLoading = false;
      });
    },
    // 修改是否已读
    updateIsRead(row) {
      if (row.read === 0) {
        row.read = 1;
      }
      putNotice({
        method: "put",
        ids: row.id,
        read: row.read
      }).then(({ data }) => {
        if (data.status === 0) {
          // this.$message.success(data.msg);
          this.getNoticeDetail();
        }
      });
    },
    // 获取我在进行中的任务
    getMyTasks() {
      getStatusTaskList({
        mytask: null,
        status: "[0, 1, 2]",
        page: 1,
        pagenum: 100
      }).then(({ data }) => {
        this.MyTaskList = [...data.msg];
      });
    },
    getNoticeDetail() {
      this.$store.dispatch("notice/get_Notice", {
        userid: this.$store.state.login.userInfo.id
      });
    }
  }
};
</script>
<template>
  <div id="home-page" ref="drawer-parent">
    <el-row class="home-header-card" :gutter="15" v-if="trainingAuth&&!view_training_teacher||system_auth">
      <el-col :span="12" class="card-warp">
        <MyReportCard />
      </el-col>
      <el-col :span="12" class="card-warp">
        <MyRanking />
      </el-col>
    </el-row>
    <el-row class="home-header" :gutter="15">
      <el-col :span="8">
        <el-row class="basic" :gutter="15">
          <el-col :span="24" class="card-warp">
            <MyInfo />
          </el-col>
          <el-col :span="24" style="height:15px" />
          <el-col :span="24" class="card-warp">
            <MyFeedback :my-task-list="MyTaskList" @show-drawer="taskBoardRightShow" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" v-if="system_auth">
        <el-row class="basic" :gutter="15">
          <el-col :span="24" class="card-warp">
            <MyManWork :my-task-list="MyTaskList" />
          </el-col>
          <el-col :span="24" style="height:15px" />
          <el-col :span="24" class="card-warp">
            <MyTaskCount :my-task-list="MyTaskList" @show-drawer="taskBoardRightShow" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" v-if="trainingAuth&&!system_auth">
        <el-row class="aside" :gutter="15">
          <el-col :span="24" class="card-warp">
            <MyTaskCount :my-task-list="MyTaskList" @show-drawer="taskBoardRightShow" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="aside">
        <el-card shadow="always">
          <el-row slot="header" type="flex" justify="space-between" align="middle">
            <span class="card-header">我的消息</span>
          </el-row>
          <div>
            <div class="content">
              <el-table
                ref="multipleTable"
                :data="unreadList.filter((t,i)=>i<10)"
                style="width: 100%"
                tooltip-effect="dark"
                @row-click="updateIsRead"
              >
                <el-table-column label="消息" show-overflow-tooltip :min-width="80">
                  <template slot-scope="scope">
                    <el-tooltip
                      v-if="scope.row.urgency_level == 0"
                      class="item"
                      effect="dark"
                      content="一般"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 0" icon-class="urgency1" />
                    </el-tooltip>
                    <el-tooltip
                      v-if="scope.row.urgency_level == 1"
                      class="item"
                      effect="dark"
                      content="紧急"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 1" icon-class="urgency2" />
                    </el-tooltip>
                    <el-tooltip
                      v-if="scope.row.urgency_level == 2"
                      class="item"
                      effect="dark"
                      content="特急"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 2" icon-class="urgency3" />
                    </el-tooltip>
                    <svg-icon v-if="scope.row.read == 0" icon-class="notice-close" />
                    <svg-icon v-if="scope.row.read == 1" icon-class="notice-open" />
                    <a @click="handelClickNoticeItem(scope.row)">{{ scope.row.title }}</a>
                  </template>
                </el-table-column>
                <el-table-column label="时间" :min-width="40">
                  <template slot-scope="scope">{{ scope.row.date|dateTimeFormat }}</template>
                </el-table-column>
              </el-table>
              <el-button
                v-show="unreadList.length>10"
                type="text"
                @click="$store.commit('notice/SET_CARDSHOW', true)"
              >查看更多</el-button>
              <!-- <el-button
                @click="$store.commit('notice/SET_CARDSHOW', true)"
                type="text"
                style="color:#ed4014"
              >{{unreadCount}} 条未读 <el-icon class="el-icon-position"/></el-button>-->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="home-footer" :gutter="15">
      <el-col :span="12" class="card-warp">
        <MyApprove />
      </el-col>
      <el-col :span="12" class="card-warp">
        <MyAllocation @changeLinks="changeLinks" />
      </el-col>
    </el-row>
    <!-- 待分配镜头的抽屉组件 -->
    <Drawer
      ref="drawer"
      v-model="isAssetDrawerShow"
      scrollable
      closable
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      title="环节"
    >
      <div style="display:flex;overflow:auto">
        <el-steps
          v-for="(todo,Index) of link"
          :key="Index"
          direction="vertical"
          :active="1"
          style="width:250px;display:flex；justify-content:flex-start"
        >
          <el-step v-for="item of todo" :key="item.link_id" status="process" style="width:250px">
            <div slot="title" style="font-size:14px;display:flex;justify-content:flex-start">
              {{ item.dept.name }}
              <template
                v-if="deptList.filter(todo=>{ return todo.id === item.dept.id}).length"
              >
                <el-tooltip effect="dark" content="添加任务" placement="top">
                  <span style="padding-left:5px">
                    <i
                      class="el-icon-plus"
                      style="color:blue"
                      @click="showTaskForm(item.link_id,item.dept.id,item.content,item.date_and_user)"
                    />
                  </span>
                </el-tooltip>
              </template>
            </div>
            <ul slot="description" style="width:250px;">
              <li>制作要求: {{ item.content }}</li>
              <template>
                <li>开始日期: {{ item.date_and_user.date_start|dateFormat }}</li>
                <li>截止日期: {{ item.date_and_user.date_end|dateFormat }}</li>
              </template>
            </ul>
          </el-step>
        </el-steps>
      </div>
    </Drawer>
    <Drawer
      v-model="isDrawerShow"
      scrollable
      width="512px"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      :mask-style="{backgroundColor: 'transparent'}"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="任务详情">
          <tabTaskDtail
            ref="taskDetail"
            :link="Link"
            :asset="Asset"
            :detail-loading="detailLoading"
          />
        </el-tab-pane>
        <el-tab-pane label="执行记录">
          <tabLog :loglist="LogList" :logs-loading="logsLoading" />
        </el-tab-pane>
        <el-tab-pane label="执行任务">
          <task-form
            :surplus_labor_hour="surplus_labor_hour"
            :task-record.sync="TaskRecord"
            :create-loading="createLoading"
            @addRecord="addRecord"
            @cancel="cancel"
          />
        </el-tab-pane>
        <el-tab-pane label="提交审核">
          <tab-approve
            ref="tabApprove"
            v-if="activeRow.task && activeRow.task.status === 2"
            :row="activeRow"
            @refresh="getMyTasks"
          />
          <div v-else style="display:flex;justify-content:center">任务状态不是进行中</div>
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="taskApprovelog" />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<style lang="scss">
#home-page {
  font-size: 12px;
  background-color: #f4f5f5;
  /* height: calc(100vh - 84px); */
  position: relative;
  @mixin scrollStyle {
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 6px;
      cursor: pointer;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0px;
      box-shadow: inset 0 0 0 #fff;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 0 #fff;
      border-radius: 0;
      background: #fff;
    }
  }
  $border: 1px solid #dcdfe6;
  $linkColor: #2d8cf0;
  .el-card__body {
    @include scrollStyle;
  }
  .home-header {
    margin-bottom: 15px;
    .basic {
      height: 70%;
      .el-card {
        height: 300px;
      }
    }
    .aside {
      .el-card {
        height: 615px;
      }
    }
  }
  .home-footer {
    .el-card {
      height: 300px;
    }
  }
  .home-header-card {
    margin-bottom: 15px;
    .el-card {
      height: 300px;
    }
  }
  .card-header {
    font-size: 14px;
    font-weight: 600;
  }
  .el-button--text {
    padding: 0;
  }
  .svg-icon {
    font-size: 16px;
  }
  .dept-link {
    font-size: 12px;
    color: #2d8cf0;
    & + .dept-link {
      margin-left: 5px;
    }
  }
}
</style>
