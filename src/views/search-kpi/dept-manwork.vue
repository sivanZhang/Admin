
 <!-- 部门kpi -->
 <template>
  <div>
    <div>
      <!-- <el-row>
            <el-col :span="20">
               <label for style="padding-top:15px">部门本月的总工时、实际工时和空闲工时</label>
            </el-col>
      </el-row>-->
      <el-table
        :data="workTime"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="margin-top:10px;width:100%"
        :stripe="true"
        highlight-current-row
        default-expand-all
      >
        <el-table-column prop="dept_user_count" label="人员数量"></el-table-column>
        <el-table-column prop="total_work_time" label="本月总工时(小时)"></el-table-column>
        <el-table-column prop="total_allocation_time" label="本月已分配工时(小时)"></el-table-column>
        <el-table-column prop="total_free_time" label="本月空闲工时(小时)"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { searchDepartmentKpi, getDepartmentTime } from "@/api/statistics";
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  data() {
    return {
      selectList: [],
      colSel2: null,
      workTime: [],
      work_days: "",
      work_time: "",
      showMulChoose: [],
      showTimeChoose: []
    };
  },
  methods: {
    //重置
    getTasks() {
      this.mulChoose = false;
      this.showMulChoose = [];
      let data = { ...this.showMulChoose };
      this.searchDepartmentKpi(data);
    },
    searchDepartmentKpi(data) {
      getDepartmentTime({ ...this.showTimeChoose }).then(({ data }) => {
        this.workTime = data.msg;
      });
    }
  }
};
</script>

<style>
</style>