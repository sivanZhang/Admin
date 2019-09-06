<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="镜头" name="tab0" lazy>
        <tab-assets
          :activeName="activeName"
          drawer-type="scene"
        >
          <span slot="add">添加镜头</span>
          <span slot="import">镜头导入</span>
        </tab-assets>
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="tab1" lazy>
        <tab-assets
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane label="任务" name="tab2">
        <tab-task ref="tab-task" :asset-list="AssetList"/>
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
export default {
  name: "project-detail",
  components: {
    tabTask,
    tabAssets,
    configProject
  },
  data() {
    return {
      activeName: this.$route.query.tab ? this.$route.query.tab : "tab0",
      AssetList: [],
      asset_type: 0,
      project: {},
      configTab: this.$route.query.tab2 ? this.$route.query.tab2 : "first"
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "tab2") {
          this.$refs['tab-task'].getTasks();
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
        }
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
    this.getProjectDetail();
  }
};
</script>

<style lang="scss" scoped>
</style>
