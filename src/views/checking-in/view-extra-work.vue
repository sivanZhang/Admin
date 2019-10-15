<template>
  <div id="extra-work">
  <el-col :span="8">
      <el-row>
        <el-col :span="10">
          <el-input v-model="filterText" placeholder="请输入申请人" @keyup.enter.native="getExtrworks(1)">
            <el-button @click=" getExtrworks(1)" slot="append" icon="el-icon-search" type="primary" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button @click="getExtrworks()" type="primary" style="margin-left: 15px">重置</el-button>
        </el-col>
      </el-row>
    </el-col>
       <el-date-picker
      v-model="value1"
      type="date"
      placeholder="输入申请日期"
      style="width:150px">
      </el-date-picker>
    <el-button @click="getExtrworks(2)" slot="append" icon="el-icon-search" style="color:gray" />
    <el-button @click="getExtrworks()" type="primary" >重置</el-button>
    
    <el-table
     :data="ExtraworkList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
      :row-key="row=>row.overtime_id"
    >

      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="creator.username" label="申请人"></el-table-column>
      <el-table-column prop="creator.depts" label="部门" show-overflow-tooltip></el-table-column>
      <el-table-column prop="taskname" label="加班任务"></el-table-column>
      <el-table-column prop="reason" label="加班原因"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时(小时)"></el-table-column>
      <el-table-column label="申请日期">
        <template slot-scope="scope">{{scope.row.creator_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.overtime_status===null && currentSelect===1"
            type="text"
            @click="sunbmitApprove(scope.row.overtime_id)"
          >提交审批</el-button>
          <span v-else-if="scope.row.overtime_status===null && currentSelect===0">待提交</span>
          <span v-else-if="scope.row.overtime_status===3">已提交</span>
          <span v-else-if="scope.row.overtime_status===2">审批中</span>
          <span v-else-if="scope.row.overtime_status===1" style="color:#19be6b">同意</span>
          <span v-else-if="scope.row.overtime_status===0" style="color:#ed4014">拒绝</span>
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
          :total="ExtraworkList.length"
        ></el-pagination>
      </div>
  </div>
</template>

<script>
import {
  getOvertime,
  postOvertime,
  postApply,
  deleteApply,
  putApply
} from "@/api/checkingIn";
import { getStatusTaskList } from "@/api/task";
import dayjs from "dayjs";
export default {
  name: "extra-work",
  data() {
    return {
      startDay: null,
      value1: "",
      filterText: "",
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      multipleSelection: [],
      myTasks: null,
      ApplyForm: {},
      tableLoading: false,
      ExtraworkList: [],
      currentSelect: 1,
    };
  },
  methods: {
    //分页
    handleSizeChange(val){
       this.pageSize = val;
    },
     handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    
    //监听下拉框改变
    handleSelectLChange() {
      this.getExtrworks();
    },
    //获取 加班申请列表
    getExtrworks(Type) {
      if (Type === 1 && this.filterText) {
         getOvertime({allovertime: "", username: this.filterText }).then(({ data }) => {
          this.ExtraworkList = [...data.msg];
         });
        }else if (Type === 2) {
        function dataFormat(params) {
          return dayjs(params).format("YYYY/MM/DD"); //'yyyy/mm/dd'
        }
        this.startDay = dataFormat(this.value1);

         getOvertime({allovertime: "",date: this.startDay}).then(({ data }) => {
          this.ExtraworkList = [...data.msg];
          // console.log(this.ExtraworkList);
        });
        } else{
      // let params = {};
      this.tableLoading = true;
      getOvertime({allovertime: ""})
        .then(({ data }) => {
          this.ExtraworkList = [...data.msg];           
        })
        .finally(() => {
          this.tableLoading = false;
        });
    };
    },


    getMyTasks() {
      getStatusTaskList().then(({ data }) => {
        this.myTasks = [...data.msg];
      });
    }
  },
  created() {
    this.getExtrworks();
    this.getMyTasks();
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
</style>