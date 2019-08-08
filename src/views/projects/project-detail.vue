<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="镜头" name="tab0">
        <tab-lens  />
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="tab1">
        <tab-assets @refresh="getAssetList()" :asset-list="AssetList" @get-tasks="getTaskList()" />
      </el-tab-pane>
      <el-tab-pane label="任务" name="tab2">
        <tab-task :asset-list="AssetList" :task-list="TaskList" @get-tasks="getTaskList()" />
      </el-tab-pane>
      <el-tab-pane label="团队策划" name="tab3">团队策划</el-tab-pane>
      <el-tab-pane label="控制面板" name="tab4">控制面板</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryAssets } from "@/api/assets";
import tabTask from "./components/tab-task";
import tabAssets from "./components/tab-assets";
import tabLens from "./components/tab-lens"
import { queryTask } from "@/api/task";
export default {
  name: "project-detail",
  components: {
    tabTask,
    tabAssets,
    tabLens
  },
  data() {
    return {
      activeName: "tab0",
      AssetList: [],
      TaskList: []
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getAssetList() {
      queryAssets({
        project: this.$route.params.id
      }).then(({ data }) => {
        this.AssetList = [...data.msg];
      });
    },
    getTaskList() {
      queryTask({ project: this.$route.params.id }).then(({ data }) => {
        this.TaskList = [...data.msg];
      });
    }
  },
  created() {
    this.getAssetList();
    this.getTaskList();
    this.$store.dispatch("admin/get_DeptUsers");
  }
};
</script>

<style lang="scss" scoped>
</style>
