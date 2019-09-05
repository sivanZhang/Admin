<template>
    <div id="tabApproveDetail">
        <div>
      <div class="bd" v-for="(t,i) of list" :key="i">
        <el-row type="flex" justify="space-between">
          <el-col style="display:flex">
            <div class="item-title">审批人员：</div>
            {{t.approve_user_id.name}}
          </el-col>
          <el-col class="text-right">{{t.time|dateTimeFormat}}</el-col>
        </el-row>
        <div class="item">
          <div class="item-title">审批意见：</div>
          <div class="item-con">{{t.approve_suggestion}}</div>
        </div>
        <div class="item">
          <div class="item-title">审批结果：</div>
          <div class="item-con" style="color:#ed4014">{{t.approve_result?'通过':'未通过'}}</div>
        </div>
        <div class="item">
          <div class="item-title">镜头批注：</div>
          <div class="item-con">
            <div class="image-list" v-for="(item,index) of t.images" :key="index">
              <el-image
                :src="$store.state.BASE_URL+item.image_path"
                style="height:45px;width:80px"
                fit="cover"
                @click="shwoImage(item)"
              ></el-image>
              第{{item.image_frame}}帧
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!list.length">暂无数据</div>
    </div>
</template>

<script>
import { taskApprove } from "@/api/task";
export default {
  name: "my-task-approve",
  props: ["list"],
  data() {
    return {
      
    };
  },
  methods: {
    
  }
};
</script>
<style lang="scss" scoped>
.bd {
  border: 1px solid #ddd;
  padding: 10px;
  flex: 1 1 auto;
  width: 100%;
  margin-bottom: 10px;
}
.text-right {
  text-align: right;
}
.item {
  margin: 5px 0;
  display: flex;
  justify-content: flex-start;
}
.item-con {
  flex: 1 1 auto;
}
.item-title {
  width: 90px;
}
.image-list {
  background: #eee;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
}
</style>