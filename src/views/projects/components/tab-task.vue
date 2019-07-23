<template>
  <div id="task">
    <div>
      <el-button icon="el-icon-plus">创建</el-button>
      <el-button icon="el-icon-download">导入</el-button>
      <el-dropdown split-button @click="handleClick">
        <svg-icon icon-class="save"></svg-icon>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-delete"></el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="任务"></el-table-column>
        <el-table-column prop="name" label="类型"></el-table-column>
        <el-table-column prop="address" label="状态"></el-table-column>
        <el-table-column prop="address" label="执行人"></el-table-column>
        <el-table-column prop="address" label="描述"></el-table-column>
        <el-table-column prop="address" label="截止日期"></el-table-column>
        <el-table-column prop="address" label="预设时间（小时）"></el-table-column>
        <el-table-column prop="address" label="结余（小时）"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "tab-task",
  data(){
    return {
      tableData:[]
    }
  }
};
</script>

<style>
</style>
