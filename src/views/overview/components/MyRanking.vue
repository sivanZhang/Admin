<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span class="card-header">我的排名 (加权后的排名)</span>
    </el-row>
    <el-table :data="RankList" v-loading="tableLoading">
      <el-table-column prop="rank" label="加权排名"></el-table-column>
      <el-table-column prop="asset__name" label="镜头号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="link__content" label="环节内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="task_score" label="任务成绩" width="60"></el-table-column>
      <el-table-column prop="attendance_count" label="迟到早退次数" width="60"></el-table-column>
      <el-table-column prop="submition_rank" label="提交时间排名" width="60"></el-table-column>
      <el-table-column prop="submition_time" label="提交时间" width="85">
        <template slot-scope="scope">{{scope.row.submition_time|dateTimeFormat}}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import { myWeightRecord } from "@/api/training";
export default {
  data() {
    return {
      RankList: [],
      tableLoading: false
    };
  },
  created() {
    this.myWeightRecordList();
  },
  methods: {
    myWeightRecordList() {
      this.tableLoading = true;
      myWeightRecord().then(({ data }) => {
        this.RankList = [...data.msg];
        this.tableLoading = false;
      });
    }
  }
};
</script>