<template>
  <div>
    <el-page-header @back="goBack" content="详情页面">
    </el-page-header>

    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">任务</el-menu-item>

      <el-menu-item index="2">版本</el-menu-item>
      <el-submenu index="3">
        <template slot="title">团队策划</template>
        <el-menu-item index="3-1">选项1</el-menu-item>
        <el-menu-item index="3-2">选项2</el-menu-item>
        <el-menu-item index="3-3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">控制面板</template>
        <el-menu-item index="4-1">选项1</el-menu-item>
        <el-menu-item index="4-2">选项2</el-menu-item>
        <el-menu-item index="4-3">选项3</el-menu-item>
      </el-submenu>
    </el-menu>
    <div>
      <el-button icon="el-icon-plus">创建</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "create-project",
    data() {
      return {};
    }
  };
</script>

<style lang="scss" scoped>
</style>