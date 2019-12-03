
 <!-- 部门kpi -->
 <template>
  <div>
    <el-row>
      <el-col  align="right">
        <div style="display:flex;width:150px;align-items:center">
          <el-tooltip class="item" effect="dark" content="多条件筛选" placement="top">
            <el-popover v-model="visible2" placement="bottom" width="600" trigger="click">
              <el-form ref="sortSelForm" :model="sortSelForm" label-width="80px" :rules="saveRules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="部门" prop="dept_id">
                      <el-cascader
                        v-model="sortSelForm.dept_id"
                        placeholder="输入搜索工种"
                        :options="selectList"
                        :props="{ checkStrictly: true}"
                        filterable
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="自定义时间">
                    <div style="display:flex">
                      <el-col :span="11">
                        <el-date-picker
                          v-model="sortSelForm.start_date"
                          type="date"
                          placeholder="开始日期"
                          size="mini"
                        ></el-date-picker>
                      </el-col>
                      <el-col :span="2" align="center">
                        <span style="padding-top:3px">至</span>
                      </el-col>
                      <el-col :span="11" align="right">
                        <el-date-picker
                          v-model="sortSelForm.end_date"
                          type="date"
                          placeholder="结束日期"
                          size="mini"
                        ></el-date-picker>
                      </el-col>
                    </div>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-col align="right">
                    <el-button type="primary" @click="getDepartmentKpi()">筛选</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <el-button
                slot="reference"
                type="primary"
                style="margin-left: 15px"
                size="mini"
                @click="showMul()"
              >筛选</el-button>
            </el-popover>
          </el-tooltip>
        </div>
      </el-col>
      <!-- <el-col :span="2">
        <el-button @click="getTasks()" style="margin-left: 15px" type="primary" size="mini">重置</el-button>
      </el-col>-->
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
    <!-- 部门本月的总工时实际工时和空闲工时 -->
    <div style="padding-top:25px">
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
      kpiList: [],
      selectList: [],
      colSel2: null,
      workTime: [],
      work_days: "",
      work_time: "",
      visible2: false,
      sortSelForm: {},
      showMulChoose: [],
      showTimeChoose:[],
      saveRules: {
        dept_id: [
          {
            required: true,
            trigger: "blur",
            message: "请选择部门名称"
          }
        ]
      },
    };
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  methods: {
    //重置
    getTasks() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
      let data = { ...this.showMulChoose };
      this.searchDepartmentKpi(data);
    },
    showMul() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
    },
    getDepartmentKpi() {
      this.$refs["sortSelForm"].validate(valid => {
        if (valid) {
      this.mulChoose = true;
      this.visible2 = false;
      let data = {};
      function DateFormat(dateVal) {
        return new dayjs(dateVal).format("YYYY/MM/DD");
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.sortSelForm.dept_id) {
        this.showMulChoose.dept_id = this.sortSelForm.dept_id[
          this.sortSelForm.dept_id.length - 1
        ];
        this.showTimeChoose.dept_id = this.sortSelForm.dept_id[
          this.sortSelForm.dept_id.length - 1
        ];
      }
      if (this.sortSelForm.start_date) {
        this.showMulChoose.start_date = this.sortSelForm.start_date
          ? DateFormat(this.sortSelForm.start_date)
          : "";
      }
      if (this.sortSelForm.end_date) {
        this.showMulChoose.end_date = this.sortSelForm.end_date
          ? DateFormat(this.sortSelForm.end_date)
          : "";
      }
      data = { ...this.showMulChoose };
      this.searchDepartmentKpi(data);
        }
      });
    },
    searchDepartmentKpi(data) {
      this.kpiList = [];
      this.workTime = [];
      searchDepartmentKpi(data).then(({ data }) => {
        this.kpiList = [...data.msg];
      });
      getDepartmentTime({...this.showTimeChoose}).then(({ data }) => {
        this.workTime = data.msg;
      });
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