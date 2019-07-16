<template>
  <div class="navbar">
    <div>
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <div class="menu-group">
      <div :class="{active:activeIndex==1}">我的</div>

      <el-popover placement="bottom" width="992" trigger="click">
        <el-row>
          <el-col :span="12">
            <el-input placeholder="请输入内容" size="mini" style="width:240px">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="12" style="text-align:right">
            <el-button size="mini">显示隐藏项目</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus">创建项目</el-button>
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
              <router-link :to="`/projects/project-detail/${item.code}`">
                {{item.name}}
              </router-link>
            </div>
          </el-col>
        </el-row>
        <div slot="reference" :class="{active:activeIndex==2}">
          项目
          <i class="el-icon-arrow-down el-icon--right" />
        </div>
      </el-popover>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import Breadcrumb from "@/components/Breadcrumb";
  import Hamburger from "@/components/Hamburger";
  import Screenfull from "@/components/Screenfull";
  import SizeSelect from "@/components/SizeSelect";
  import Search from "@/components/HeaderSearch";

  export default {
    data() {
      return {
        activeIndex: 0
      };
    },
    components: {
      Breadcrumb,
      Hamburger,
      Screenfull,
      SizeSelect,
      Search,
    },
    computed: {
      ...mapGetters(["sidebar", "avatar", "device"]),
      ...mapState({
        ProjectList: state => state.project.ProjectList
      })
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      async logout() {
        await this.$store.dispatch("user/logout");
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      }
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

  .navbar {
    display: flex;
    justify-content: space-between;

    &>div {
      display: flex;
      align-items: center;

      &.menu-group {
        position: relative;

        .active {
          color: rgb(24, 144, 255);
        }

        div {
          cursor: pointer;
          width: 80px;
          text-align: center;
        }
      }
    }

    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>