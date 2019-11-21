<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="MyTaskList.length" :hidden="!MyTaskList.length" :max="99" class="item">
        <span style="padding-right: 10px;">我的任务</span>
      </el-badge>
      <el-button @click="targetMore" type="text">查看更多</el-button>
    </el-row>

    <div class="navs">
      <div @click="targetMore('priority')">
        <span style="font-size:20px;color:#B50B1E">
        {{TaskCount.high}}
        </span>
        <br />高优先级
      </div>
      <div @click="targetMore('grade')">
        <span style="font-size:20px;color:#B50B1E">
        {{TaskCount.difficult}}
         </span>
        <br />A+&nbsp; A&nbsp; A-
      </div>
      <div @click="targetMore('expire')">
        <span style="font-size:20px;color:#B50B1E">
        {{TaskCount.outdate}}
         </span>
        <br />即将超期
      </div>
    </div>
    <template>
      <el-divider>任务列表</el-divider>
      <ul class="list">
        <li
          class="item"
          v-for="item of MyTaskList.filter((t,i)=>1<5)"
          :key="item.task.id"
          @click="showDrawer(item)"
          style="cursor: pointer;"
        >
          {{item.task.name}}
          <div
            class="message"
          >{{item.task.start_date | dateFormat}} - {{item.task.end_date|dateFormat}}</div>
          <div class="message">{{item.task.content}}</div>
        </li>
      </ul>
      <div v-show="MyTaskList.length>5">...</div>
    </template>
  </el-card>
</template>
<script>
import { getHomepageMyTask } from "@/api/task";
export default {
  props: {
    MyTaskList: {
      type: Array
    }
  },
  data() {
    return {
      TaskCount: {}
    };
  },
  created() {
    this.getTaskCount();
  },
  methods: {
    getTaskCount() {
      getHomepageMyTask().then(({ data }) => {
        this.TaskCount = data.msg;
      });
    },
    showDrawer(item) {
      this.$emit("show-drawer", item);
    },
    //使跳转我的任务页面后，自动筛选
    targetMore(type) {
      if (type) {
        this.$store.commit("mine/SET_KEYWORD", type);
      }
      this.$router.push({ name: "my-task" });
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin mustInLine {
  overflow: hidden; //超出的隐藏
  text-overflow: ellipsis; //省略号
  white-space: nowrap; //强制一行显示
}
$border: 1px solid #dcdfe6;
// $linkColor: #B50B1E;
$linkColor: #2d8cf0;
.navs {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 10px;
  & > div {
    flex: 1;
    cursor: pointer;
    &:hover {
      color: $linkColor;
    }
    & + div {
      border-left: 1px solid $border;
    }
  }
}
.list {
  list-style-position: inside;
  .item {
    padding-bottom: 8px;
    &:hover {
      color: $linkColor;
    }
    @include mustInLine;
    .message {
      @include mustInLine;
      font-size: 12px;
      color: #909399;
      padding-left: 20px;
    }
  }
}
</style>