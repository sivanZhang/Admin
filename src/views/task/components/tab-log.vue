<template>
  <el-table
    :data="LogList"
    style="width: 100%;margin-top:20px"
    highlight-current-row
    row-key="id"
    :tree-props="{ children: 'sub_task' }"
    borders
  >
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="content" label="任务内容"></el-table-column>
    <el-table-column label="任务状态">
      <template slot-scope="scope">{{scope.row.status|projectStatus}}</template>
    </el-table-column>
    <el-table-column label="优先级">
      <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
    </el-table-column>
    <el-table-column label="开始日期">
      <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
    </el-table-column>
    <el-table-column prop="end_date" label="截止日期">
      <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
    </el-table-column>
    <el-table-column prop="total_hour" label="预设时间（小时）"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
      LogList:{
          type:Array
      }
  }
};
</script>

<style lang="less" scoped>
</style>

