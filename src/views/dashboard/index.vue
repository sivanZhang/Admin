<template>
  <div class="dashboard-container">
    <el-container>
      <el-aside width="210px" style="border-right:1px solid #ddd;padding: 0 5px;margin-right:-17px; z-index:10001">
        <div class="tag-nav">Users</div>
        <div class="tag-nav">Ungrouped users</div>
        <el-row type="flex" align="middle" class="nav-title">
          <el-col :span="8">用户组</el-col>
          <el-col :span="16" style="text-align:right">
            <el-button type="info" size="mini">添加用户组</el-button>
          </el-col>
        </el-row>
        <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
        <el-tree ref="tree2" :data="data2" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree" default-expand-all />
      </el-aside>
      <el-container>
        <el-header class="title" height="120px">{{title}}</el-header>
        <el-main>
          <div class="t-header">
            <el-button type="primary" size="small">创建用户账户</el-button>
          </div>
          <template>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="date" label=""></el-table-column>
              <el-table-column prop="name" label="用户名称"></el-table-column>
              <el-table-column prop="address" label="邮箱"></el-table-column>
              <el-table-column prop="name" label="角色"></el-table-column>
              <el-table-column prop="name" label="是否启用"></el-table-column>
              <el-table-column prop="name" label="操作"></el-table-column>
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
        componentId: "",
        filterText: '',
        data2: [{
          id: 1,
          label: 'Level one 1',
          children: [{
            id: 4,
            label: 'Level two 1-1',
            children: [{
              id: 9,
              label: 'Level three 1-1-1'
            }, {
              id: 10,
              label: 'Level three 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: 'Level one 2',
          children: [{
            id: 5,
            label: 'Level two 2-1'
          }, {
            id: 6,
            label: 'Level two 2-2'
          }]
        }, {
          id: 3,
          label: 'Level one 3',
          children: [{
            id: 7,
            label: 'Level two 3-1'
          }, {
            id: 8,
            label: 'Level two 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      guan() {
        this.tab = null;
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
  };
</script>

<style lang="scss" scoped src="./home.scss"></style>