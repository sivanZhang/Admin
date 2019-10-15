<script>
import { getStatusTaskList } from "@/api/task";
import MyTask from "./components/MyTask";
import MyManWork from "./components/MyManWork";
export default {
  name: "home-page",
  components: {
    MyTask,
    MyManWork
  },
  data() {
    return {
      MyTaskList: []
    };
  },
  created() {
    this.getMyTasks();
  },
  methods: {
    //获取我在进行中的任务
    getMyTasks() {
      getStatusTaskList({
        mytask: null,
        status: 2
      }).then(({ data }) => {
        this.MyTaskList = [...data.msg];
      });
    },
  }
};
</script>

<template>
  <el-row id="home-page" :gutter="15">
    <el-col :span="6">
      <MyTask :my-task-list="MyTaskList"/>
    </el-col>
    <el-col :span="6">
      <MyManWork/>
    </el-col>
    <el-col :span="6">
      <el-card header="我的审核"></el-card>
    </el-col>
    <el-col :span="6">
      <el-card header="我的消息"></el-card>
    </el-col>
    <el-col :span="6">
      <el-card header="组长"></el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss">
#home-page {
  .el-button--text{
    padding: 0;
  }
}
</style>