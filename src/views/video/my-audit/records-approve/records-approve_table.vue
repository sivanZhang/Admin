<template>
  <el-table :data="recordsList" v-loading="isLoad">
    <el-table-column label="任务" header-align="center">
      <el-table-column label="任务名称" prop="approve_task__name" />
	  <el-table-column label="路径" prop="path" />
      <el-table-column label="任务内容" prop="approve_task__content" />
      <el-table-column label="任务状态">
        <template slot-scope="scope">{{scope.row.approve_task__status | taskStatus}}</template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="镜头号" prop="approve_asset__name" header-align="center" />
	<el-table-column label="所属项目" prop="approve_task__name" />
    <!-- <el-table-column label="项目" header-align="center">
      <el-table-column label="所属项目" prop="approve_task__name" />
      <el-table-column label="项目类型" prop="project__pro_type" :formatter="projectTypeFormat" />
      <el-table-column label="实习成绩" prop="score" />
    </el-table-column> -->
    <el-table-column label="审批" align="center">
      <el-table-column label="审批等级" align="center">
        <template slot-scope="scope">{{scope.row.approve_level}}级</template>
      </el-table-column>
      <el-table-column label="审批结果" align="center">
        <template slot-scope="scope">{{scope.row.approve_result?'同意':'拒绝'}}</template>
      </el-table-column>
      <el-table-column label="审批意见" prop="suggestion" align="center" />
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    recordsList: {
      default: [],
      type: Array
    },
    isLoad: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    projectTypeFormat(row, column, cellValue, index) {
      if (cellValue) {
        return "标准项目";
      } else {
        return "实训项目";
      }
    }
  }
};
</script>