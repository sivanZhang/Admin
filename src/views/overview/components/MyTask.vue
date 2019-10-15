<template functional>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="props.myTaskList.length" :hidden="!props.myTaskList.length" :max="99" class="item">
        <span style="padding-right: 10px;">我的任务</span>
      </el-badge>
      <el-button @click="$router.push({name:'my-task'})" type="text">查看更多</el-button>
    </el-row>
    <el-table :data="props.myTaskList.filter((t,i)=>i<5)" :show-header="false">
      <el-table-column prop="task.name" label="任务名称"></el-table-column>
    </el-table>
    <div v-show="props.myTaskList.length>5">...</div>
  </el-card>
</template>