<template>
  <div>
    <el-card class="task-ditail" v-loading="detailLoading">
      <h4 slot="header" class="clearfix">
        <el-row type="flex">
          <el-col :span="5">任务名称:</el-col>
          <el-col :span="19">{{taskdetail.name}}</el-col>
        </el-row>
      </h4>
      <el-row type="flex">
        <el-col :span="5">任务内容:</el-col>
        <el-col :span="19">{{taskdetail.content}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">创&nbsp;&nbsp;建&nbsp;&nbsp;者:</el-col>
        <el-col :span="19">{{taskdetail.creator|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">负&nbsp;&nbsp;责&nbsp;&nbsp;人:</el-col>
        <el-col :span="19">{{taskdetail.manager|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">执&nbsp;&nbsp;行&nbsp;&nbsp;者:</el-col>
        <el-col :span="19">{{taskdetail.executor|executorFilter}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">任务状态:</el-col>
        <el-col :span="19">{{taskdetail.status|taskStatus}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">优先等级:</el-col>
        <el-col :span="19">{{taskdetail.priority|Priority}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">所属项目:</el-col>
        <el-col :span="19">
           <router-link :to="`/projects/project-detail/${taskdetail.project.id}`">
          {{taskdetail.project|filterName}}
           </router-link>
          </el-col> 
      </el-row>
      <el-row type="flex">
        <el-col :span="5">所属资产:</el-col>
        <el-col :span="19">{{taskdetail.aseet|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">所属环节:</el-col>
        <el-col :span="19">{{taskdetail.link|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">创建时间:</el-col>
        <el-col :span="19">{{taskdetail.create_time|dateTimeFormat}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">开始日期:</el-col>
        <el-col :span="19">{{taskdetail.start_date|dateFormat}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">结束日期:</el-col>
        <el-col :span="19">{{taskdetail.end_date|dateFormat}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">预设时间:</el-col>
        <el-col :span="19">{{taskdetail.total_hour}}(小时)</el-col>
      </el-row>
      <template v-if="path">
        <el-row type="flex">
        <el-col :span="5">任务输出:</el-col>
        <el-col :span="19">{{path}}</el-col>
      </el-row>
      </template>
      
    </el-card>
    <template v-if="taskdetail.sub_task.length">
      <task-ditail
        v-for="(item, index) in taskdetail.sub_task.length"
        :key="index"
        :task-detail="item"
      />
    </template>
  </div>
</template>
<script>
export default {
  name: "task-ditail",
  props: {
    taskdetail: Object,
    detailLoading: {
      type: Boolean,
      default: false
    },
    path:String
  },
  filters: {
    filterName(obj) {
      if (obj && "name" in obj) return obj.name;
    },
    executorFilter(arr) {
      if (Array.isArray(arr) && arr.length) {
        return arr
          .map(item => {
            return item.name;
          })
          .join();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.task-ditail {
  font-size: 13px;
  overflow-y: auto;
  .el-row + .el-row {
    margin-top: 10px;
  }
}
</style>


