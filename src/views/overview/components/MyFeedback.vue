<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span style="padding-right: 10px;">审批反馈</span>
    </el-row>
    <section class="feedback" v-for="(item,index) of FeedbackList" :key="index">
      <div class="name" @click="showDrawer(item)"><span class="label">任务</span>: {{item.task.name}}</div>
      <div class="date">{{item.date|dateFormat}}</div>
      <div class="asset"><span class="label">镜头</span>: {{item.task.asset_name}}</div>
      <div class="text-right" :style="{color:item.result?'#19be6b':'#ed4014'}">{{item.result?'通过':'未通过'}}</div>
      <div class="opinion"><span class="label">意见</span>: {{item.suggestion}}</div>
      <div class="assetName">
        镜头号 : {{item.task.asset_name}}
      </div>
      <div>
        意见 : {{item.suggestion}}
      </div>
    </section>
  </el-card>
</template>
<script>
import { getHomepageMyTask, getFeedback } from "@/api/task";
export default {
  props: {
    MyTaskList: {
      type: Array
    }
  },
  data() {
    return {
      TaskCount: {},
      FeedbackList: []
    };
  },
  created() {
    this.getTaskCount();
    getFeedback().then(res => {
      this.FeedbackList = [...res.data.msg];
    });
  },
  methods: {
    getTaskCount() {
      getHomepageMyTask().then(({ data }) => {
        this.TaskCount = data.msg;
      });
    },
    showDrawer(item) {
      this.$emit("show-drawer", item);
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
$linkColor: #2d8cf0;
.feedback {
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  .asset{
    flex: 0 0 80%;
    @include mustInLine;
  }
  .opinion{
    flex: 1 1 100%;
  }
  .name {
    @include mustInLine;
    flex: 0 0 80%;
    cursor: pointer;
    color: $linkColor;
  }
  .date {
    color: #909399;
    text-align: right;
    flex: 0 0 20%;
  }
  .text-right{
    text-align: right;
    flex: 0 0 20%;
  }
  .label{
    display: inline-block;
    width: 30px;
  }
  .assetName{
    width: 100%;
  }
  & + .feedback {
    border-top: $border;
  }
}
</style>