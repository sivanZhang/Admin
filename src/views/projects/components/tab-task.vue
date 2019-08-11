<template>
  <div id="task">
    <div>
      <el-row>
        <el-col :span="15">
          <el-button type="primary" icon="el-icon-plus" @click.native="openDialog(2)">创建</el-button>
          <!-- <el-dropdown>
        <el-button type="primary"  @click.native="openDialog(2)">
          创建
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="openDialog(1)">主任务</el-dropdown-item>
          <el-dropdown-item @click.native="openDialog(2)">子任务</el-dropdown-item>
        </el-dropdown-menu>
          </el-dropdown>-->
          <el-button icon="el-icon-download" type="primary">导入</el-button>
          <el-button icon="el-icon-edit" type="primary" @click.native="openDialog(3)">修改</el-button>
          <el-button type="danger" @click="deleteTask" icon="el-icon-delete">删除</el-button>
        </el-col>
        <el-col :span="9" style="text-align:right">
          <el-input
            placeholder="输入关键字搜索"
            style="width:200px;"
            v-model="keyword"
            class="input-with-select"
          >
            <el-button @click="getTasks(1)" slot="append" icon="el-icon-search" type="primary" />
          </el-input>
          <el-button @click="getTasks()" icon="el-icon-refresh-left" type="primary">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="TaskList"
        style="width: 100%;margin-top:20px"
        highlight-current-row
        row-key="id"
        :tree-props="{ children: 'sub_task' }"
        @current-change="rowSelected"
        border
      >
        <!-- default-expand-all -->
        <el-table-column prop="name" label="任务"></el-table-column>
        <el-table-column label="制作环节">
          <template slot-scope="scope">{{scope.row.category|categoryFilter}}</template>
        </el-table-column>
        <el-table-column label="镜头号">
          <template slot-scope="scope">{{scope.row.asset.name}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status|projectStatus}}</template>
        </el-table-column>
        <el-table-column label="创建者">
          <template slot-scope="scope">{{scope.row.creator.name}}</template>
        </el-table-column>
        <el-table-column label="执行人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
        </el-table-column>
        <el-table-column prop="content" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="end_date" label="截止日期">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hour" label="预设时间（小时）"></el-table-column>
      </el-table>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" width="490px">
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" placeholder="请填写任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content" placeholder="请填写任务内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
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
          <el-select v-model="TaskForm.executorlist" multiple placeholder="请选择任务执行人">
            <el-option v-for="item of DeptUsers" :label="item.username" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务主管" prop="manager">
          <el-select v-model="TaskForm.manager" placeholder="请选择任务主管">
            <el-option v-for="item of DeptUsers" :label="item.username" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属资产">
          <el-select v-model="TaskForm.asset" placeholder="请选择所属资产">
            <el-option v-for="item of AssetList" :label="item.name" :value="item.id" :key="item.id"></el-option>
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
import { log } from "util";
import { Transform } from "stream";
import myMixin from "./mixins";
import { mapState } from "vuex";
import { getDeptUsers } from "@/api/admin";
export default {
  mixins: [myMixin],
  name: "tab-task",
  data() {
    return {
      DeptUsers: [],
      keyword: "",
      isDialogShow: false,
      buttonStates: {
        createLoading: false
      },
      ActiveRow: {},
      DialogType: null,
      dialogTitle: ""
    };
  },
  filters: {
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    },
    categoryFilter(obj) {
      if ("name" in obj) {
        return obj["name"];
      } else {
        return "";
      }
    }
  },
  props: {
    AssetList: {
      type: Array
    },
    TaskList: {
      type: Array
    }
  },
  methods: {
    //行被点击后出发
    rowSelected(row) {
      this.ActiveRow = { ...row };
    },
    //打开对话框
    openDialog(Type) {
      this.DialogType = Type;
      getDeptUsers({
        id: this.ActiveRow.dept
      }).then(res => {
        this.DeptUsers = [...res.data.users]
      });
      switch (Type) {
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
            asset: this.ActiveRow.asset.id,
            link_id: this.ActiveRow.link
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
            manager: this.ActiveRow.manager ? this.ActiveRow.manager.id : null,
            asset: this.ActiveRow.asset.id,
            method: "put"
          };
          console.log(this.TaskForm,'~~~~~~~~~~~~');
          
          delete this.TaskForm.executor;
          delete this.TaskForm.creator;
          delete this.TaskForm.create_time;
          delete this.TaskForm.category;
          delete this.TaskForm.project
          delete this.TaskForm["sub_task"];
          delete this.TaskForm["link"];
          break;
      }
      this.isDialogShow = true;
    },
    //添加或者修改任务
    editTask() {
      this.$refs["TaskRef"].validate(valid => {
        if (valid) {
          this.buttonStates.createLoading = true;
          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString();
            //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          let data = {
            ...this.TaskForm,
            start_date: changeDateFormat(this.TaskForm.datetime[0]),
            end_date: changeDateFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
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
                  this.getTasks();
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
                  this.getTasks();
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
      this.$refs["TaskRef"].resetFields();
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
            if (data.status === 0) {
              this.getTasks();
            }
          });
        })
        .catch(() => {});
    },
    //获取任务列表
    getTasks(type) {
      if (type) {
        this.$emit("get-tasks", this.keyword);
      } else {
        this.$emit("get-tasks");
      }
    }
  },
  created() {
    this.getTasks();
  }
};
</script>

<style lang="scss" scoped>
</style>

