<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
      </el-col>

      <el-col :span="20" style="padding-bottom:10px" align="right">
        <!-- 筛选 -->
        <div style="display:flex;width:470px">
          <el-select v-model="colSel" placeholder="请选择" style="width:190px;" filterable>
            <el-option
              v-for="item in columnSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-select
            v-if="colShow1"
            v-model="colSel2"
            placeholder="请选择"
            style="width:280px;margin-top:1px"
            filterable
            @change="getSearchKpi()"
          >
            <el-option
              v-for="item in columnSelect2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-cascader
            @change="getSearchKpi()"
            v-if="colShow2"
            v-model="colSel2"
            placeholder="输入搜索工种"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
            style="width:280px"
          ></el-cascader>
          <el-select
            v-if="colShow3"
            v-model="colSel2"
            placeholder="请选择"
            style="width:280px;margin-top:1px"
            filterable
            @change="getSearchKpi()"
          >
            <el-option
              v-for="item in UserList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
          <div v-if="colSel === 'date' " style="width:280px;display:flex;">
            <el-date-picker v-model="start_date" type="date" placeholder="选择日期" size="mini"></el-date-picker>
            <span style="text-align:center;padding-top:3px">至</span>
            <el-date-picker v-model="end_date" type="date" placeholder="选择日期" size="mini"></el-date-picker>
          </div>
          <el-button
            @click="getSearchKpi()"
            icon="el-icon-search"
            type="primary"
            style="height:27.99px"
          />
        </div>
      </el-col>
    </el-row>
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
      <el-table-column prop="client_total_asset" label="完成镜头数量（客户通过的）"></el-table-column>
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
export default {
  data() {
    return {
      kpiList: [],
      uploadVisible: false,
      colSel: "month_num",
      colSel2: null,
      columnSelect: [
        {
          value: "month_num",
          label: "月份跨度"
        },
        {
          value: "dept_id",
          label: "部门"
        },
        {
          value: "user_id",
          label: "人员名称"
        },
        {
          value: "date",
          label: "自定义时间"
        }
      ],
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
      colShow1: true,
      colShow2: false,
      colShow3: false,
      selectList: [],
      start_date: null,
      end_date: null
    };
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        // console.log(newVal);
        switch (newVal) {
          case "month_num":
            this.columnSelect2 = [];
            this.colShow1 = true;
            this.colShow2 = false;
            this.colShow3 = false;
            // this.colSel2 = [1];
            this.columnSelect2 = [
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
              }
            ];
            break;
          case "dept_id":
            this.columnSelect2 = [];
            this.colShow1 = false;
            this.colShow2 = true;
            this.columnSelect2 = this.selectList;
            break;
          case "user_id":
            this.colShow1 = false;
            this.colShow2 = false;
            this.colShow3 = true;
            break;
          case "date":
            this.colShow1 = false;
            this.colShow2 = false;
            this.colShow3 = false;
            break;
          default:
            this.colShow1 = true;
            this.colShow2 = false;
            this.colShow3 = false;
            this.colSel2 = [];
            this.columnSelect2 = [];
        }
      }
    }
  },
  methods: {
    //kpi列表导出
    //任务导出dialog
    targetUpload() {
      this.uploadVisible = true;
      // console.log("111111111");
      // let data = {
      //   ...this.name,
      //   ...this.multiSelect,
      //   project: this.$route.params.id,
      //   print: "null"
      // };
      // HTTP.queryTask(data)
      //   .then(({ data }) => {
      //     if (data.status === 0) {
      //       this.uploadVisible = true;
      //       this.path = data.path;
      //       this.multiSelect = [];
      //       this.name = [];
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(data.msg);
      //     // this.uploadVisible = true;
      //     this.multiSelect = [];
      //     this.name = [];
      //   });
    },
    //导出Excel
    download() {
      let data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      //  this.download();
      this.uploadVisible = false;
    },
    //获取kpi列表
    getSearchKpi() {
      let data = {};
      if (this.colSel2||this.start_date||this.end_date) {
        switch (this.colSel) {
          case "month_num":
            data = { month_num: this.colSel2 };
            break;
          case "dept_id":
            data = { dept_id: this.colSel2[this.colSel2.length - 1] };
            break;
          case "user_id":
            data = { user_id: this.colSel2 };
            break;
          case "date":
            function DateFormat(dateVal) {
              return new Date(dateVal).toLocaleDateString();
            }
            data = {
              start_date: this.start_date?DateFormat(this.start_date):"",
              end_date: this.end_date?DateFormat(this.end_date):""
            };
        }
        // console.log(data)
      }
      this.kpiList = [];
      searchKpi(data).then(({ data }) => {
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
                  client_total_modify: item.outer[keys2[i]].client_total_modify,
                  kpi:
                    item.inner[keys1[i]].inner_total_frame /
                    (22 * 8 + item.inner[keys1[i]].inner_total_overtime),
                  sub: []
                });
              }
            }
          }
        });
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