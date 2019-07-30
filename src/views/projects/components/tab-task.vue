<template>
  <div id="task">
    <div>
      <el-dropdown>
        <el-button type="primary">
          创建
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="openDialog(1)">主任务</el-dropdown-item>
          <el-dropdown-item @click.native="openDialog(2)">子任务</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-download" type="primary">导入</el-button>
      <el-button icon="el-icon-edit" type="primary" @click.native="openDialog(3)">修改</el-button>
      <el-button type="danger" @click="deleteTask" icon="el-icon-delete">删除</el-button>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px"
        highlight-current-row
        row-key="id"
        :tree-props="{ children: 'sub_task' }"
        @row-click="rowSelected"
      >
        <!-- default-expand-all -->
        <el-table-column prop="name" label="任务"></el-table-column>
        <el-table-column prop="category" label="类型"></el-table-column>
        <el-table-column label="所属资产">
          <template slot-scope="scope">{{scope.row.asset.name}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status|statusFilter}}</template>
        </el-table-column>
        <el-table-column label="创建者">
          <template slot-scope="scope">{{scope.row.creator.name}}</template>
        </el-table-column>
        <el-table-column label="执行人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
        </el-table-column>
        <el-table-column prop="content" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">{{scope.row.start_date|dateFilter}}</template>
        </el-table-column>
        <el-table-column prop="end_date" label="截止日期">
          <template slot-scope="scope">{{scope.row.end_date|dateFilter}}</template>
        </el-table-column>
        <el-table-column prop="total_hour" label="预设时间（小时）"></el-table-column>
      </el-table>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" width="510px">
      <el-form :model="TaskForm" :rules="rules" ref="TaskForm" label-width="120px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content"></el-input>
        </el-form-item>
        <el-form-item label="任务等级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="TaskForm.status" placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" multiple placeholder="请选择难度等级">
            <el-option
              v-for="item of UserList"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务主管" prop="manager">
          <el-select v-model="TaskForm.manager" placeholder="请选择难度等级">
            <el-option
              v-for="item of UserList"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="TaskForm.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour">
          <el-input v-model="TaskForm['total_hour']"></el-input>
        </el-form-item>
        <el-form-item label="自定义属性" prop="extra_attr">
          <el-input v-model="TaskForm['extra_attr']"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="editTask"
          >{{DialogType===3?'立即修改':'立即创建'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as HTTP from "@/api/task";
import { mapState } from "vuex";
import { log } from "util";
import { Transform } from "stream";
export default {
  name: "tab-task",
  data() {
    return {
      tableData: [],
      rules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入任务内容", trigger: "blur" }
        ],
        executorlist: [
          {
            required: true,
            message: "请输入任务执行人",
            trigger: "blur"
          }
        ],
        total_hour: [
          { required: true, message: "请输入总工时", trigger: "blur" }
        ],
        datetime: [
          { required: true, message: "请输入任务时间", trigger: "blur" }
        ]
      },
      isDialogShow: false,
      buttonStates: {
        createLoading: false
      },
      TaskForm: {},
      StatusList: [
        {
          label: "草稿",
          value: 0
        },
        {
          label: "已启动",
          value: 1
        },
        {
          label: "结束",
          value: 2
        },
        {
          label: "任务超时",
          value: 3
        }
      ],
      ActiveRow: {},
      DialogType: null,
      dialogTitle: ""
    };
  },
  filters: {
    statusFilter(val) {
      switch (val) {
        case 0:
          return "草稿";
          break;
        case 1:
          return "已启动";
          break;
        case 2:
          return "结束";
          break;
        case 3:
          return "任务超时";
          break;
      }
    },
    dateFilter(val) {
      return new Date(val * 1000).toLocaleDateString();
    },
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    }
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
    //行被点击后出发
    rowSelected(row) {
      this.ActiveRow = { ...row };
    },
    //打开对话框
    openDialog(Type) {
      this.DialogType = Type;
      switch (this.DialogType) {
        case 1:
          this.dialogTitle = "创建任务";
          this.TaskForm = {
            priority: 0
          };
          break;
        case 2:
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error("请选择父任务");
            return false;
          }
          this.dialogTitle = `创建 ${this.ActiveRow.name} 的子任务`;
          this.TaskForm = {
            priority: 0,
            pid: this.ActiveRow.id,
            asset: this.ActiveRow.asset.id
          };
          break;
        case 3:
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error("请选择要修改的任务");
            return false;
          }
          let executorlist;
          if (this.ActiveRow.executor.length) {
            executorlist = this.ActiveRow.executor.map(item => +item.id);
          }
          this.dialogTitle = "修改任务";
          this.TaskForm = {
            ...this.ActiveRow,
            datetime: [
              new Date(this.ActiveRow.start_date * 1000),
              new Date(this.ActiveRow.end_date * 1000)
            ],
            executorlist,
            manager: this.ActiveRow.manager ? this.ActiveRow.manager.id : null
          };
          delete this.TaskForm.executor;
          delete this.TaskForm.creator;
          delete this.TaskForm.create_time;
          delete this.TaskForm.create_time;
          delete this.TaskForm.create_time;
          delete this.TaskForm.create_time;
          delete this.TaskForm.category;
          delete this.TaskForm["sub_task"];
          break;
      }
      this.isDialogShow = true;
    },
    //添加或者修改任务
    editTask() {
      this.$refs["TaskForm"].validate(valid => {
        this.buttonStates.createLoading = true;
        if (valid) {
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1])
          };
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          //若果是修改
          if (this.DialogType === 3) {
            HTTP.putTask(data)
              .then(({ data }) => {
                this.buttonStates.createLoading = false;
                this.$message(data.msg);
                if (data.status === 0) {
                  this.getTasks()
                  this.isDialogShow = false;
                }
              })
              .catch(err => {
                this.buttonStates.createLoading = false;
              });
          } else {
            HTTP.addTask(data)
              .then(({ data }) => {
                this.buttonStates.createLoading = false;
                this.$message(data.msg);
                if (data.status === 0) {
                  this.getTasks()
                  this.isDialogShow = false;
                }
              })
              .catch(err => {
                this.buttonStates.createLoading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    //取消对话框
    cancel() {
      this.isDialogShow = false;
    },
    //删除任务http请求
    deleteTask() {
      if (!Object.keys(this.ActiveRow).length) {
        this.$message.error("请选择要删除的任务");
        return false;
      }
      this.$confirm("删除任务后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          HTTP.deleteTask(this.ActiveRow.id).then(({ data }) => {
            this.$message(data.msg);
            if (data.state === 0) {
              this.getTasks();
            }
          });
        })
        .catch(() => {});
    },
    //获取任务列表
    getTasks() {
      HTTP.queryTask({ project: this.$route.params.id }).then(({ data }) => {
        this.tableData = [...data.msg];
      });
    }
  },
  created() {
    //如果用户列表为空则请求用户列表
    !this.UserList && this.$store.dispatch("admin/get_UserList");
    this.getTasks();
  }
};
</script>

<style lang="scss" scoped>
</style>

