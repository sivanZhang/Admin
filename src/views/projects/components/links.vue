<template>
  <div id="links">
    <template v-if="!LinkList.length">
      <el-button icon="el-icon-plus" type="primary" @click="showLinksForm">添加环节</el-button>
    </template>
    <template v-else>
      <el-steps direction="vertical" :active="1">
        <el-step v-for="item of LinkList" :key="item.link_id" status="process">
          <div slot="title" style="font-size:14px">
            {{item.dept.name}}
            <el-button @click="showTaskForm(item.link_id,item.dept.id,item.content)">添加任务</el-button>
          </div>
          <ul slot="description" style="width:400px;">
            <li>制作要求: {{item.content}}</li>
            <template>
              <li>开始日期: {{item.date_and_user.date_start|dateFormat}}</li>
              <li>截止日期: {{item.date_and_user.date_end|dateFormat}}</li>
            </template>
          </ul>
        </el-step>
      </el-steps>
    </template>
    <el-dialog title="添加环节" :visible.sync="isDialogShow" width="512px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
        </el-col>
        <el-col :span="20">
          <el-form :model="item" label-width="90px">
            <el-form-item
              label="环节内容"
              prop="content"
              :rules="[{ required: true, message: '请输入环节内容', trigger: 'blur' }]"
            >
              <el-input type="textarea" v-model="item.content" style="width:100%"></el-input>
            </el-form-item>
            <el-form-item
              label="当前工种"
              prop="dept"
              :rules="[{ required: true, message: '请输入当前工种', trigger: 'blur' }]"
            >
              <el-cascader
                v-model="item.dept"
                placeholder="输入搜索工种"
                :options="selectList"
                :props="{ checkStrictly: true}"
                filterable
                style="width:100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="时间" prop="datetime">
              <el-date-picker
                v-model="item.datetime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <el-divider />
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="addLinks()">立即创建</el-button>
      </el-row>
    </el-dialog>
    <!-- 添加任务 -->
    <el-dialog title="添加任务" :visible.sync="isCreateTaskShow" width="490px" :modal="false">
      <el-form :model="TaskForm" :rules="rules" ref="TaskForm" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
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
          <el-select v-model="TaskForm.executorlist" multiple placeholder="请选择执行人">
            <el-option v-for="item of DeptUsers" :label="item.username" :value="item.id" :key="item.id"></el-option>
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
        
        <el-form-item>
          <el-button @click="cancelTask">取消</el-button>
          <el-button :loading="createTaskLoading" type="primary" @click="addTasks">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addTask } from "@/api/task";
import { addLinks } from "@/api/links";
import { getDeptUsers } from "@/api/admin";
import { getDept } from "@/api/admin";
import { mapState } from "vuex";
import myMixin from "./mixins";
import { type } from "os";
export default {
  mixins: [myMixin],
  name: "links",
  data() {
    return {
      DeptUsers:[],
      isCreateTaskShow: false,
      TaskForm: {},
      isDialogShow: false,
      LinkForm: {},
      createLoading: false,
      createTaskLoading: false,
      selectList: [],
      FormList: [{}]
    };
  },
  props: ["LinkList", "project"],
  computed: {
    ...mapState("admin", ["DeptList"])//DeptUsers是根据登录账号得来的
  },
  methods: {
    before(ind) {
      this.FormList.splice(ind, 0, {});
    },
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
    },
    showLinksForm() {
      this.isDialogShow = true;
    },
    cancel() {
      this.isDialogShow = false;
    },
    //取消对话框
    cancelTask() {
      this.isCreateTaskShow = false;
    },
    showTaskForm(link_id, dept_id,content) {
      getDept({
        id:dept_id
      }).then(res=>{
        this.DeptUsers = [...res.data.users]
        console.log(this.DeptUsers);
        
      })
      this.isCreateTaskShow = true;
      this.TaskForm = Object.assign(
        {},
        {
          priority: 0,
          grade:0,
          asset: this.project.id,
          project: this.$route.params.id,
          link_id,
          content
        }
      );
    },
    addTasks() {
      this.$refs["TaskForm"].validate(valid => {
        if (valid) {
          this.createTaskLoading = true;
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          addTask(data)
            .then(({ data }) => {
              this.createTaskLoading = false;
              this.$message(data.msg);
              if (data.status === 0) {
                this.cancelTask();
                this.$emit("get-tasks");
                this.isDialogShow = false;
              }
            })
            .catch(err => {
              this.createTaskLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    addLinks() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.FormList.forEach((item, index) => {
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          dept: this.FormList[index].dept[this.FormList[index].dept.length - 1],
          asset: this.project.id
        });

        if (
          "datetime" in this.FormList[index] &&
          this.FormList[index].datetime.length
        ) {
          this.FormList[index] = {
            ...this.FormList[index],
            date_start: dataFormat(this.FormList[index].datetime[0]),
            date_end: dataFormat(this.FormList[index].datetime[1])
          };
          delete this.FormList[index].datetime;
        }
        if (index === 0) {
          this.FormList[index].pid = 0;
        } else {
          this.FormList[index].pid = this.FormList[index - 1].dept;
        }
      });
      this.createLoading = true;
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      addLinks({ links: [...this.FormList] })
        .then(({ data }) => {
          this.createLoading = false;
          this.$message(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
            this.isDialogShow = false;
            this.FormList = [{}];
          }
        })
        .catch(err => {
          this.isDialogShow = false;
          this.createLoading = false;
        });
    },
    formatList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.selectList);
    }
  },
  async created() {
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

