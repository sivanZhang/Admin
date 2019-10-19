<template>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="myTaskList.length" :hidden="!myTaskList.length" :max="99" class="item">
        <span style="padding-right: 10px;">我的任务</span>
      </el-badge>
      <el-button @click="targetMore" type="text">查看更多</el-button>
    </el-row>
    <div class="navs">
      <div @click="targetMore('priority')">
        {{myTaskList.filter(t=>t.task.priority==2).length}}
        <br />高优先级
      </div>
      <div @click="targetMore('grade')">
        {{myTaskList.filter(t=>t.task.grade==2).length}}
        <br />困难
      </div>
      <div @click="targetMore('expire')">
        1
        <br />即将超期
      </div>    
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="item of myTaskList.filter((t,i)=>1<5)"
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
    <div v-show="myTaskList.length>5">...</div>
  </el-card>
</template>
<script>
export default {
  props: {
    myTaskList: {
      type: Array
    }
  },
  methods: {
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
.navs {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 10px;
  & > div {
    flex: 1;
    cursor: pointer;
    &:hover {
      color: #2d8cf0;
    }
    & + div {
      border-left: 1px solid #dcdfe6;
    }
  }
}
.list {
  list-style-position: inside;

  .item {
    padding-bottom: 8px;
    &:hover {
      color: #2d8cf0;
    }
    overflow: hidden; //超出的隐藏
    text-overflow: ellipsis; //省略号
    white-space: nowrap; //强制一行显示
    .message {
      overflow: hidden; //超出的隐藏
      text-overflow: ellipsis; //省略号
      white-space: nowrap; //强制一行显示
      font-size: 12px;
      color: #909399;
      padding-left: 20px;
    }
  }
}
</style>