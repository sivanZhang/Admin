<template>
  <div class="menu-group">
    <div :class="[{active:activeIndex==1},'main-menu']">我的</div>

    <el-popover placement="bottom" width="992" trigger="click">
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容" size="mini" style="width:240px">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini">显示隐藏项目</el-button>
          <el-button type="primary" size="mini" @click="isCreateShow=true" icon="el-icon-plus">创建项目</el-button>
        </el-col>
        <el-col :span="24">
          <el-row class="list-title">
            <el-col :span="8">最近打开的项目</el-col>
            <el-col :span="8">我的项目</el-col>
            <el-col :span="8">有效的项目</el-col>
          </el-row>
        </el-col>
        <el-col :span="8">无数据</el-col>
        <el-col :span="8">无数据</el-col>
        <el-col :span="8">
          <div v-for="(item,index) of ProjectList" :key="index">
            <router-link :to="`/projects/project-detail/${item.id}`">{{item.name}}</router-link>
          </div>
        </el-col>
      </el-row>
      <div slot="reference" :class="[{active:activeIndex==2},'main-menu']">
        项目
        <i class="el-icon-arrow-down el-icon--right"/>
      </div>
    </el-popover>
    <create-project :isShow='isCreateShow'/>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CreateProject from "@/components/CreateProject";
export default {
  components: {
    CreateProject
  },
  name: "ShortcutMenu",
  data() {
    return {
      activeIndex: 0,
      isCreateShow:false,
    };
  },
  computed: {
    ...mapState({
      ProjectList: state => state.project.ProjectList
    })
  },
  watch: {
    $route(to, from) {
      const reg1 = /^\/admin/,
        reg2 = /^\/projects/;
      if (reg1.test(to.path)) {
        this.activeIndex = 1;
      } else if (reg2.test(to.path)) {
        this.activeIndex = 2;
      } else {
        this.activeIndex = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list-title {
  padding: 15px 0 5px;
  font-weight: 600;
}
.menu-group {
  position: relative;
  .active {
    color: rgb(24, 144, 255);
  }

  .main-menu {
    cursor: pointer;
    width: 80px;
    text-align: center;
  }
}
</style>

