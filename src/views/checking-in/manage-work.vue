<template>
  <div id="manage-work">
    <!-- <el-table :data="leaverhourList" v-loading="tableLoading">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="overtime_creator.username" label="申请人"></el-table-column>
      <el-table-column prop="task.name" label="加班任务"></el-table-column>
      <el-table-column prop="reason" label="加班原因"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时"></el-table-column>
      <el-table-column prop="level" label="审批等级"></el-table-column>
      <el-table-column prop="approver.username" label="审批人"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row.id)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <el-button type="primary" @click="$router.push({name:'clockin-import'})">打卡记录上传</el-button>
  </div>
</template>

<script>
import { updateWorkLog } from "@/api/checkingIn";
export default {
  name: "manage-work",
  data() {
    return {
      leaverhourList: []
    };
  },
  methods: {}
};
</script>