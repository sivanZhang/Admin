<!-- 实训成员 -->
<template>
  <div id="training" ref="drawer-parent">
    <el-table
      ref="trainingMenber"
      :data="trainingMenber.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      
      :span-method="objectSpanMethod"
    >
      <el-table-column label="所属分组" prop="name"></el-table-column>
      <el-table-column label="实训人员">
        <template slot-scope="scope">
          <div @click="openRanking()" class="links">
            {{scope.row.username}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学校" prop="school"></el-table-column>
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
    <Drawer
      scrollable
      closable
      draggable
      v-model="isRankingShow"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      :title="usernameTitle"
    >
    排名雷达图
    </Drawer>
  </div>
</template>  
<script>
import thumbtackMixin from "@/utils/thumbtack-mixin";
export default {
  name: "training",
  components: {},
  mixins: [thumbtackMixin],
  props: ["trainingMenber"],
  data() {
    return {
      usernameTitle:'',
      isRankingShow:false,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100]
    };
  },
  watch: {},
  computed: {
    groupNum() {
      return new Set(this.trainingMenber.map(item => item.name));
    }
  },
  methods: {
    // 打开个人排名抽屉
    openRanking(){
      this.isRankingShow = true
    },
    Group(name) {
      return this.trainingMenber.filter(item => item.name == name).length;
    },
    NameLen(name) {
      const tmp = Array.from(this.groupNum);
      const index = tmp.indexOf(name);
      let len = 0;
      for (let i = 0; i < index; i++) {
        len += this.Group(tmp[i]);
      }
      return len;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const len = this.Group(row.name);
        const lenName = this.NameLen(row.name);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
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
.links{
  color: #2d8cf0;
  cursor: pointer;
}
</style>