<template>
  <div id="project">
    <div class="container" ref="drawer-parent">
      <Drawer
        scrollable
        closable
        draggable
        :inner="isInner"
        v-model="isDrawerShow"
        width="526px"
        :transfer="false"
        :mask="false"
        :mask-style="{backgroundColor: 'transparent'}"
        :append-to-body="true"
      >
        <drawer-header :project="project" style="padding:10px" />
        <project-drawer
          :project="project"
          :RemarksData="RemarksData"
          @refreshRemark="updateRemark()"
           @refreshProject="getProjectDetail()"
          :assetsList="TableData"
          :taskList="taskList"
          :attrsList="attrsList"
          :customAttrs="customAttrs"
          @refresh_customAttrs="RefreshcustomAttrs"
          @refresh="show"
          :attrsTypeNum="attrsTypeNum"

        />
      </Drawer>
      <template v-if="!trainingProject">
        <div class="item-project" v-for="(item,index) in ProjectList" :key="index">
          <el-card shadow="hover" :body-style="{ padding: '0px' }" :class="{active3:item.status===3}">
            <div class="dropdow">
              <el-dropdown placement="bottom" trigger="click">
                <el-button type="text" style="color:#333">
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="margin-top:0px">
                  <el-dropdown-item @click.native="showImg($store.state.BASE_URL+item.image)">
                    查看大图
                    <!-- <router-link :to="`/projects/project-detail/${item.id}`">查看大图</router-link> -->
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="show(item)">在侧边栏中打开</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="delProject(item)"
                    v-if="$store.state.login.userInfo.auth.manage_project"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="color" :style="{backgroundColor:item.color||'transparent'}" v-if="item.status === 3"></div>
            <div slot="header" class="box-card-header">
              <router-link :to="{name:'project-detail',params:{id:item.id},query:{type:item.pro_type}}">
                <el-image
                  class="mini-image"
                  :src="item.image?$store.state.BASE_URL+item.image:''"
                  fit="cover"
                  style="height:100%;width:100%;"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture" style="color:#909399"></i>
                  </div>
                </el-image>
              </router-link>
            </div>
            <div style="padding: 15px;">
              <router-link :to="{name:'project-detail',params:{id:item.id},query:{type:item.pro_type}}">
                <mallki class-name="mallki-text" :text="item.name" />
              </router-link>
              <!-- <p>创建者：{{item.creator_name}} {{item.date|dateTimeFormat}}</p> -->
              <el-row @click.native="show(item)">
                <el-col :span="12">
                  <p class="subtitle">工作流</p>
                  <div>{{item.status|projectStatus}}</div>
                </el-col>
                <el-col :span="12">
                  <p class="subtitle">创建者</p>
                    {{item.creator_name}} 
                    <div style="font-size:12px;">{{item.date|dateTimeFormat}}</div>
                </el-col>
                
                <el-col :span="12">
                  <p class="subtitle">开始日期</p>
                  <div>{{item.date_start|dateFormat}}</div>
                </el-col>
                <el-col :span="12">
                  <p class="subtitle">截止日期</p>
                  <div>{{item.date_end |dateFormat}}</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </template>
      <template v-else>
        <div class="item-project" v-for="(item,index) in trainingProject" :key="index">
          <el-card shadow="hover" :body-style="{ padding: '0px' }" :class="{active3:item.status===3}">
            <div class="dropdow">
              <el-dropdown placement="bottom" trigger="click">
                <el-button type="text" style="color:#333">
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="margin-top:0px">
                  <el-dropdown-item @click.native="showImg($store.state.BASE_URL+item.image)">
                    查看大图
                    <!-- <router-link :to="`/projects/project-detail/${item.id}`">查看大图</router-link> -->
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="show(item)">在侧边栏中打开</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="delProject(item)"
                    v-if="$store.state.login.userInfo.auth.manage_project"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="color" :style="{backgroundColor:item.color||'transparent'}" v-if="item.status === 3"></div>
            <div slot="header" class="box-card-header">
              <router-link :to="{name:'project-detail',params:{id:item.id},query:{type:item.pro_type}}">
                <el-image
                  class="mini-image"
                  :src="item.image?$store.state.BASE_URL+item.image:''"
                  fit="cover"
                  style="height:100%;width:100%;"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture" style="color:#909399"></i>
                  </div>
                </el-image>
              </router-link>
            </div>
            <div style="padding: 15px;">
              <router-link
                :to="{name:'project-detail',params:{id:item.id},query:{type:item.pro_type}}"
              >
                <mallki class-name="mallki-text" :text="item.name" />
              </router-link>
              <!-- <p>创建者：{{item.creator_name}} {{item.date|dateTimeFormat}}</p> -->
              <el-row @click.native="show(item)">
                <el-col :span="12">
                  <p class="subtitle">工作流</p>
                  <div>{{item.status|projectStatus}}</div>
                </el-col>
                <el-col :span="12">
                  <p class="subtitle">创建者</p>
                   {{item.creator_name}}
                   <div style="font-size:12px;">{{item.date|dateTimeFormat}}</div>
                </el-col>
                
                <el-col :span="12">
                  <p class="subtitle">开始日期</p>
                  <div>{{item.date_start|dateFormat}}</div>
                </el-col>
                <el-col :span="12">
                  <p class="subtitle">截止日期</p>
                  <div>{{item.date_end |dateFormat}}</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </template>
    <!-- 添加使用帮助 -->
      <el-tooltip class="item" effect="dark" content="使用帮助" placement="top">
        <div class="Instructions" @click="openExplain()">
           <span class="btn-explain">
              <svg-icon style="icon" icon-class="instruction" />
           </span>
         </div>
      </el-tooltip>
    </div>
    <el-dialog  title="注意事项" :visible.sync="dialogVisible" width="365px">
      <div class="notice-matter">
        <div style="font-size:12px">
          <h3>权限控制说明</h3>
          <div class="notice-content" style="padding-top:3px">
            <span style="font-weight:bold">制片&nbsp;/&nbsp;统筹:</span>&nbsp;拥有所有项目的全部权限
          </div>
          <div class="notice-content">
            <span style="font-weight:bold">组长:</span>&nbsp;可以查看项目的部门&nbsp;/&nbsp;镜头&nbsp;/&nbsp;信息属性
          </div>
          <div class="notice-content">
            <span style="font-weight:bold">制作人员:</span>&nbsp;可以查看本人的任务 &nbsp;/&nbsp;镜头&nbsp;/&nbsp;自己参与的项目
          </div>
          <div class="notice-content">
            <span style="font-weight:bold">全部人员:</span>&nbsp;可以查看素材库
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="dialog" :visible.sync="isShowImg" width="768px" top="80px" :show-close="false">
      <img :src="src" style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getRemark } from "@/api/remark";
