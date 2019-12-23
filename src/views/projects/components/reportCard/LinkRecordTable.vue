<template>
    <div>
      <el-table
        :data="LinkRecordList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
      >
        <el-table-column prop="rank" label="加权排名"></el-table-column>
        <el-table-column prop="executor_name" label="执行人"></el-table-column>
        <el-table-column prop="score" label="加权重后的总成绩"></el-table-column>
        <el-table-column prop="task_score" label="任务成绩"></el-table-column>
        <el-table-column prop="attendance_count" label="迟到早退次数2"></el-table-column>
        <el-table-column prop="submition_rank" label="提交时间排名"></el-table-column>
      </el-table> 
    </div>
</template>
<script>
import {
  getWeightRecord,
} from "@/api/training";
export default {
    data(){
        return {
          LinkRecordList:[],
        }
    },
    created(){

    },
    methods:{
      getWeightRecords(link_id){
        getWeightRecord({link_id:link_id}).then(({ data })=>{
          this.LinkRecordList = [...data.msg]
        })
      }
    }
}
</script>