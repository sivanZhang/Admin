<template>
  <div id="linkTaskOutput">
      <!-- 关联任务输出 -->
      <el-row>
        <el-col :span="10" >
          <div style="padding:5px 0px">
            <label for>上一环节任务输出</label>
          </div>
        </el-col>
      </el-row>
      <!-- <el-table
            :data="TaskOutput"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width:180px"
            v-if="!isChartView"
          >
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="value" label="输出文件" width="80"></el-table-column>
      </el-table> -->
      <el-row>
        <el-col :span="10" >
          <div style="padding:15px 0px">
            <label for>镜头的其他任务输出</label>
          </div>
        </el-col>
      </el-row>
      <!-- <el-table
            :data="AssetOutput"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width:180px"
            v-if="!isChartView"
          >
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="value" label="输出文件" width="80"></el-table-column>
      </el-table> -->
  </div>
</template>

<script>
import { getTaskDetail }  from "@/api/task";
export default {
   name: "linkTaskOutput",
   data(){
     return{
          TaskOutput:[],
          AssetOutput:[],
     }
   },
   created(){
       this.getlinkTaskOutput();
   },
   methods:{
     //父组件直接通过$refs[组件ref值].getlinkTaskOutput(task的id)即可请求列表，切换筛选时自动调用的
     getlinkTaskOutput(task_id){
       getTaskDetail({id:task_id}).then(({ data })=>{
         console.log(data)
         this.TaskOutput = data.msg
       })
     }
   }
}

</script>

<style>

</style>