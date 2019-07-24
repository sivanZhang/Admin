<template>
  <div>
    <el-page-header @back="goBack">
    </el-page-header>

    <!--        <template slot="title">团队策划</template>-->
    <!--        <el-menu-item index="3-1">选项1</el-menu-item>-->
    <!--        <el-menu-item index="3-2">选项2</el-menu-item>-->
    <!--        <el-menu-item index="3-3">选项3</el-menu-item>-->
    <!--      </el-submenu>-->
    <!--      <el-submenu index="4">-->
    <!--        <template slot="title">控制面板</template>-->
    <!--        <el-menu-item index="4-1">选项1</el-menu-item>-->
    <!--        <el-menu-item index="4-2">选项2</el-menu-item>-->
    <!--        <el-menu-item index="4-3">选项3</el-menu-item>-->
    <!--      </el-submenu>-->

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="任务" name="first">
        <tab-task></tab-task>
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="second">
        <tab-assets></tab-assets>
      </el-tab-pane>
      <el-tab-pane label="团队策划" name="third">团队策划</el-tab-pane>
      <el-tab-pane label="控制面板" name="fourth">控制面板</el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import tabTask from './components/tab-task'
  import tabAssets from './components/tab-assets'

  export default {
    name: "project-detail",
    components: {
      tabTask,
      tabAssets
    },
    data() {
      return {
        componentId: 'tab-task',
        activeName: 'first',
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    created() {
    },
    beforeRouteEnter(to, from, next) {
      next()
    }
  }
</script>

<style lang="scss" scoped>
</style>
