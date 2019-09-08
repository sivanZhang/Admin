<template>
  <div id="notiec-info">
    <div style="padding-left:40px">
      <el-row class="col">
        <el-col :span="4" class="comment">用户名</el-col>
        <el-col :span="20" class="comment">{{userInfo.username}}</el-col>
      </el-row>
      <el-row class="col">
        <el-col :span="4" class="comment">性别</el-col>
        <el-col :span="20" class="comment">{{userInfo.sex}}</el-col>
      </el-row>
      <el-row class="col">
        <el-col :span="4" class="comment">邮箱</el-col>
        <el-col :span="20" class="comment">{{userInfo.email}}</el-col>
      </el-row>
      <el-row class="col">
        <el-col :span="4" class="comment">电话</el-col>
        <el-col :span="20" class="comment">{{userInfo.phone}}</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as HTTP from "@/api/notice";
import { updateUserInfo, addUser } from "@/api/login";
export default {
  name: "NoticeInfo",
  props: ["userInfo"],
  data() {
    return {};
  },

  methods: {}
};
</script>

<style scoped>
.col{
  padding-bottom:10px
}
</style> 