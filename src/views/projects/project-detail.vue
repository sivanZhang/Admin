<template>
  <div>
    <label for>项目: {{project.name}}</label>
    <el-tabs v-model="activeName">
      <template v-if="project.pro_type === 0">
        <el-tab-pane label="实训成员" name="tab5" lazy>
          <training :trainingMenber="trainingMenber" />
        </el-tab-pane>
      </template>
      <el-tab-pane label="镜头" name="tab0" lazy>
        <tab-assets
          ref="scene"
          :activeName="activeName"
          drawer-type="scene"
          :assetJump="assetJump"
          :assetId="assetId"
          @jumpName="jumpName"
        >
          <span slot="add">添加镜头</span>
          <span slot="import">镜头导入</span>
        </tab-assets>
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="tab1" lazy>
        <tab-assets
          ref="scene2"
          :activeName="activeName"
          :assetJump="assetJump"
          :assetId="assetId"
          @jumpName="jumpName"
        />
      </el-tab-pane>
      <el-tab-pane label="任务" name="tab2" >
        <tab-task ref="tab-task" :asset-list="AssetList" @getAssetList="getAssetList()" />
      </el-tab-pane>
      <el-tab-pane label="项目设置" name="tab3" lazy>
        <configProject :project="project" @refresh="getProjectDetail" :configTab="configTab" />
      </el-tab-pane>
      <el-tab-pane label="数据统计" name="tab4" lazy>
        <statistics />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryAssets } from "@/api/assets";
import tabTask from "./components/tab-task";
import tabAssets from "./components/tab-assets";
import configProject from "./components/configProject";
import training from "./components/training-member";
import { getProjects } from "@/api/project";
import { getTrainingProject, getProjectJoinMeb } from "@/api/training";
import statistics from "./components/statistics";
export default {
  name: "project-detail",
  components: {
    tabTask,
    tabAssets,
    configProject,
    statistics,
    training
  },
  data() {
    return {
      activeName: this.$route.query.tab ? this.$route.query.tab : "tab0",
      AssetList: [],
      asset_type: 0,
      project: {},
      configTab: this.$route.query.tab2 ? this.$route.query.tab2 : "first",
      assetId: null,
      assetJump: null,
      trainingMenber: []
    };
  },
  watch: {
    project: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          if (newVal.pro_type === 0) {
            this.activeName = "tab5";
          }
        }
      }
    }
  },
  methods: {
    jumpName(val){
      this.activeName = val
    },
    getAssetList() {
      let payload = {
        project: this.$route.params.id,
        sort: "date"
      };
      queryAssets(payload).then(({ data }) => {
        if (data.status === 0) {
          this.AssetList = [...data.msg];
        }
      });
    },
    getProjectDetail() {
      // console.log(this.$route.query.type);
      if (this.$route.query.type == "0") {
        // this.activeName = "tab5";
        getTrainingProject({ id: this.$route.params.id }).then(({ data }) => {
          this.project = data.msg;
        });
        getProjectJoinMeb({ id: this.$route.params.id, users: "users" }).then(
          ({ data }) => {
            this.trainingMenber = [...data.msg];
          }
        );
      } else {
        getProjects({ id: this.$route.params.id }).then(({ data }) => {
          this.project = data.msg;
        });
      }
    }
  },
  created() {
    // if(this.$route.query.tab === "tab2"){
    //   this.activeName = "tab2"
    // }
    console.log(this.$route.query.tab);
    this.getAssetList();
    this.getProjectDetail();
    if (this.$route.query.asset_type && this.$route.query.asset_type === "1") {
      this.activeName = "tab1";
      this.assetJump = this.$route.query.tab;
    }
    if (this.$route.query.asset_type && this.$route.query.asset_type === "0") {
      this.activeName = "tab0";
      this.assetJump = this.$route.query.tab;
    }
    this.assetId = this.$route.query.asset;

    //console.log(this.assetId);
  },
  //每次路由从批量上传进入，会刷新
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "asset-import") {
        vm.$refs["scene"].getAssetList();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
