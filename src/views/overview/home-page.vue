<script>
import { getStatusTaskList } from "@/api/task";
import MyTask from "./components/MyTask";
import MyManWork from "./components/MyManWork";
import MyApprove from "./components/MyApprove";
import noticeDetail from "@/components/Notice/components/notice-detail";
import { mapState } from "vuex";
export default {
  name: "home-page",
  components: {
    MyTask,
    MyManWork,
    MyApprove,
    noticeDetail
  },
  data() {
    return {
      MyTaskList: []
    };
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount"])
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
    getNoticeDetail() {
      this.$store.dispatch("notice/get_Notice", {
        userid: this.$store.state.login.userInfo.id
      });
    },
  }
};
</script>

<template>
  <el-row id="home-page" :gutter="15">
    <el-col :span="6">
      <MyTask :my-task-list="MyTaskList" :target-more="()=>$router.push({name:'my-task'})"/>
    </el-col>
    <el-col :span="6">
      <MyManWork :my-tasks="MyTaskList"/>
    </el-col>
    <el-col :span="6">
      <MyApprove/>
    </el-col>
    <el-col :span="6">
      <el-card header="我的消息">
        <noticeDetail :notice="Notice" @getNoticeDetail="getNoticeDetail"></noticeDetail>
      </el-card>
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