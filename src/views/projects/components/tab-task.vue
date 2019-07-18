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
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-delete"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "tab-task"
};
</script>

<style>
</style>
