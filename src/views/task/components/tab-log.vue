<template functional>
  <el-table :data="props.loglist" style="width: 100%" borders v-loading="props.logsLoading">
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="content" label="任务内容"></el-table-column>
    <el-table-column label="任务状态">
      <template slot-scope="scope">{{scope.row.type|projectStatus}}</template>
    </el-table-column>
    <!-- 
    <el-table-column prop="end_date" label="截止日期">
      <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
    </el-table-column>-->
    <el-table-column prop="schedule" label="完成进度"></el-table-column>
    <el-table-column prop="labor_hour" label="工时"></el-table-column>
    <el-table-column prop="executor_date" label="日期"></el-table-column>
  </el-table>
</template>

