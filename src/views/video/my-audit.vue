<template>
  <div id="my-audit">
    <el-button
      icon="el-icon-video-camera-solid"
      type="success"
      @click="approve"
      class="pan-btn green-btn"
    >任务审核</el-button>
    <el-table
      :data="AuditList"
      style="margin-top:20px"
      highlight-current-row
      @row-click="taskBoardRightShow"
      @select="taskSelect"
      @select-all="taskSelect"
    >
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="task.id" label="任务ID" align="center" />
      <el-table-column prop="task.name" label="任务名称"></el-table-column>
      <el-table-column prop="project.name" label="所属项目"></el-table-column>
      <el-table-column prop="asset.name" label="所属资产"></el-table-column>
      <el-table-column prop="task.content" label="任务内容"></el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">{{scope.row.task.status|projectStatus}}</template>
      </el-table-column>
       <el-table-column prop="task.executor" label="任务执行人"></el-table-column>
      <el-table-column label="优先级">
        <template slot-scope="scope">{{scope.row.task.priority|Priority}}</template>
      </el-table-column>
      <el-table-column label="开始日期">
        <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="end_date" label="截止日期">
        <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.total_hour" label="预设时间（小时）"></el-table-column>
    </el-table>
    <Drawer scrollable
      v-model="isDrawerShow"
      width="512px"
      inner
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="任务详情" lazy>
          <tabTaskDtail :taskdetail="TaskDetail" :detailLoading="detailLoading" />
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="approvelogs"/>
        </el-tab-pane>
        <el-tab-pane label="快捷审批" lazy>
          <el-row type="flex">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="请输入审批意见"
              v-model="form_obj.suggestion"
              clearable
            ></el-input>
          </el-row>
          <el-radio-group v-model.number="form_obj.approve_result" style="margin: 15px 0">
            <el-radio :label="0">拒绝</el-radio>
            <el-radio :label="1">同意</el-radio>
          </el-radio-group>
          <div>
            <el-button
              type="primary"
              :loading="submitLoading"
              @click="submitApprove"
            >提交</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="执行记录" lazy>
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>
<script>
import {
  queryMyTask,
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask
} from "@/api/task";
import { getApprove, postApprove } from "@/api/video";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "./components/approve-log";
import { log } from "util";
export default {
  components: {
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
  },
  data() {
    return {
      submitLoading: false,
      form_obj: {},
      AuditList: [],
      isDrawerShow: false,
      TaskRecord: {},
      detailLoading: false,
      logsLoading: false,
      createLoading: false,
      LogList: [],
      TaskDetail: {},
      SelectionList: []
    };
  },
  methods: {
    //表格中选中任务
    taskSelect(selection) {
      this.SelectionList = [...selection];
    },
    //审批
    approve() {
      if (this.SelectionList.length) {
        this.$store.commit("video/SET_SELECTION", this.SelectionList);
        this.$router.push({ name: "check-video" });
      } else {
        this.$message.warning("请选择审核的任务");
      }
    },
    //是否显示任务板右侧
    taskBoardRightShow(row) {
      this.isDrawerShow = true;
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.task.id,
          type: 0
        }
      );
      this.logsLoading = true;
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
      queryTask({
        id: row.task.id
      })
        .then(({ data }) => {
          this.TaskDetail = {
            ...data.msg
          };
          this.detailLoading = false;
        })
        .catch(() => {
          this.detailLoading = false;
        });
      this.form_obj = Object.assign(
        {},
        {
          asset_id: row.asset.asset,
          link_id: row.task.link,
          project_id: row.project.id,
          suggestion: "",
          approve_result: 0
        }
      )
      this.$refs['approvelogs'].getApproveLog(row.asset.asset)
    },
    submitApprove() {
      this.submitLoading = true;
      postApprove(this.form_obj)
        .then(res => {
          this.submitLoading = false;
          this.$message(res.data.msg);
        })
        .catch(err => {
          this.submitLoading = false;
        });
    },
    //http获取‘我的任务’
    async getMyTasks() {
      //getApprove
      /* await queryMyTask({
        user: this.$store.state.login.userInfo.id
      }).then(({ data }) => {
        [...data.msg].forEach(item => {
          this.AuditList.push(item.task);
        });
      }); */
      await getApprove().then(({ data }) => {
        [...data.msg].forEach(item => {
          this.AuditList.push(item);
        });
      });
    }
    //添加任务执行记录
    /* addRecord() {
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
        })
        .catch(err => {
          this.createLoading = false;
        });
    },
    cancel() {
      this.isDialogShow = false;
    } */
  },
  created() {
    this.getMyTasks();
  }
};
</script>
<style lang="scss" scoped>
</style>