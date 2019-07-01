<template>
  <div class="dashboard-container">
    <el-tabs tab-position="left" style="height: 200px;">
      <el-tab-pane label="Users">Users</el-tab-pane>
      <el-tab-pane label="Ungrouped users">Ungrouped users</el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {}
};
</script>

<style lang="scss" scoped>
.el-tabs--left .el-tabs__nav-scroll {
  height: auto;
}
</style>
