<template>
  <div id="project">
    <div class="container">
      <div v-for="(item,index) in ProjectList" :key="index">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="dropdow">
            <el-dropdown>
              <el-button type="text" style="color:#fff;font-size:18px">
                <i class="el-icon-more"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>前往项目</el-dropdown-item>
                <el-dropdown-item>在侧边栏中打开</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div
            class="color"
            :style="{backgroundColor:item.color||'transparent'}"
          ></div>
          <el-image
            @click="showImg('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')"
            class="mini-image"
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            fit="cover"
            style="width:100%;height:162px"
          ></el-image>
          <div style="padding: 15px;">
            <h3>{{item.name}}</h3>
            <p>{{item.creator_name}}</p>
            <el-row>
              <el-col :span="12">
                <p class="subtitle">工作流</p>
                <div>DEVELOPMENT</div>
              </el-col>
              <el-col :span="12">
                <p class="subtitle">状态</p>
                <div>DEVELOPMENT</div>
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

    <el-dialog :visible.sync="isShowImg" width="50%" :show-close="false">
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        style="max-width:100%;max-height:50vh"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "project",
  data() {
    return {
      isShowImg: false,
      scr: ""
    };
  },
  computed: {
    ...mapState({
      ProjectList: state => state.project.ProjectList
    })
  },
  methods: {
    showImg(src) {
      this.src = src;
      this.isShowImg = true;
    }
  },
  created() {
    this.$store.dispatch("project/get_Projects");
  }
};
</script>
<style lang="scss" src="./project.scss">
</style>
