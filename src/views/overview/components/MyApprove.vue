<template>
  <el-card>
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span><svg-icon icon-class="caishenhe"/> 我的审核</span>
      <!-- <el-button type="text" @click="isDialogShow = true">填报工时</el-button> -->
    </el-row>

    <el-divider content-position="left">
      任务 
      <el-button type="text" @click="$router.push({name:'approve'})">查看</el-button>
    </el-divider>
    <el-table :data="AuditList" v-loading="tableLoading">
      <el-table-column prop="task.name" label="任务" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user.username" label="提交人"></el-table-column>
      <el-table-column prop="task.dept.name" label="工种"></el-table-column>
    </el-table>

    <el-divider content-position="left">
      加班 
      <el-button type="text" @click="$router.push({name:'approve-extra-work'})">查看</el-button>
    </el-divider>
    <el-table :data="ApproveOverTime" v-loading="tableLoading1">
      <el-table-column prop="overtime_creator.username" label="申请人"></el-table-column>
      <el-table-column prop="task.name" label="加班任务"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableLoading: false,
      tableLoading1: false
    };
  },
  computed: {
    ...mapState("approve", ["AuditList", "ApproveOverTime"])
  },
  created() {
    if (!this.AuditList || !this.ApproveOverTime) {
      this.getMyApproves();
    }
  },
  methods: {
    //获取任务审核列表
    getMyApproves() {
      this.tableLoading = true;
      this.tableLoading1 = true;
      this.$store.dispatch("approve/get_Approve").finally(() => {
        this.tableLoading = false;
      });
      this.$store.dispatch("approve/get_ApproveOverTime").finally(() => {
        this.tableLoading1 = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>