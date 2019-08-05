<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="镜头" name="first">
        <tab-assets @refresh="getAssetList()" :AssetList="TableData" />
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="first">
        <tab-assets @refresh="getAssetList()" :AssetList="TableData" />
      </el-tab-pane>
      <el-tab-pane label="任务" name="second">
        <tab-task :AssetList="TableData" />
      </el-tab-pane>
      <el-tab-pane label="团队策划" name="third">团队策划</el-tab-pane>
      <el-tab-pane label="控制面板" name="fourth">控制面板</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryAssets } from "@/api/assets";
import tabTask from "./components/tab-task";
import tabAssets from "./components/tab-assets";

export default {
  name: "project-detail",
  components: {
    tabTask,
    tabAssets
  },
  data() {
    return {
      activeName: "first",
      TableData: []
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
        this.TableData = [...data.msg];
      });
    }
  },
  created() {
    this.getAssetList();
  }
};
</script>

<style lang="scss" scoped>
</style>
