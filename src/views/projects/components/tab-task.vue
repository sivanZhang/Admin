<template>
  <div id="task">
    <div>
      <el-button icon="el-icon-plus" @click="openDialog">创建</el-button>
      <el-button icon="el-icon-download">导入</el-button>
      <el-dropdown split-button>
        <svg-icon icon-class="save"></svg-icon>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-delete"></el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="任务"></el-table-column>
        <el-table-column prop="name" label="类型"></el-table-column>
        <el-table-column prop="address" label="状态"></el-table-column>
        <el-table-column prop="address" label="执行人"></el-table-column>
        <el-table-column prop="address" label="描述"></el-table-column>
        <el-table-column prop="address" label="截止日期"></el-table-column>
        <el-table-column prop="address" label="预设时间（小时）"></el-table-column>
        <el-table-column prop="address" label="结余（小时）"></el-table-column>
      </el-table>
    </div>

    <el-dialog title="创建任务" :visible.sync="isDialogShow" width="561px">
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
          <el-select v-model="TaskForm.status" placeholder="请选择任务状态" style="width:400px;">
            <el-option
              v-for="item of StatusList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select
            v-model="TaskForm.executorlist"
            multiple
            placeholder="请选择难度等级"
            style="width:400px;"
          >
            <el-option
              v-for="item of UserList"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务主管" prop="manager">
          <el-select v-model="TaskForm.manager" placeholder="请选择难度等级" style="width:400px;">
            <el-option
              v-for="item of UserList"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime" required>
          <el-date-picker
            v-model="TaskForm.datetime"
            type="datetimerange"
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
          <el-button :loading="buttonStates.createLoading" type="primary" @click="createTask">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as HTTP from "@/api/task";
import { mapState } from "vuex";
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
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ]
      },
      isDialogShow: false,
      buttonStates: {
        createLoading: false
      },
      TaskForm: { priority: 0 },
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
      ]
    };
  },
  props: [],
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
    openDialog() {
      this.isDialogShow = true;
    },
    cancel() {
      this.isDialogShow = false;
    },
    createTask() {
      this.$refs["TaskForm"].validate(valid => {
        this.buttonStates.createLoading = true;
        if (valid) {
          function dataFormat(params) {
            let time = new Date(params);
            return `${time.toLocaleDateString()} ${
              time.toTimeString().split(" ")[0]
            }`; //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1])
          };
          delete data.datetime;
          HTTP.addTask(data)
            .then(({ data }) => {
              this.buttonStates.createLoading = false;
              this.$message(data.msg);
              if (data.status === 0) {
              }
            })
            .catch(err => {
              this.buttonStates.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    getTasks(){
      HTTP.queryTask().then(({data})=>{
        console.log(data)
      })
    }
  },
  created() {
    !this.UserList && this.$store.dispatch("admin/get_UserList");
    this.getTasks()
  }
};
</script>

<style lang="scss" scoped>
</style>

