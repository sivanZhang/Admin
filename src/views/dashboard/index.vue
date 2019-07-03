<template>
  <div class="dashboard-container">
    <el-container>
      <el-aside width="240px" style="border-right:1px solid #ddd;padding: 0 5px">
        <div class="tag-nav">Users</div>
        <div class="tag-nav">Ungrouped users</div>
        <el-row type="flex" align="middle" class="nav-title">
          <el-col :span="9">用户组</el-col>
          <el-col :span="15" style="text-align:right">
            <el-button type="info" size="mini">添加用户组</el-button>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header class="title" height="120px">{{title}}</el-header>
        <el-main>
          <div class="t-header">
            <el-button type="primary" size="small">主要按钮</el-button>
          </div>
          <template>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="date" label="日期" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      title: "title",
      componentId: ""
    };
  },
  methods: {
    guan() {
      this.tab = null;
    }
  }
};
</script>

<style lang="scss" scoped src="./home.scss"></style>