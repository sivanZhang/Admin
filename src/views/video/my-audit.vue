<template>
  <div id="my-audit">
    <el-button
      icon="el-icon-video-camera-solid"
      type="success"
      @click="approve"
      class="pan-btn green-btn"
      size="mini"
    >任务审核</el-button>
    <el-table
      :data="AuditList"
      style="width: 100%;margin-top:20px"
      highlight-current-row
      borders
      @row-click="taskBoardRightShow"
      border
      @select="taskSelect"
      @select-all="taskSelect"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="content" label="任务内容"></el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">{{scope.row.status|projectStatus}}</template>
      </el-table-column>
      <el-table-column label="优先级">
        <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
      </el-table-column>
      <el-table-column label="开始日期">
        <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="end_date" label="截止日期">
        <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="total_hour" label="预设时间（小时）"></el-table-column>
    </el-table>
    <Drawer
      v-model="isDrawerShow"
      width="512px"
      inner
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="执行记录" lazy>
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
        <el-tab-pane label="执行任务" lazy>
          <task-form
            :task-record.sync="TaskRecord"
            :createLoading="createLoading"
            @addRecord="addRecord"
            @cancel="cancel"
          />
        </el-tab-pane>
        <el-tab-pane label="任务详情" lazy>
          <tabTaskDtail :taskdetail="TaskDetail" :detailLoading="detailLoading" />
        </el-tab-pane>
        <el-tab-pane label="备注" lazy>222</el-tab-pane>
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
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import { log } from "util";
export default {
  components: {
    taskForm,
    tabLog,
    tabTaskDtail
  },
  data() {
    return {
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
      console.log(this.SelectionList);
    },
    //审批
    approve() {
      let IdArr = this.SelectionList.map(item => {
        return item.id
      });
      if(arr){

      }else{
          this.$message.warning('请选择审核的任务')
      }
    },
    //是否显示任务板右侧
    taskBoardRightShow(row) {
      this.isDrawerShow = true;
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.id,
          type: 0
        }
      );
      this.logsLoading = true;
      queryTaskRecord({
        task_id: row.id
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
        id: row.id
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
    },
    //http获取‘我的任务’
    async getMyTasks() {
      await queryMyTask({
        user: this.$store.state.login.userInfo.id
      }).then(({ data }) => {
        [...data.msg].forEach(item => {
          this.AuditList.push(item.task);
        });
      });
    },
    //添加任务执行记录
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
        })
        .catch(err => {
          this.createLoading = false;
        });
    },
    cancel() {
      this.isDialogShow = false;
    }
  },
  created() {
    this.getMyTasks();
  }
};
</script>
<style lang="scss" scoped>
</style>