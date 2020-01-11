<template>
  <div id="detail">
    <el-row>
      <el-col :span="10">
        <el-image
          class="mini-image"
          :src="TaskDetail.project.image?$store.state.BASE_URL+TaskDetail.project.image:''"
          fit="cover"
          style="width: 170px;height: 120px;float: left;margin-right: 10px"
        />
      </el-col>
      <el-col :span="4">
        <div>项目名称：{{test}}</div>
        <div>所属资产：{{test1}}</div>
      </el-col>
      <el-col :span="10">
        <div>{{ TaskDetail.project.name }}</div>
        <div>{{ TaskDetail.asset.name?TaskDetail.asset.name:"-" }}</div>
      </el-col>
    </el-row>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务详情" name="first">
          <tabTaskDtail ref="taskDtail" />
          <el-button type="primary" class="create" @click="handelClick">创建工程</el-button>
        </el-tab-pane>
        <el-tab-pane label="关联任务输出" name="seven">
          <linkTaskOutput ref="linkTaskOutput" />
        </el-tab-pane>
        <el-tab-pane label="执行记录" name="second">
          <tabLog :loglist="logList" :logs-loading="logsLoading" />
        </el-tab-pane>
        <el-tab-pane label="执行任务" name="third">
          <task-form
            :task-record.sync="taskRecord"
            :surplus_labor_hour="surplus_labor_hour"
            :create-loading="createLoading"
            @addRecord="addRecord"
            @cancel="cancel"
          />
        </el-tab-pane>
        <el-tab-pane label="提交审核" name="fourth">
          <tab-approve
            v-if="activeRow.task && activeRow.task.status === 2"
            ref="tab-approve"
            :row="activeRow"
            :task-id="taskRecord.task_id"
            :os="os"
          />
          <div
            v-if="activeRow.task && activeRow.task.status === 3"
            style="display:flex;justify-content:center"
          >任务正在审核中</div>
          <div v-else style="display:flex;justify-content:center">任务状态未在进行中</div>
        </el-tab-pane>
        <el-tab-pane label="审批记录" name="fifth">
          <approve-log ref="taskApprovelog" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import QWebChannel from '../plugin/qwebchannel.js'
import { addTaskRecord, queryTask, getDirs } from '@/api/task'
import taskForm from '@/views/task/components/task-form'
import tabLog from '@/views/task/components/tab-log'
import tabApprove from '@/views/task/components/tab-approve'
import tabTaskDtail from '@/views/task/components/tab-task-detail'
import approveLog from '@/views/components/approve-log'
import linkTaskOutput from '@/views/task/components/tab-linkTaskOutput'
export default {
  name: 'Detail',
  components: {
    tabApprove,
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
    linkTaskOutput
  },
  props: [
    'logList',
    'detailLoading',
    'logsLoading',
    'taskRecord',
    'activeRow',
    'os'
  ],
  data() {
    return {
      test:'是否根据点选任务发送 init了',
      test1:'是否请求后端了',
      activeName: 'first',
      surplus_labor_hour: null,
      createLoading: false,
      TaskDetail: {
        asset: {
          name: ''
        },
        project: { image: '' }
      },
      rules: {
        title: [
          {
            message: '请输入任务执行记录的标题',
            trigger: 'blur'
          }
        ],
        content: [
          {
            message: '请输入任务执行记录的内容',
            trigger: 'blur'
          }
        ],
        labor_hour: [
          { message: '请输入任务执行的工时', trigger: 'blur' }
        ]
      },
      rules2: {
        comment: [
          { message: '请输入任务完成情况说明', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === 'fifth') {
          this.$refs['taskApprovelog'].getApproveLog(
            this.TaskDetail.id
          )
        }
      }
    },
    activeRow: {
      immediate: true,
      deep: true,
      handler: function(newVal, oldVal) {
        this.test1 = "监听到任务变化了"
        new QWebChannel(qt.webChannelTransport, ({ objects }) => {
          var appManager = objects.app_manager
          appManager.text = `init@ @${this.taskRecord.task_id}`
          this.test1 = "程序运行到  'init@'代码中了"
        })
      }
    }
  },
  mounted() {
    document.body.style.minWidth = 'auto'
  },
  methods: {
    handelClick() {
      const self = this
      new QWebChannel(qt.webChannelTransport, function({ objects }) {
        var appManager = objects.app_manager
        getDirs({
          id: self.taskRecord.task_id,
          working: '',
          os: self.os
        }).then(({ data }) => {
          appManager.text = `path@${data.msg}@${self.taskRecord.task_id}`
          self.$refs['tab-approve'].getInitalPath()
        })
      })
    },
    getTaskDetail(id) {
      this.$refs['linkTaskOutput'].getlinkTaskOutput(id)
      queryTask({
        id: id
      })
        .then(({ data }) => {
          this.TaskDetail = {
            ...data.msg
          }
          this.surplus_labor_hour = data.msg.surplus_labor_hour
          // console.log(this.TaskDetail);
        })
        .catch(() => {})
      this.$nextTick(() => {
        this.$refs['taskDtail'].getDetail(id)
      })
    },
    addRecord() {
      this.createLoading = true

      addTaskRecord(this.taskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg)
            // this.getMyTasks();
          } else {
            this.$message.warning(res.data.msg)
          }
          this.$emit('activename')
          this.createLoading = false
        })
        .catch(err => {
          this.createLoading = false
          this.$emit('activename')
        })
    },
    cancel() {
      this.isDialogShow = false
    }
  }
}
</script>

<style scoped>
.create {
    margin-top: 15px;
}
</style>
