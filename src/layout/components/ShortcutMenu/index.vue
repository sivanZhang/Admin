<template>
  <div class="menu-group">
    <div :class="[{active:activeIndex==1},'main-menu']">我的</div>
    <el-popover placement="bottom" width="900" trigger="click">
      <el-row>
        <el-col :span="12">
          <div>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <input placeholder="请输入内容" size="mini"/>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" size="mini" @click="isCreateShow=true" icon="el-icon-plus">创建项目</el-button>
        </el-col>
        <el-col :span="24">
          <el-row class="list-title">
            <el-col :span="8">最近打开的项目</el-col>
            <el-col :span="8">我的项目</el-col>
            <el-col :span="8">有效的项目</el-col>
          </el-row>
        </el-col>
        <el-col :span="8" ><div class="title" style="padding: 5px 0 0px;">无数据</div></el-col>
        <el-col :span="8" ><div class="title" style="padding: 5px 0 0px;">无数据</div></el-col>
        <el-col :span="8">
          <div v-for="(item,index) of ProjectList" :key="index"  >
            <router-link :to="`/projects/project-detail/${item.id}`" >
              <div class="title">
                {{item.name}}
              </div>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <div slot="reference" :class="[{active:activeIndex==2},'main-menu']">
        项目
        <i class="el-icon-arrow-down el-icon--right"/>
      </div>
    </el-popover>
    <create-project v-bind:isShow.sync='isCreateShow'/>
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
    //根据路由变化控制顶部菜单的active状态
    $route(to, from) {
      this.isCreateShow = false;
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
.title{
  padding: 5px 0 0px;
}
.title:hover{
  cursor:hand;
  background-color: #eeeeee;
}
input {
  width:240px;
  border:none;
  border-bottom: solid 2px deepskyblue;
}
input:focus {
  outline:none;
}

.list-title {
  padding: 15px 0 5px;
  font-weight: 600;
  text-align: left;
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

