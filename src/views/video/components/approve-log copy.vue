<template>
  <div>
    <template v-if="list.length">
      <div v-for="(t,i) of list" :key="i">
        <el-row type="flex" style="margin-bottom:10px;">
          <el-col>
            <el-avatar>张</el-avatar>
          </el-col>
          <el-col class="r-border">
            <el-row type="flex" justify="space-between">
              <el-col>用户名称</el-col>
              <el-col>26564654456456</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </template>
    <template v-else>
      <div>暂无数据</div>
    </template>
  </div>
</template>
<script>
export default {
    props:{
        list:{
            default:[],
            type:Array
        }
    }
}
</script>
<style lang="scss" scoped>
.el-col {
  border: 1px solid #ddd;
  padding: 10px;
  flex: 1 1 auto;
}
</style>