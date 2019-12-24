<template>
  <!-- 练习生成绩单 -->
  <div id="reportCard">
    <div align="right" class="button-Refresh" >
    <el-button type="primary" @click="refreshRecord()">刷新成绩单</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabclick">
      <el-tab-pane label="按权重排名" name="tab1" lazy>
        <el-table
          :data="LinkList.slice((currentPage4-1)*pageSize4,currentPage4*pageSize4)"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
          style="width:100%"
          highlight-current-row
          @expand-change="expandShow"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <LinkRecordTable
                ref="LinkRecordTable"
                v-if="props.row.link_id"
                style="margin-left:20px"
              />
              <label for v-else>此环节暂无成绩表</label>
            </template>
          </el-table-column>
          <el-table-column prop="link_id" label="环节ID">
          </el-table-column>
          <el-table-column prop="link_dept" label="工种名称"></el-table-column>
          <el-table-column prop="link_content" label="环节内容"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="打开各项考勤排名" placement="top">
                <el-button
                  @click="openAlongRecord(scope.row.link_id)"
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
            @size-change="handleSizeChange4"
            @current-change="handleCurrentChange4"
            :current-page="currentPage4"
            :page-sizes="pageSizeList"
            :page-size="pageSize4"
            layout="total, sizes, prev, pager, next, jumper"
            :total="LinkList.length"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按考勤时间排名" name="tab2" :disabled="disabledtab2" lazy>
        <el-table
          :data="AttendanceRecord.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
          style="width:100%"
          highlight-current-row
          default-expand-all
        >
          <el-table-column prop="rank" label="排名">
            <template slot-scope="scope">{{scope.row.rank}}</template>
          </el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="duty_off_count" label="迟到早退的次数" width="200"></el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="AttendanceRecord.length"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按任务打分成绩排名" name="tab3" :disabled="disabledtab3" lazy>
        <div>
          <el-table
            :data="TaskRecord.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)"
            :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
            style="width:100%"
            highlight-current-row
            default-expand-all
          >
            <el-table-column prop="rank" label="排名">
              <template slot-scope="scope">
                <!-- <svg-icon icon-class="shuzhikuang" style="width:20px;height:20px" /> -->
                {{scope.row.rank}}
              </template>
            </el-table-column>
            <el-table-column prop="score" label="成绩"></el-table-column>
            <el-table-column prop="executor_name" label="执行人"></el-table-column>
          </el-table>
          <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            :page-sizes="pageSizeList"
            :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="TaskRecord.length"
          ></el-pagination>
        </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按审批通过的任务提交时间排名" name="tab4" :disabled="disabledtab4" lazy>
        <div>
          <el-table
            :data="ApproveTimeRecord.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)"
            :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
            style="width:100%"
            highlight-current-row
            default-expand-all
          >
            <el-table-column prop="rank" label="排名">
              <template slot-scope="scope">
                <!-- <svg-icon icon-class="shuzhikuang" style="width:20px;height:20px" /> -->
                {{scope.row.rank}}
              </template>
            </el-table-column>
            <el-table-column prop="executor_name" label="执行人"></el-table-column>
            <el-table-column prop="value" label="任务提交时间">
              <template slot-scope="scope">{{scope.row.submit_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="submition" :formatter="submitionFormat" label="是否提交作业(提交并审批通过的)"> 
            </el-table-column>
          </el-table>
          <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="currentPage3"
            :page-sizes="pageSizeList"
            :page-size="pageSize3"
            layout="total, sizes, prev, pager, next, jumper"
            :total="ApproveTimeRecord.length"
          ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  getTaskRecord,
  getApproveTimeRecord,
  getAttendanceRecord,
  getWeightRecord,
  getProjectLinks,
  refreshRecord
} from "@/api/training";
import LinkRecordTable from "./LinkRecordTable";
export default {
  name: "reportCard",
  components: {
    LinkRecordTable
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      currentPage2: 1,
      pageSize2: 20,
      currentPage3: 1,
      pageSize3: 20,
      currentPage4: 1,
      pageSize4: 20,
      pageSizeList: [20, 30, 50, 100],
      userInfo: this.$store.state.login.userInfo,
      LinkList: [],
      disabledtab2: true,
      disabledtab3: true,
      disabledtab4: true,
      activeName: "tab1",
      ApproveTimeRecord: [],
      TaskRecord: [],
      AttendanceRecord: []
    };
  },
  created() {
    this.getProjectLinkList();
  },
  methods: {
    //刷新成绩单
    refreshRecord(){
      refreshRecord({project_id:this.$route.params.id}).then(({ data })=>{
        this.$message.success(data.msg)
      })
    },
    //是否提交作业格式化显示
    submitionFormat: function(row, column) {
      switch (row.submition) {
         case true:
            return "是";
            break;
          case false:
            return "否";
            break;
      }},
    //不显示单独的成绩单页面
    tabclick(val) {
      if (val.index == 0) {
        this.disabledtab2 = true;
        this.disabledtab3 = true;
        this.disabledtab4 = true;
      }
    },
    //展示项目下面的环节
    getProjectLinkList() {
      getProjectLinks({ project_link: this.$route.params.id }).then(
        ({ data }) => {
          this.LinkList = [...data.msg];
        }
      );
    },
    //展示单独的成绩单
    openAlongRecord(item) {
      this.activeName = "tab2";
      this.disabledtab2 = false;
      this.disabledtab3 = false;
      this.disabledtab4 = false;
      this.getAttendanceRecord(item);
      this.getApproveTimeRecord(item);
      this.getTaskRecord(item);
    },
    //展示环节的成绩单
    expandShow(row, expandedRows) {
      if (Object.keys(expandedRows).length) {
        if (expandedRows.length != 0) {
          this.$nextTick(() => {
            this.$refs["LinkRecordTable"].getWeightRecords(row.link_id);
          });
        }
      } 
    },
    //按考勤时间
    getAttendanceRecord(link_id) {
      getAttendanceRecord({ link_id: link_id }).then(({ data }) => {
        this.AttendanceRecord = [...data.msg];
      });
    },
    //按任务打分成绩
    getTaskRecord(link_id) {
      getTaskRecord({ link_id: link_id }).then(({ data }) => {
        this.TaskRecord = [...data.msg];
      });
    },
    //按审批通过的任务提交时间
    getApproveTimeRecord(link_id) {
      getApproveTimeRecord({ link_id: link_id }).then(({ data }) => {
        this.ApproveTimeRecord = [...data.msg];
      });
    },
    //分页,按权重排名时的
    handleSizeChange4(val) {
      this.pageSize4 = val;
    },
    handleCurrentChange4(currentPage) {
      this.currentPage4 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage4 - 1) * this.pageSize4 + index + 1;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //分页按任务打分成绩排名
    handleSizeChange2(val) {
      this.pageSize2 = val;
    },
    handleCurrentChange2(currentPage) {
      this.currentPage2 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage2 - 1) * this.pageSize2 + index + 1;
    },
    //分页按审批通过的任务提交时间
    handleSizeChange3(val) {
      this.pageSize3 = val;
    },
    handleCurrentChange3(currentPage) {
      this.currentPage3 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage3 - 1) * this.pageSize3 + index + 1;
    },
  }
};
</script>
<style lang="scss">
#reportCard {
  .button-Refresh{
    padding-right:15px
  }
}
</style>