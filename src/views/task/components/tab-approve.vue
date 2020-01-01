<template>
  <div>
    <el-row>
      <el-col :span="4">
        <font style="font-size:12px;">制作要求:</font>
      </el-col>
      <el-col :span="19" style="font-size:12px;">{{taskdetail}}</el-col>
    </el-row>
    <div style="text-align: right;">
      <el-checkbox v-model="status_finish" style="margin-bottom:10px;" size="small" border>确认满足制作要求</el-checkbox>
    </div>
    <el-form :model="formInline" label-position="left" label-width="100px">
      <el-form-item label="成果路径:">
        <el-input
        clearable
          v-model="formInline.path"
          :placeholder="pathPlugin?'':'请输入成果文件路径...'"
          style="margin-left:-18px;"
        ></el-input>
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" @click="submitForm" class="btn">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { taskApprove, getTaskDetail } from "@/api/task";
export default {
  name: "my-task-approve",
  props: ["row","pathPlugin"],
  data() {
    return {
      status_finish: false,
      taskdetail: [],
      formInline: {
        dept_id: this.row.task.dept.id,
        task_id: this.row.task.id,
        path: this.pathPlugin ? this.pathPlugin : ''
      }
    };
  },
  watch: {
    row: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          let dept = newVal.task.dept;
          let task = newVal.task;
          this.formInline = {
            dept_id: dept.id,
            task_id: task.id,
            path: ""
          };
        }
      }
    }
  },
  methods: {
    getMakeQequire(task_id) {
      getTaskDetail({ id: task_id }).then(({ data }) => {
        if (data.status === 0) {
          this.taskdetail = data.msg.content;
        }
      });
    },
    //表单提交，提交审核
    submitForm() {
      if (this.status_finish == false) {
        this.$alert("请勾选确认满足制作要求", "提示", {
          confirmButtonText: "确定"
        });
      }
      // console.log("表单");
      // console.log(this.formInline);
      else if (this.status_finish == true) {
        taskApprove(this.formInline)
          .then(res => {
            if (res.data.status === 0) {
              //提交审核成功
              this.$message.success(res.data.msg);
              this.$emit("refresh");
              this.formInline.path = "";
              this.$emit("getRow");
              this.status_finish = false;
            } else {
              this.$message.warning(res.data.msg);
              this.formInline.path = "";
              this.$emit("getRow");
              this.status_finish = false;
            }
          })
          .catch(err => {});
      }
      //  this.status_finish=false;
    }
  }
};
</script>
<style lang="scss" scoped>
// .text-right {
//   text-align: right;
//   margin-left: 50px;
// }
.btn{
   margin-right: 18px;
}
.el-checkbox.is-bordered {
  border: 1px solid white;
  margin-right: 18px;
  padding-right: 0px
}
</style>