<template functional>
  <div>
    <template v-if="props.list.length">
      <div v-for="(t,i) of props.list" :key="i">
        <el-row type="flex" style="margin-bottom:10px;">
          <el-col :span="4">
            <el-avatar>{{t.name|avatarFormat}}</el-avatar>
          </el-col>
          <el-col class="bd" :span="20">
            <el-row type="flex" justify="space-between">
              <el-col>
                <label for>{{t.name}}</label>
              </el-col>
              <el-col class="text-right">{{time|dateTimeFormat}}</el-col>
            </el-row>
            <div class="item">
              审批意见：
              <div
                class="item-con"
              >2222222222222222222222222222222222222222222222222222222222222222222222</div>
            </div>
            <div class="item">
              审批结果：
              <label for style="color:#ed4014">同意</label>
            </div>
            <div class="item">
              镜头批注：
              <div class="item-con">
                <div class="image-list">
                  <el-image
                    src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                    style="height:45px;width:80px"
                    fit="cover"
                  ></el-image>5zhen
                </div>
                <div class="image-list">
                  <el-image
                    src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                    style="height:45px;width:80px"
                    fit="cover"
                  ></el-image>5zhen
                </div>
                <div class="image-list">
                  <el-image
                    src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                    style="height:45px;width:80px"
                    fit="cover"
                  ></el-image>5zhen
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
    <template v-else>
      <div>暂无数据</div>
    </template>
  </div>
</template>
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