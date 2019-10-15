<template functional>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge
        :value="props.myTaskList.length"
        :hidden="!props.myTaskList.length"
        :max="99"
        class="item"
      >
        <span style="padding-right: 10px;">我的任务</span>
      </el-badge>
      <el-button @click="props.targetMore" type="text">查看更多</el-button>
    </el-row>
    <!-- <el-table :data="props.myTaskList.filter((t,i)=>i<5)" :show-header="false">
      <el-table-column prop="task.name" label="任务名称"></el-table-column>
    </el-table> -->

    <ul class="list">
      <li class="item" v-for="item of props.myTaskList" :key="item.task.id">{{item.task.name}}</li>
    </ul>
    <div v-show="props.myTaskList.length>5">...</div>
  </el-card>
</template>
<style lang="scss" scoped>
.list {
  list-style-position: inside;
  .item{
    padding-bottom: 8px;
  }
}
</style>