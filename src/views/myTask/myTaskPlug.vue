<template>
  <div style="width:100%;height:100%;min-width:526px;padding:10px">
    <div id="notice-header" style="border-bottom:1px soild #999999">
      <el-row>
        <el-col :span="4">
          <svg-icon icon-class="people2" style="width:50px;height:50px;"></svg-icon>
        </el-col>
        <el-col :span="14">
          <el-row style="font-size:20px">{{loginMessage.msg}}</el-row>
          <el-row style="padding-top:10px">
            <el-col :span="4" align="right">邮箱：</el-col>
            <el-col :span="20">{{loginMessage.email}}</el-col>
          </el-row>
          <el-row style="padding-top:10px">
            <el-col :span="4" align="right">工种：</el-col>
            <el-col :span="20"></el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的任务" name="first">
        <el-table
          ref="assetTable"
          :data="MyTask.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          border
          :stripe="true"
          :row-style="{'font-size':'13px'}"
          :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
          highlight-current-row
          row-class-name="hover"
        >
          <el-table-column prop="project.name" label="项目" align="center"></el-table-column>
          <el-table-column prop="task.name" label="任务" align="left"></el-table-column>
          <el-table-column label="起止日期" align="center">
            <el-table-column label="开始日期" align="left">
              <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="结束日期" align="left">
              <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="asset.name" label="资产" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="打开任务" placement="top">
                <el-button
                  @click="openTaskDetail(scope.row.task.id)"
                  icon="el-icon-top-right"
                  type="text"
                  style="color:blue"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="MyTask.length"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务详情" name="second" disabled >
        <detail :detail="myTaskDetail" :project="project" :asset="asset"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as HTTP from "@/api/task";
import detail from "./components/detail"
export default {
  name: "myTaskPlug",
  data() {
    return {
      value1: false,
      id: this.$store.state.login.userInfo.id,
      activeName: "first",
      loginMessage: this.$store.state.login.userInfo,
      MyTask: null,
      myTaskDetail: {},
      asset:{},
      project:{},
      currentPage: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 50, 100]
    };
  },
  created() {
    HTTP.queryMyTask({
      inplugin: null
    }).then(({ data }) => {
      this.MyTask = [...data.msg];
      //console.log(this.MyTask);
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    openTaskDetail(id) { 
      HTTP.getTaskDetail({
        id: id
      }).then(({ data }) => {
        this.myTaskDetail = data.msg;
        this.project = data.msg.project;
        this.asset = data.msg.asset;
      });
      this.activeName = "second";
    }
  },
  components:{
    detail
  },
  mounted(){
    document.body.style.minWidth = 'auto'
  }
};
</script>

<style scoped>
</style> 



