<template>
  <div id="deptlist">
    
    <div v-if="project">
      <router-link :to="`/projects/project-detail/${id}`">
        <el-button type="primary" icon="el-icon-edit">编辑参与工种</el-button>
      </router-link>

      <el-col style="padding:10px" v-for="(item,index) of deptList" :key="index">{{item.name}}</el-col>
    </div>
  </div>
</template>

<script>
export default {
  name: "deptlist",
  props: ["project"],
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>

