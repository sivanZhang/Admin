<template>
  <div>
    <el-select v-model="select" placeholder="请选择" style="width:120px;margin-bottom:10px;" @change="selectChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div v-for="(t,i) of list" :key="i">
      <el-row type="flex" style="margin-bottom:10px;">
        <el-col :span="5">
          <el-avatar>{{t.approve_user_id.name|avatarFormat}}</el-avatar>
        </el-col>
        <el-col class="bd" :span="18">
          <el-row type="flex" justify="space-between">
            <el-col>
              <label for>{{t.approve_user_id.name}}</label>
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
              <div class="image-list" v-for="(item,index) of t.image_path" :key="index">
                <el-image
                  :src="$store.state.BASE_URL+item"
                  style="height:45px;width:80px"
                  fit="cover"
                  @click="shwoImage(item)"
                ></el-image>
                第{{t.image_frame[index]}}帧
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="!list.length">暂无数据</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        options:[
          {
            label:"全部",
            value:2
          },
          {
            label:"未通过",
            value:0
          },
          {
            label:"通过",
            value:1
          }
          
        ],
        select:2
    };
  },
  props: {
    list: {
      default: [],
      type: Array
    },
    search: {
      type: Object
    }
  },
  methods: {
    shwoImage(url) {
      this.$emit("imageClick", url);
    },
    selectChange(val){
       this.$emit("changeSelect", val);
    }
  },
  created() {
    this.select = 2
  }
};
</script>
<style lang="scss" scoped>
.bd {
  border: 1px solid #ddd;
  padding: 10px;
  flex: 1 1 auto;
  width: 100%;
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