<template>
  <div>
    <el-row>
      <el-col :span="19">
        <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
      </el-col>
      <el-col :span="3" style="padding-bottom:10px">
        <!-- 筛选 -->
        <div style="display:flex;width:150px;align-items:center">
          <span
            @click="openExplain()"
            style="padding-right:10px;font-size:12px;color:#808080;cursor: pointer;"
          >
            使用帮助:
            <svg-icon icon-class="wenhao" />
          </span>
          <el-tooltip class="item" effect="dark" content="多条件筛选" placement="top">
            <el-popover v-model="visible2" placement="bottom" width="600" trigger="click">
              <el-form ref="sortSelForm" :model="sortSelForm" label-width="80px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="月份跨度" prop="month_num">
                      <el-select v-model="sortSelForm.month_num" placeholder="请选择">
                        <el-option
                          v-for="item in columnSelect2"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="人员名称" prop="user_id">
                      <el-select
                        v-model="sortSelForm.user_id"
                        placeholder="请选择"
                        filterable
                        multiple
                      >
                        <el-option
                          v-for="item in UserList"
                          :key="item.id"
                          :label="item.username"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
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
                    <el-button type="primary" @click="getSearchKpi()">筛选</el-button>
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
      <el-col :span="2">
        <el-button @click="getTasks()" style="margin-left: 15px" type="primary" size="mini">重置</el-button>
      </el-col>
    </el-row>
    <manFilter ref="manFilter" @refresh_close="searchKpi"/>
    <el-table
      :data="kpiList"
      :tree-props="{children: 'sub'}"
      :row-key="row=>(row.id + 20000)"
      :stripe="true"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      style="margin-top:15px;width:100%"
      highlight-current-row
      border
      default-expand-all
    >
      <el-table-column prop="member_name" label="制作人员"></el-table-column>
      <el-table-column prop="client_total_asset" label="完成镜头数量 (客户通过的)" width="110"></el-table-column>
      <el-table-column prop="level" label="难度等级">
        <template slot-scope="scope">{{scope.row.level|Level }}</template>
      </el-table-column>
      <el-table-column prop="client_total_frame" label="总帧数"></el-table-column>
      <el-table-column prop="client_total_modify" label="修改次数"></el-table-column>
      <el-table-column prop="inner_total_asset" label="内审通过的镜头数量"></el-table-column>
      <el-table-column prop="inner_total_frame" label="总帧数"></el-table-column>
      <el-table-column prop="inner_total_overtime" label="加班工时"></el-table-column>
      <el-table-column prop="kpi" label="平均单帧制作时长（小时）" width="250px"></el-table-column>
    </el-table>
    <!-- 超前与滞后说明 -->
    <el-dialog title="注意事项" :visible.sync="dialogVisible" width="365px">
      <div class style="padding-left:5px;padding-bottom:20px;padding-right:5px">
        <div style="font-size:12px">默认查询的是本月1号至今天的kpi</div>
      </div>
    </el-dialog>
    <!-- KPI导出 -->
    <el-dialog title="Excel文件导出" :visible.sync="uploadVisible" width="400px" hieght="300px">
      <el-row>
        <el-col :span="6">
          <span>excel文件</span>
        </el-col>
        <el-col :span="18">
          <span @click="download" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchKpi } from "@/api/statistics";
