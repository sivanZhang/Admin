<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span>我的成绩单</span>
    </el-row>
    <el-table :data="RecordList" v-loading="tableLoading">
      <el-table-column prop="rank" label="排名"></el-table-column>
      <el-table-column prop="asset__name" label="镜头号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="link__content" label="环节内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="approve_task" label="任务ID"></el-table-column>
      <el-table-column prop="score" label="审批评分"></el-table-column>
      <el-table-column prop="submition_count" label="提交次数"></el-table-column>
      <el-table-column
        prop="submit_flag"
        label="是否提交作业(提交并审批通过的)"
        :formatter="submitionFormat"
        width="110"
      ></el-table-column>
      <el-table-column prop="submit_time" label="提交时间" width="90">
        <template slot-scope="scope">{{scope.row.submit_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="comment" label="评论"></el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import { myRecord } from "@/api/training";
export default {
  data() {
    return {
      RecordList: [],
      tableLoading: false
    };
  },
  created() {
    this.myRecordList();
  },
  methods: {
    //是否提交作业格式化显示
    submitionFormat: function(row, column) {
      switch (row.submit_flag) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    myRecordList() {
      this.tableLoading = true;
      myRecord().then(({ data }) => {
        this.RecordList = [...data.msg];
        this.tableLoading = false;
      });
    }
  }
};
</script>