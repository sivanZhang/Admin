<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="镜头" name="tab0">
        <tab-assets
          @get-tasks="getTaskList"
          :activeName="activeName"
          drawer-type="scene"
        >
          <span slot="add">添加镜头</span>
          <span slot="import">镜头导入</span>
        </tab-assets>
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="tab1">
        <tab-assets
          @get-tasks="getTaskList"
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane label="任务" name="tab2">
        <tab-task :asset-list="AssetList" :task-list="TaskList" @get-tasks="getTaskList" />
      </el-tab-pane>
      <el-tab-pane label="项目设置" name="tab3">
        <configProject :project="project" @refresh="getProjectDetail" :configTab="configTab" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryAssets } from "@/api/assets";
import tabTask from "./components/tab-task";
import tabAssets from "./components/tab-assets";
import configProject from "./components/configProject";
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
      total: 0,
      activeName: this.$route.query.tab ? this.$route.query.tab : "tab0",
      AssetList: [],
      TaskList: [],
      asset_type: 0,
      project: {},
      configTab: this.$route.query.tab2 ? this.$route.query.tab2 : "tab0"
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "tab2") {
          this.getAssetList();
        }
        if (newVal === "tab3") {
          this.getProjectDetail();
        }
      }
    }
  },
  methods: {
    getAssetList() {
      let payload = {
          project: this.$route.params.id,
        };
      queryAssets(payload).then(({ data }) => {
        if (data.status === 0) {
          this.AssetList = [...data.msg];
          this.total = data.page_count;
        }
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
    this.getProjectDetail();
  }
};
</script>

<style lang="scss" scoped>
</style>
