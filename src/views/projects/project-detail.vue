<template>
  <div>
    <el-page-header @back="goBack">
    </el-page-header>

    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">任务</el-menu-item>

      <el-menu-item index="2">资产管理</el-menu-item>
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
    <tab-task/>
  </div>
</template>

<script>
import tabTask from './components/tab-task'
  export default {
    name: "project-detail",
    components:{
      tabTask
    },
    data() {
      return {};
    },
    methods:{
        goBack(){
            this.$router.go(-1);
        }
    },
    created(){
    },
    beforeRouteEnter (to, from, next) {
        next()
    }
  }
</script>

<style lang="scss" scoped>
</style>