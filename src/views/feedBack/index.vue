<!-- 反馈列表 -->
<template>
  <div id="feedback">
    <el-table
      :data="FeedbackList"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :border="false"
    >
      <el-table-column prop="task.name" label="任务名称"></el-table-column>
      <el-table-column prop="result" label="审批结果">
        <template slot-scope="scope">
          <div :style="{color:scope.row.result?'#19be6b':'#ed4014'}">{{scope.row.result?'通过':'未通过'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="suggestion" label="审批意见"></el-table-column>
      <el-table-column label="任务进度" prop="task.schedule">
        <template slot-scope="scope">
          <el-progress :stroke-width="12" :percentage="scope.row.task.schedule"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="优先级" prop="task.priority">
        <template slot-scope="scope">{{scope.row.task.priority|taskPriority}}</template>
      </el-table-column>
      <el-table-column label="任务状态" prop="task.statements"></el-table-column>
      <el-table-column label="提交次数" prop="task.submit_num"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFeedback } from "@/api/task";
export default {
  name: "feedback",
  components: {},
  data() {
    return {
      FeedbackList: []
    };
  },
  watch: {},
  methods: {},
  created() {
    const PARAMS = { latest: "", page: 1, pagenum: 100 };
    getFeedback(PARAMS).then(res => {
      if (res.data.status === 0) {
        this.FeedbackList = [...res.data.msg];
      } else {
        this.$message.error("审批反馈：" + res.data.msg);
      }
    });
  }
};
</script>
<style lang='scss' scoped>
</style>