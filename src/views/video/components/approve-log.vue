<template>
  <div>
    <el-select
      v-model="select"
      placeholder="请选择"
      style="width:120px;margin-bottom:10px;"
      @change="getApproveLog()"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div v-loading="loading">
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
                @click="shwoImage(item.image_path)"
              ></el-image>
              第{{item.image_frame}}帧
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!list.length">暂无数据</div>
    <zoom-img ref="zoomImg" />
  </div>
</template>
<script>
import ZoomImg from "@/components/ZoomImg";
import { getApproveRemark } from "@/api/video";
export default {
  mame: "approve-logs",
  components: {
    ZoomImg
  },
  data() {
    return {
      loading: false,
      list: [],
      httpParams: {},
      options: [
        {
          label: "全部",
          value: 2
        },
        {
          label: "未通过",
          value: 0
        },
        {
          label: "通过",
          value: 1
        }
      ],
      select: 2
    };
  },
  methods: {
    shwoImage(url) {
      if (url) {
        this.$refs.zoomImg.zoomImg(this.$store.state.BASE_URL + url);
      }
    },
    getApproveLog(task_id) {
      if (task_id && this.select === 2) {
        this.httpParams = { task_id };
      } else if (!task_id && this.select === 2) {
        this.httpParams = { task_id: this.httpParams["task_id"] };
      } else if (task_id && this.select !== 2) {
        this.httpParams = {
          task_id,
          approve_result: this.select
        };
      } else if (!task_id && this.select !== 2) {
        this.httpParams = {
          ...this.httpParams,
          approve_result: this.select
        };
      }
      this.loading = true;
      getApproveRemark(this.httpParams).then(({ data }) => {
        this.loading = false;
        this.list = [...data.msg];
      }).catch((res=>{
        this.loading = false;
      }));
    }
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