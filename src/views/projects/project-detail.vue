<template>
  <div>
    <label for>项目: {{project.name}}</label>
    <el-tabs v-model="activeName">
      <template v-if="!trainingAuth">
      <el-tab-pane label="制作要求" name="tab6" lazy>
        <div style="width:50%">
          <info @refreshProject="getProjectDetail()" :project="project" configImg="img" />
        </div>
      </el-tab-pane>
      </template>
      <template v-if="project.pro_type === 0">
        <el-tab-pane label="练习生" name="tab5" lazy>
          <training :trainingMenber="trainingMenber" />
        </el-tab-pane>
      </template>
      <template v-if="!trainingAuth">
      <el-tab-pane label="进度控制" name="tab7" lazy>
        <progressContral @switch-task-tab="jumpName('tab2')"/>
      </el-tab-pane>
      </template>
      <template v-if="!trainingAuth">
      <el-tab-pane label="镜头" name="tab0" lazy>
        <tab-assets
          ref="scene"
          :activeName="activeName"
          drawer-type="scene"
          :assetJump="assetJump"
          :assetId="assetId"
          @jumpName="jumpName"
          :groupType="groupType"
          @getGroup="getGroupAuth"
          notShow="true"
        >
          <span slot="add">添加镜头</span>
          <span slot="import">镜头导入</span>
          <span slot="upload">镜头导出</span>
        </tab-assets>
      </el-tab-pane>
      <el-tab-pane label="资产管理" name="tab1" lazy>
        <tab-assets
          ref="scene2"
          :activeName="activeName"
          :assetJump="assetJump"
          :assetId="assetId"
          @jumpName="jumpName"
          :groupType="groupType"
          @getGroup="getGroupAuth"
          notShow="false"
        />
      </el-tab-pane>
      <el-tab-pane label="任务" name="tab2" lazy>
        <tab-task ref="tabtask" 
        :activeName="activeName"
        @jumpName="jumpName"
        :asset-list="AssetList" @getAssetList="getAssetList()" />
      </el-tab-pane>
      </template>
      <template v-if="project.pro_type === 0">
      <el-tab-pane label="成绩单" name="tab4" lazy>
        <reportCard />
      </el-tab-pane>
      </template>
      <!-- <el-tab-pane label="数据统计" name="tab4" lazy>
        <statistics />
      </el-tab-pane> -->
      <template v-if="!trainingAuth">
      <el-tab-pane label="项目设置" name="tab3" lazy>
        <configProject
          :project="project"
          @refresh="getProjectDetail"
          :configTab="configTab"
          :auth="auth"
        />
      </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { queryAssets } from "@/api/assets";
import tabTask from "./components/tab-task/index";
import tabAssets from "./components/tab-assets/index";
import configProject from "./components/configProject";
import training from "./components/training-member";
import progressContral from "./components/progressContral/progressContral";
import { getProjects } from "@/api/project";
import { getTrainingProject, getProjectJoinMeb ,allScene} from "@/api/training";
import statistics from "./components/statistics";
import reportCard from "./components/reportCard";
import info from "@/components/projectDrawer/components/info";
export default {
  name: "project-detail",
  components: {
    tabTask,
    tabAssets,
    configProject,
    statistics,
    training,
    info,
    progressContral,
    reportCard
  },
  data() {
    return {
      activeName: this.$route.query.tab ? this.$route.query.tab : "tab6",
      AssetList: [],
      asset_type: 0,
      project: {},
      configTab: this.$route.query.tab2 ? this.$route.query.tab2 : "second",
      assetId: null,
      assetJump: null,
      trainingMenber: [],
      groupType: "",
      auth:null,
      trainingAuth:this.$store.state.login.userInfo.auth.training_manager
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "tab0") {
          this.$nextTick(() => {
            this.$refs["scene"].getAssetList(2);
          });
        } else if (newVal === "tab1") {
          this.$nextTick(() => {
          this.$refs["scene2"].getAssetList(2);
          })
        }else if(newVal === "tab2"){
          this.$nextTick(() => {
            this.$refs["tabtask"].getAssetList(2);
          });
        }
      }
    }
  },
  methods: {
    jumpName(val) {
      this.activeName = val;
    },
    getAssetList() {
      let payload = {
        project: this.$route.params.id,
        all: ""
      };
      allScene(payload).then(({ data }) => {
        if (data.status == 0) {
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
          this.auth = data.auth.manage_project;
        });
        getProjectJoinMeb({ id: this.$route.params.id, users: "users" }).then(
          ({ data }) => {
            [...data.msg].forEach((item, index) => {
              item.members.forEach(ct => {
                this.trainingMenber.push({
                  ...ct,
                  id: item.id,
                  name: item.name
                });
              });
            });
          }
        );
      } else {
        getProjects({ id: this.$route.params.id }).then(({ data }) => {
          this.project = data.msg;
          this.auth = data.auth.manage_project;
        });
      }
    },
    getGroupAuth() {
      this.groupType = this.$route.query.type;
    }
  },
  created() {
   //如果是练习生客户，则刚进项目默认展示实习成员页面
    if(this.trainingAuth){
      this.activeName = "tab5";
    }
    if (this.$route.query.type === 0) {
      // this.activeName = "tab5";
      this.groupType = "0";
    } else {
      this.groupType = "1";
    }
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
  },
  //每次路由从批量上传进入，会刷新
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "asset-import") {
        vm.$refs["scene"].getAssetList(2);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
