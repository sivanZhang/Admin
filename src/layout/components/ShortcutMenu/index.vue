<template>
  <div class="menu-group">
    <div :class="[{active:activeIndex==1},'main-menu']">我的</div>
    <el-popover @show="hasData" placement="bottom" width="900" trigger="click">
      <el-row>
        <el-col :span="12">
          <div>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <input placeholder="请输入内容" />
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" @click="isCreateShow=true" icon="el-icon-plus">创建项目</el-button>
        </el-col>
        <el-col :span="24">
          <el-row class="list-title" :gutter="20">
            <el-col :span="8">最新项目</el-col>
            <el-col :span="8">我的项目</el-col>
            <el-col :span="8">有效的项目</el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="20">
            <el-col :span="8">
              <template v-if="CacheList.length">
                <div v-for="(item,index) of CacheList" :key="index">
                  <router-link :to="`/projects/project-detail/${item.id}`">
                    <div class="title">{{item.name}}</div>
                  </router-link>
                </div>
              </template>
              <div v-else class="title">
                暂无数据
              </div>
            </el-col>
            <el-col :span="8">
              <div v-for="(todo,index) of MyTask" :key="index">
                <div class="title" @click="targetDetail(todo)">{{todo.name}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div v-for="(item,index) of ProjectList" :key="index">
                <div class="title" @click="targetDetail(item)">{{item.name}}</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="reference" :class="[{active:activeIndex==2},'main-menu']">
        项目
        <i class="el-icon-arrow-down el-icon--right" />
      </div>
    </el-popover>
    <create-project v-bind:isShow.sync="isCreateShow" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CreateProject from "@/components/CreateProject";
import { queryMyTask } from "@/api/task";
export default {
  components: {
    CreateProject
  },
  name: "ShortcutMenu",
  data() {
    return {
      activeIndex: 0,
      isCreateShow: false,
      MyTask: null
    };
  },
  created() {
    this.getMyTask();
  },
  computed: {
    ...mapState({
      ProjectList: state => state.project.ProjectList,
      CacheList: state => state.app.CacheList
    })
  },
  methods: {
    hasData() {
      !this.ProjectList && this.$store.dispatch("project/get_Projects");
    },
    getMyTask() {
      queryMyTask({
        mine: null
      }).then(({ data }) => {
        this.MyTask = [...data.msg];
        //console.log(this.MyTask);
      });
    },
    targetDetail(item) {
      this.$router.push({ name: "project-detail", params: { id: item.id } });
      this.$store.commit("app/CACHEPRPJECT", item);
    }
  },
  watch: {
    //根据路由变化控制顶部菜单的active状态
    $route(to, from) {
      this.isCreateShow = false;
      const reg1 = /^\/task/,
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
.title {
  padding: 4px 0;
  cursor: pointer;
}
.title:hover {
  cursor: hand;
  background-color: #eeeeee;
}
input {
  width: 240px;
  border: none;
  border-bottom: solid 2px deepskyblue;
}
input:focus {
  outline: none;
}

.list-title {
  padding: 6px 0;
  font-weight: 600;
  text-align: left;
}
.menu-group {
  position: relative;
  font-size: 14px;
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

