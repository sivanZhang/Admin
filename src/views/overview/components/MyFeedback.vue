<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span style="padding-right: 10px;">审批反馈</span>
    </el-row>
    <section class="feedback" v-for="(item,index) of FeedbackList" :key="index">
      <div class="name" @click="showDrawer(item)">{{item.task.name}}</div>
      <div class="msg">
        <div :style="{color:item.result?'#19be6b':'#ed4014'}">
          {{item.result?'通过':'未通过'}}
        </div>
      </div>
      <div class="date">{{item.date|dateFormat}}</div>
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
    },
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
  .name {
    width: 100%;
    @include mustInLine;
    cursor: pointer;
    &:hover {
      color: $linkColor;
    }
  }
  .date{
    flex:0 0 50%;
    color: #909399;
    text-align: right;
  }
  .msg{
    flex:0 0 50%;
  }
  & + .feedback {
    border-top: $border;
  }
}
</style>