import { mapState } from "vuex";
import manFilter from "@/views/search-kpi/filterContion/manFilter";
import dayjs from "dayjs";
export default {
  data() {
    return {
      kpiList: [],
      uploadVisible: false,
      dialogVisible: false,
      visible2: false,
      sortSelForm: {},
      columnSelect2: [
        {
          value: 1,
          label: "近一个月"
        },
        {
          value: 2,
          label: "近两个月"
        },
        {
          value: 3,
          label: "近三个月"
        },
        {
          value: 4,
          label: "近四个月"
        },
        {
          value: 5,
          label: "近五个月"
        },
        {
          value: 6,
          label: "近半年"
        },
        {
          value: 7,
          label: "近七个月"
        },
        {
          value: 8,
          label: "近八个月"
        },
        {
          value: 9,
          label: "近九个月"
        },
        {
          value: 10,
          label: "近十个月"
        },
        {
          value: 11,
          label: "近十一个月"
        },
        {
          value: 12,
          label: "近一年"
        }
      ],
      selectList: [],
      searchList: [],
      path: null,
      showMulChoose: []
    };
  },
  components: {
    manFilter
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  methods: {
    //默认说明
    openExplain() {
      this.dialogVisible = true;
    },
    //重置
    getTasks() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
      let data = { ...this.showMulChoose };
      this.searchKpi(data);
    },
    //kpi列表导出
    targetUpload() {
      this.uploadVisible = true;
      let data = {
        ...this.searchList,
        print: "null"
      };
      searchKpi(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.uploadVisible = true;
            this.path = data.path;
            this.searchList = [];
          }
        })
        .catch(err => {
          this.$message.error(data.msg);
          this.searchList = [];
        });
    },
    //导出Excel
    download() {
      let data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      this.uploadVisible = false;
    },
    showMul() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
    },
    //筛选
    getSearchKpi() {
      this.mulChoose = true;
      this.visible2 = false;
      let data = {};
      function DateFormat(dateVal) {
        return new dayjs(dateVal).format("YYYY/MM/DD");
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.sortSelForm.month_num) {
        this.showMulChoose.month_num = this.sortSelForm.month_num;
      }
      if (this.sortSelForm.dept_id) {
        this.showMulChoose.dept_id = this.sortSelForm.dept_id[
          this.sortSelForm.dept_id.length - 1
        ];
      }
      if (this.sortSelForm.user_id) {
        this.showMulChoose.user_id = this.sortSelForm.user_id.join();
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
      this.searchKpi(data);
      this.$refs["manFilter"].filterCondition(showMulChoose, sortSelForm);
    },

    //获取kpi列表
    searchKpi(data) {
      this.searchList = data;
      this.kpiList = [];
      searchKpi(data).then(({ data }) => {
        if (data.status == 0) {
          [...data.msg].map((item, index) => {
            this.kpiList.push({
              id: index + 1,
              inner_total_asset: item.inner.inner_total_asset,
              inner_total_frame: item.inner.inner_total_frame,
              level: Number(-1),
              inner_total_overtime: item.inner.inner_total_overtime,
              member_name: item.member_name,
              client_total_asset: item.outer.client_total_asset,
              client_total_frame: item.outer.client_total_frame,
              client_total_modify: item.outer.client_total_modify,
              kpi:
                item.inner.inner_total_frame /
                (22 * 8 + item.inner.inner_total_overtime),
              sub: []
            });
          });
          [...data.msg].map((item, index) => {
            const keys1 = Object.keys(item.inner);

            const keys2 = Object.keys(item.outer);

            for (let i = 0; i < keys1.length - 4; i++) {
              for (let j = 0; j < keys2.length - 4; j++) {
                if (i === j) {
                  this.kpiList[index].sub.push({
                    id: keys1[i] + 1000,
                    inner_total_asset: item.inner[keys1[i]].inner_total_asset,
                    inner_total_frame: item.inner[keys1[i]].inner_total_frame,
                    level: Number(keys1[i]),
                    inner_total_overtime:
                      item.inner[keys1[i]].inner_total_overtime,
                    member_name: "",
                    client_total_asset: item.outer[keys2[i]].client_total_asset,
                    client_total_frame: item.outer[keys2[i]].client_total_frame,
                    client_total_modify:
                      item.outer[keys2[i]].client_total_modify,
                    kpi:
                      item.inner[keys1[i]].inner_total_frame /
                      (22 * 8 + item.inner[keys1[i]].inner_total_overtime),
                    sub: []
                  });
                }
              }
            }
          });
          //
        } else {
          this.$message.error(data.msg);
        }
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
    this.getSearchKpi();
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>
<style lang='scss' scoped>
</style>