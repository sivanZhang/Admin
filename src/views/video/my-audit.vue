<template>
  <div id="my-audit" ref="drawer-parent">
    <el-button
      icon="el-icon-video-camera-solid"
      type="success"
      @click="approve"
      class="pan-btn green-btn"
    >任务审核</el-button>
    <el-table
      v-loading="tableLoading"
      :data="AuditList"
      style="margin-top:20px;width:100%"
      highlight-current-row
      
      @select="taskSelect"
      @select-all="taskSelect"
      :cell-style="cellStyle"
    >
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="task.id" label="任务ID" align="center" class-name="links">
        <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.task.id}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="task.name" label="任务名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属项目" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="项目缩略图"  width="120px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.project.image"
            style="width: 55px;height: 33px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.project.image]"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="asset_name" label="所属资产" show-overflow-tooltip></el-table-column>
      <el-table-column label="资产缩略图"  width="120px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.asset_image"
            style="width: 55px;height: 33px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.asset_image]"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="user.username" label="提交人"></el-table-column>
      <el-table-column prop="task.dept.name" label="工种"></el-table-column>
      <el-table-column label="提交日期"  width="120px">
        <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.content" label="任务内容" show-overflow-tooltip></el-table-column>
      <el-table-column width="30px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
            <el-card
              v-if="scope.row.task.status === 0"
              :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
            <el-card
              v-if="scope.row.task.status === 1"
              :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
            <el-card
              v-if="scope.row.task.status === 2"
              :style="{width:'10px',backgroundColor:'#589BAD',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
            <el-card
              v-if="scope.row.task.status === 3"
              :style="{width:'10px',backgroundColor:'#2D5637',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：完成" placement="top">
            <el-card
              v-if="scope.row.task.status === 4"
              :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：超时" placement="top">
            <el-card
              v-if="scope.row.task.status === 5"
              :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px'}"
            ></el-card>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">{{scope.row.task.status|taskStatus}}</template>
      </el-table-column>
      <el-table-column prop="task.task_executors" label="任务执行人" width="120px">
        <template slot-scope="scope">
          <div v-for="item of scope.row.task.task_executors" :key="item.id">{{item.user_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="优先级" prop="priority">
        <template slot-scope="scope">{{scope.row.task.priority|taskPriority}}</template>
      </el-table-column>
      <el-table-column label="开始日期" width="120px">
        <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="end_date" label="截止日期"  width="120px">
        <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.total_hour" label="预设时间（小时）" width="150px"></el-table-column>
    </el-table>
    <Drawer
      scrollable
      v-model="isDrawerShow"
      width="512px"
      :inner="isInner"
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="任务详情" lazy>
          <tabTaskDtail ref="taskDetail" :detailLoading="detailLoading" :path="path" />
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="approvelogs" />
        </el-tab-pane>
        <el-tab-pane label="快捷审批" lazy>
          <el-divider>提交内网审批</el-divider>
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
          <template v-if="pro_type === 0">
            <el-row type="flex" align="middle">
              <el-col :span="5">审核评分</el-col>
              <el-col :span="19" align="left">
                <el-input-number v-model="form_obj.score" :min="0" :max="100" :step="10"></el-input-number>
              </el-col>
            </el-row>
          </template>
          <div>
            <el-checkbox v-model="checked">是否提交客户审批</el-checkbox>
          </div>
          <el-input
            v-if="checked"
            type="textarea"
            v-model="out_suggestion"
            ref="outer-input"
            placeholder="提交客户审批的说明"
            style="margin-top:10px"
          ></el-input>
          <el-input
            v-if="checked"
            v-model="out_path"
            ref="outer-path"
            placeholder="请输入提交客户审批的路径"
            style="margin-top:5px"
          ></el-input>
          <div style="margin-top:10px">
            <el-button type="primary" :loading="submitLoading" @click="submitApprove">提交</el-button>
          </div>
          <!-- {{form_obj}} -->
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
import { postApprove, getApproveDetail } from "@/api/video";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { mapState } from "vuex";
export default {
  mixins: [thumbtackMixin],
  components: {
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog
  },
  data() {
    return {
      out_suggestion: "",
      checked: false,
      submitLoading: false,
      form_obj: {},
      isDrawerShow: false,
      TaskRecord: {},
      detailLoading: false,
      logsLoading: false,
      createLoading: false,
      LogList: [],
      TaskDetail: {},
      SelectionList: [],
      path: null,
      pro_type: null,
      tableLoading: false,
      out_path: null
    };
  },
  computed: {
    ...mapState("approve", ["AuditList"])
  },
  methods: {
    //状态
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.task.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "grade") {
        switch (row.grade) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      
    },
    //表格中选中任务
    taskSelect(selection) {
      this.SelectionList = [...selection];
      // console.log("shenhe");
      // console.log(this.SelectionList);
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
    taskBoardRightShow(id) {
      this.isDrawerShow = true;
      this.TaskRecord = Object.assign(
        {},
        {
          task_id:id,
          type: 0
        }
      );
      this.logsLoading = true;
      queryTaskRecord({
        task_id: id
      })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.detailLoading = true;
      this.$refs["taskDetail"].getDetail(id);
      queryTask({
        id: id
      })
        .then(({ data }) => {
          // this.TaskDetail = {
          //   ...data.msg
          // };
          this.pro_type = data.msg.project.pro_type;
          this.detailLoading = false;
        })
        .catch(() => {
          this.detailLoading = false;
        });

      getApproveDetail({ task_id: [id] }).then(({ data }) => {
        this.path = [...data.msg].filter(item => {
          if (item.task.id === id) return item;
        })[0].path;
        if (!this.path) {
          this.path = "-";
        }
      });
      this.form_obj = Object.assign(
        {},
        {
          suggestion: "",
          approve_result: 0,
          task_id: id
        }
      );
      this.$refs["approvelogs"].getApproveLog(id);
    },
    submitApprove() {
      this.submitLoading = true;
      if (this.checked) {
        //添加提交外网审核字段
        this.form_obj = {
          ...this.form_obj,
          click: "",
          out_suggestion: this.out_suggestion,
          path: this.out_path
        };
      }
      postApprove(this.form_obj)
        .then(res => {
          if (res.data.status === 0) {
            this.getMyTasks();
            this.isDrawerShow = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    //http获取‘我的任务’
    getMyTasks() {
      this.tableLoading = true;
      this.$store.dispatch("approve/get_Approve").finally(() => {
        this.tableLoading = false;
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
<style lang="scss">
#my-audit {
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
  .el-card {
    border-radius: 0px;
  }
}
</style>