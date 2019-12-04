
 <!-- 部门kpi -->
 <template>
  <div>
    <el-cascader
      v-model="deptIds"
      placeholder="输入搜索工种"
      :options="selectList"
      :props="{ multiple: true,checkStrictly: true,expandTrigger: 'hover'}"
      filterable
      clearable
    ></el-cascader>
    <el-date-picker v-model="recordTime" type="month" placeholder="选择日期"></el-date-picker>
    <el-button type="primary" @click="getKPI()" :loading="tableLoading">查询</el-button>
    <el-button type="primary" @click="resetParams()">重置</el-button>
    <el-table
      :data="kpiList"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      style="margin-top:15px;width:100%"
      :stripe="true"
      highlight-current-row
      default-expand-all
      v-loading="tableLoading"
    >
     <el-table-column prop="dept_name" label="部门"></el-table-column>
      <el-table-column prop="accomplist_asset_num" label="完成的资产数量"></el-table-column>
      <el-table-column prop="accomplish_asset_frame" label="完成的镜头帧数"></el-table-column>
      <el-table-column label="难度等级">
        <template slot-scope="scope">
          <div v-for="(todo,index) of scope.row.per_grade_task" :key="index">{{todo.grade|Level}}</div>
        </template>
      </el-table-column>
      <el-table-column label="每帧耗时 (当前难度等级）">
        <template slot-scope="scope">
          <div v-for="(todo,index) of scope.row.per_grade_task" :key="index">{{todo.make_time}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="total_actual_time" label="实际工时"></el-table-column>
      <el-table-column prop="total_over_time" label="加班工时"></el-table-column>
      <el-table-column prop="average_per_time" label="平均单帧制作时长（小时）"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { searchDepartmentKpi } from "@/api/statistics";
import dayjs from "dayjs";
import DeptListMixin from '@/utils/dept-list-mixins'
export default {
  name: "dept-manwork",
  mixins:[DeptListMixin],
  data() {
    return {
      tableLoading:false,
      // 选中的部门id
      deptIds:[],
      // 选中的时间
      recordTime:null,
      kpiList: [],
    };
  },
  methods: {
    // 重置
    resetParams() {
      this.deptIds=[]
      this.recordTime=null
    },
    // 根据筛选条件请求列表，如果没有筛选值则不传字段
    getKPI() {
      let params = null
      if (this.deptIds.length) {
        let idList = []
        idList = this.deptIds.map(i=>{
          return i[i.length-1]
        })
        params = {...params,dept_id:idList.join()}
      }
      
      if(this.recordTime){
        params = {
          ...params,
          record_time:dayjs(this.recordTime).format("YYYY/MM")
        }
      }
      this.tableLoading = true
      searchDepartmentKpi(params).then(({ data }) => {
        this.kpiList = [...data.msg];
      }).finally(()=>{
        this.tableLoading = false
      })
    },
    
  },
  async created() {
    this.getKPI()
  }
};
</script>

<style>
</style>