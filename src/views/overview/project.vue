<template>
  <div id="project" style="margin:-20px">
    <div class="container">
      <div class="cycle-task" v-for="(item,index) in ProjectList" :key="index">
        <Drawer closable v-model="isDrawerShow" width="526" :mask="false" inner :transfer="false">
          <drawer-header :project="project" style="padding:10px"/>
          <project-drawer :project="project" :RemarksData="RemarksData"/>
        </Drawer>

        <!-- <el-drawer :visible.sync="isDrawerShow" direction="rtl" size="512" :append-to-body="true" :modal="false" :modal-append-to-body="false">
          <div slot="title">
          </div>
          <drawer-header :project="project" style="padding:10px"/>
          <project-drawer :project="project" />
        </el-drawer> -->
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="dropdow">
            <el-dropdown placement="bottom" trigger="click">
              <el-button type="text" style="color:#333">
                <i class="el-icon-more"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" style="margin-top:0px">
                <el-dropdown-item>
                  <router-link :to="`/projects/project-detail/${item.id}`">前往项目</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="show(item)">在侧边栏中打开</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="color" :style="{backgroundColor:item.color||'transparent'}"></div>
          <div slot="header" class="box-card-header">
            <el-image
              @click="showImg($store.state.BASE_URL+item.image)"
              class="mini-image"
              :src="item.image?$store.state.BASE_URL+item.image:''"
              fit="cover"
              style="width:100%;height:100%"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
          </div>
          <div style="padding: 15px;">
            <mallki class-name="mallki-text" @click.native="show(item)" :text="item.name" />
            <p>创建者：{{item.creator_name}} {{item.date|dateFormat}}</p>
            <el-row>
              <el-col :span="12">
                <p class="subtitle">工作流</p>
                <div>{{item.status|projectStatus}}</div>
              </el-col>
              <el-col :span="12">
                <p class="subtitle">项目预算</p>
                <div>¥{{item.budget|numberFormat}}</div>
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
    </div>
    <el-dialog :visible.sync="isShowImg" width="768px" top="80px" :show-close="false">
      <img :src="src" style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getRemark } from "@/api/remark";
import Mallki from "@/components/TextHoverEffect/Mallki";
import projectDrawer from "@/components/projectDrawer";
import DrawerHeader from "@/components/projectDrawer/components/Header";
export default {
  name: "project",
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
      project:null,
      RemarksData: [],
    };
  },
  computed: {
    ...mapState("project", ["ProjectList"])
  },
  methods: {
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
    }
  },
  created() {
    this.$store.dispatch("project/get_Projects");
  }
};
</script>
<style lang="scss" src="./project.scss">
</style>
