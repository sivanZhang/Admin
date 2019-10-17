<template functional>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge
        :value="props.myTaskList.length"
        :hidden="!props.myTaskList.length"
        :max="99"
        class="item"
      >
        <span style="padding-right: 10px;"><svg-icon icon-class="cairenwu"/> 我的任务</span>
      </el-badge>
      <el-button @click="props.targetMore" type="text">查看更多</el-button>
    </el-row>
    <ul class="list">
      <li class="item" v-for="item of props.myTaskList.filter((t,i)=>1<5)" :key="item.task.id">
        {{item.task.name}}
        <div class="message">{{item.task.start_date | dateFormat}} - {{item.task.end_date|dateFormat}}</div>
        <div class="message">{{item.task.content}}</div>
      </li>
    </ul>
    <div v-show="props.myTaskList.length>5">...</div>
  </el-card>
</template>
<style lang="scss" scoped>
.list {
  list-style-position: inside;
  .item {
    padding-bottom: 8px;
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