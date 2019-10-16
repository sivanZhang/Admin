<script>
import { getStatusTaskList } from "@/api/task";
import MyTask from "./components/MyTask";
import MyManWork from "./components/MyManWork";
import MyApprove from "./components/MyApprove";
import noticeDetail from "@/components/Notice/components/notice-detail";
import MyAllocation from "./components/MyAllocation";
import { mapState } from "vuex";
export default {
  name: "home-page",
  components: {
    MyTask,
    MyManWork,
    MyApprove,
    noticeDetail,
    MyAllocation
  },
  data() {
    return {
      MyTaskList: []
    };
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount"]),
    unreadList(){
      if(this.Notice && this.Notice.length){
        return this.Notice.filter(t=>!t.read)
      }else{
        return []
      }
    }
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
    }
  }
};
</script>

<template>
  <el-row id="home-page" :gutter="15">
    <el-col :span="4">
      <MyTask :my-task-list="MyTaskList" :target-more="()=>$router.push({name:'my-task'})" />
    </el-col>
    <el-col :span="5">
      <MyManWork :my-tasks="MyTaskList" />
    </el-col>
    <el-col :span="5">
      <MyApprove />
    </el-col>
    <el-col :span="5">
      <el-card>
        <el-row
          slot="header"
          type="flex"
          justify="space-between"
          align="middle"
          class="card-header"
        >
          <el-badge
            :value="unreadCount"
            :hidden="!unreadCount"
            :max="99"
            class="item"
          >
            <span style="padding-right: 10px;">未读消息</span>
          </el-badge>
        </el-row>
        <noticeDetail :notice="unreadList" @getNoticeDetail="getNoticeDetail"></noticeDetail>
      </el-card>
    </el-col>
    <el-col :span="5">
      <MyAllocation/>
    </el-col>
  </el-row>
</template>

<style lang="scss">
#home-page {
  .el-button--text {
    padding: 0;
  }
}
</style>