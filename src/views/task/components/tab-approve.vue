<template>
  <el-form :model="formInline" label-position="left" label-width="100px">
    <el-form-item label="路径" required>
      <el-input v-model="formInline.path" placeholder="要审核的路径"></el-input>
    </el-form-item>
    <el-form-item class="text-right">
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { taskApprove } from "@/api/task";
export default {
  name: "my-task-approve",
  props: ["row"],
  data() {
    return {
      formInline: {
        dept_id: this.row.task.dept.id,
        task_id: this.row.task.id,
        path: ""
      }
    };
  },
  methods: {
    //表单提交，提交审核
    submitForm() {
      console.log(this.formInline);
        taskApprove(this.formInline).then(res => {
          if (res.data.status === 0) {
            //提交审核成功
            this.$message.success(res.data.msg);
            this.$emit("refresh");
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.text-right {
  text-align: right;
}
</style>