import { queryAssets } from "@/api/assets";
import { queryTask } from "@/api/task";
import Mallki from "@/components/TextHoverEffect/Mallki";
import projectDrawer from "@/components/projectDrawer";
import DrawerHeader from "@/components/projectDrawer/components/Header";
import thumbtackMixin from "@/utils/thumbtack-mixin"
import { delOneProject } from "@/api/project";
import { searchBind, getAttrsEntityList } from "@/api/attrs";
import { getProjects } from "@/api/project";
import { getTrainingProject, getProjectJoinMeb ,allScene} from "@/api/training";
export default {
  name: "project",
  mixins: [thumbtackMixin], //drawer图钉效果
  components: {
    Mallki,
    projectDrawer,
    DrawerHeader
  },
  data() {
    return {
      isShowImg: false,
      src: "",
      isDrawerShow: false,
      project: null,
      RemarksData: [],
      TableData: [],
      taskList: [],
      attrsList: [],
      customAttrs: [],
      attrsTypeNum:null,
      dialogVisible:false,
    };
  },
  props: ["trainingProject"],
  computed: {
    ...mapState("project", ["ProjectList"])
  },
  methods: {
    //添加权限说明
    openExplain() {
      this.dialogVisible = true;
    },
    showImg(url = null) {
      if (url) {
        this.src = url;
        this.isShowImg = true;
      } else {
        this.url = null;
      }
    },
    show(item) {
      this.project = item;
      this.isDrawerShow = true;
      const msg = {
        appid: this.project.id,
        apptype: this.project.entity_type
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
      queryAssets({
        project: this.project.id
      }).then(({ data }) => {
        this.TableData = [...data.msg];
      });
      queryTask({
        project: this.project.id
      }).then(({ data }) => {
        this.taskList = [...data.msg];
      });
      searchBind({entity_type:4}).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: this.project.id ,entity_type:4}).then(({ data }) => {
        this.customAttrs = [...data.msg];
        this.attrsTypeNum = 4
      });
    },
    getProjectDetail() {
      if (this.trainingProject) {
        getTrainingProject({ id: this.project.id }).then(({ data }) => {
          this.project = data.msg;
          this.getTrainingProject();
        });
      } else {
        getProjects({ id: this.project.id }).then(({ data }) => {
          this.project = data.msg;
          this.getProjects();
        });
      }
    },
     updateRemark() {
      getRemark({
        appid: this.project.id,
        apptype: 4
      }).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    RefreshcustomAttrs() {
      searchBind({entity_type:4}).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: this.project.id ,entity_type:4}).then(({ data }) => {
        this.customAttrs = [...data.msg];
        this.attrsTypeNum = 4
      });
    },
    delProject(item) {
      this.$confirm("删除项目后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delOneProject({
          id: item.id,
          method: "delete"
        }).then(({ data }) => {
          if (data.status === 0) this.$message.success(data.msg);
          if (item.pro_type === 0)
            this.$store.dispatch("trainingStatus/get_TrainProject");
          this.$store.dispatch("project/get_Projects");
        });
      });
    },
    getProjects(){
         getProjects().then(({data})=>{
             this.$store.commit("project/SET_PROJECTS", data.msg);
         })
    },
    getTrainingProject(){
      getTrainingProject().then(({data})=>{
            this.$store.commit('trainingStatus/SET_TRAINPROJECT',data.msg);
      })
    }
  },
  created() {
    this.$store.dispatch("project/get_Projects");
  }
};
</script>
<style lang="scss" src="./project.scss">
</style>
