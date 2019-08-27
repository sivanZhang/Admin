<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="镜头" name="tab0">
        <tab-assets @refresh="getAssetList()" :asset-list="AssetList" @get-tasks="getTaskList" :activeName="activeName"/>
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="tab1">
        <tab-assets @refresh="getAssetList()" :asset-list="AssetList" @get-tasks="getTaskList" :activeName="activeName"/>
      </el-tab-pane>
      <el-tab-pane label="任务" name="tab2">
        <tab-task :asset-list="AssetList" :task-list="TaskList" @get-tasks="getTaskList" />
      </el-tab-pane>
      <el-tab-pane label="项目设置" name="tab3">
        <configProject :project="project" @refresh="getProjectDetail"/>
      </el-tab-pane>
      <el-tab-pane label="控制面板" name="tab4">控制面板</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryAssets } from "@/api/assets";
import tabTask from "./components/tab-task";
import tabAssets from "./components/tab-assets";
import configProject from "./components/configProject"
import { projectDetail } from "@/api/project";
import { queryTask } from "@/api/task";
export default {
  name: "project-detail",
  components: {
    tabTask,
    tabAssets,
    configProject
  },
  data() {
    return {
      activeName: "tab0",
      AssetList: [],
      allAssetList: [],
      TaskList: [],
      asset_type: 0,
      project: {}
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "tab0") {
          this.asset_type = 0;
          this.getAssetList();
        }
        if (newVal === "tab1") {
          this.asset_type = 1;
          this.getAssetList();
        }
        if (newVal === "tab2") {
          this.asset_type = null;
          this.getAssetList();
        }
        if (newVal === "tab3") {
          this.getProjectDetail();
        }
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getAssetList() {
      queryAssets({
        project: this.$route.params.id,
        asset_type: this.asset_type
      }).then(({ data }) => {
        this.AssetList = [...data.msg];
      });
    },
    getAllAssetList() {
      queryAssets({
        project: this.$route.params.id
      }).then(({ data }) => {
        this.allAssetList = [...data.msg];
        console.log(this.allAssetList);
      });
    },
    getTaskList(keywords) {
      let data = {
        project: this.$route.params.id
      };
      if (keywords) {
        data = {
          ...data,
          name: keywords
        };
      }
      queryTask(data).then(({ data }) => {
        this.TaskList = [...data.msg];
      });
    },
    getProjectDetail() {
      projectDetail({ id: this.$route.params.id }).then(({ data }) => {
        this.project = data.msg;
        //console.log(this.project);
      });
    }
  },
  created() {
    this.getAssetList();
    this.getTaskList();
    this.getProjectDetail()
  }
};
</script>

<style lang="scss" scoped>
</style>
