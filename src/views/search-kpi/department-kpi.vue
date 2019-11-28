
 <!-- 部门kpi -->
 <template>
  <div>
    <el-row>
      <el-col :span="4" style="padding-bottom:10px" align="left">
        <!-- 筛选 -->
        <div style="display:flex;width:470px">
          <el-cascader
            @change="getDepartmentKpi()"
            v-model="colSel2"
            placeholder="输入搜索部门"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
          ></el-cascader>
        </div>
      </el-col>
      <el-col :span="10" style="padding-bottom:10px">
        <div style="display:flex;width:400px;">
          <el-input placeholder="一天的工作时长" v-model="work_time" clearable  oninput="value=value.replace(/[^\d.]/g,'')"/>
          <el-input style="padding-left:12px;" placeholder="一个月的有效工作天数" v-model="work_days" clearable  oninput="value=value.replace(/[^\d.]/g,'')"/>
          <el-button
            @click="getDepartmentKpi()"
            icon="el-icon-search"
            type="primary"
            style="height:27.99px;padding-left:12px;"
          />
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="kpiList"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      style="margin-top:15px;width:100%"
      :stripe="true"
      highlight-current-row
      default-expand-all
    >
      <el-table-column prop="accomplist_asset_num" label="完成的资产数量"></el-table-column>
      <el-table-column prop="accomplish_asset_frame" label="完成的镜头帧数"></el-table-column>
      <el-table-column  label="难度等级">
        <template slot-scope="scope">
          <div v-for="(todo,index) of scope.row.per_grade_task" :key="index">
            {{todo.grade|Level}}
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="每帧耗时 (当前难度等级）">
        <template slot-scope="scope">
          <div v-for="(todo,index) of scope.row.per_grade_task" :key="index">
            {{todo.make_time}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total_actual_time" label="实际工时"></el-table-column>
      <el-table-column prop="total_over_time" label="加班工时"></el-table-column>
      <el-table-column prop="average_per_time" label="平均单帧制作时长（小时）"></el-table-column>
    </el-table>
    <!-- 部门本月的总工时实际工时和空闲工时 -->
    <div style="padding-top:25px">
      <!-- <el-row>
            <el-col :span="20">
               <label for style="padding-top:15px">部门本月的总工时、实际工时和空闲工时</label>
            </el-col>
      </el-row> -->
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
import { searchDepartmentKpi,getDepartmentTime } from "@/api/statistics";
import { mapState } from "vuex";
export default {
  data() {
    return {
      kpiList: [],
      selectList: [],
      colSel2: null,
      workTime:[],
      work_days:'',
      work_time:''
    };
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  methods: {
    getDepartmentKpi() {
      this.kpiList = [];
        let data = {};
        if(this.colSel2){
            data = { dept_id: this.colSel2[this.colSel2.length - 1] }
        }
        searchDepartmentKpi(data).then(({ data })=>{
          this.kpiList = [...data.msg];
        });
        if(this.colSel2){
            data = { 
              dept_id: this.colSel2[this.colSel2.length - 1] ,
              work_days:this.work_days,
              work_time:this.work_time
              }
        }
        getDepartmentTime(data).then(({ data })=>{
          this.workTime= data.msg;
        })


    },
    formatList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.selectList);
    }
  },
  async created() {
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>

<style>
</style>