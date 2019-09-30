<!-- 实训成员 -->
<template>
  <div id="training">
      <el-table
      ref="trainingMenber"
      :data="trainingMenber.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="{borderRight:0}"
      highlight-current-row
      v-loading="tableLoading"
      :border="false"
    >
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="参与人员" prop="username"></el-table-column>
        <el-table-column label="参与学校" prop="school"></el-table-column>
        <el-table-column label="参与任务数量" prop="task_num" align="center"></el-table-column>
        <el-table-column label="考勤" align="center">
            <el-table-column label="正常考勤" prop="normal"></el-table-column>
            <el-table-column label="迟到次数" prop="late"></el-table-column>
            <el-table-column label="早退次数" prop="leave_early"></el-table-column>
            <el-table-column label="旷课次数" prop="absentee"></el-table-column>
        </el-table-column>
        <el-table-column label="总得分" prop="total_score"></el-table-column>
        <el-table-column label="排名" prop="range"></el-table-column>
      </el-table>
       <div class="block" style="text-align: center;margin-top:10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="trainingMenber.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "training",
  components: {},
  props:["trainingMenber"],
  data() {
    return {
         currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
    };
  },
  watch: {},
  methods: {
      //分页
    handleSizeChange(val) {
      this.pageSize = val;
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>