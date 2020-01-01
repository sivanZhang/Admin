 <template>
  <div>
    <el-row style="padding-bottom:10px">
      <el-col style="text-align:right">
        <div style="display:flex;justify-content:flex-end">
          <el-select v-model="colSel" placeholder="请选择" style="width:130px" filterable size="mini">
            <el-option
              v-for="item in columnSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-if="colShow"
            placeholder="输入关键字搜索"
            v-model="keyword"
            size="mini"
            @keyup.enter.native="getOutTasks()"
            style="width:240px"
          ></el-input>
          <el-select
            v-if="colSel === 'status' || colSel === 'grade'||colSel === 'priority'"
            v-model="colSel2"
            placeholder="请选择"
            style="width:300px;margin-top:1px"
            multiple
            filterable
            size="mini"
          >
            <el-option
              v-for="item in columnSelect2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div v-if="colSel === 'start_date' || colSel === 'end_date'">
            <el-date-picker
              v-model="timeSelection"
              type="date"
              placeholder="选择日期"
              size="mini"
              style="width:130px"
            ></el-date-picker>
            <span style="text-align:center;padding-top:3px">至</span>
            <el-date-picker
              v-model="timeSelection2"
              type="date"
              placeholder="选择日期"
              size="mini"
              style="width:130px"
            ></el-date-picker>
          </div>
          <el-button @click="getOutTasks()" type="primary" style="margin-left:5px">查询</el-button>
          <el-button @click="reOutTask()" type="primary">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      ref="outTaskLiist"
      :cell-style="cellStyle"
      :data="outTaskLiist.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :row-style="{height:50}"
    >
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="项目">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" width="180px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.asset.image"
            style="width: 180px;height: 100px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <el-image :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"></el-image>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="asset.name" label="镜头号"></el-table-column>
      <el-table-column prop="asset.episode" label="集数" width="60px"></el-table-column>
      <el-table-column prop="asset.session" label="场次" width="60px"></el-table-column>
      <el-table-column width="30px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
            <el-card
              v-if="scope.row.status === 0"
              :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px',padding: '25px 5px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
            <el-card
              v-if="scope.row.status === 1"
              :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px',padding: '25px 5px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
            <el-card
              v-if="scope.row.status === 2"
              :style="{width:'10px',backgroundColor:'#589BAD',border:'0px',padding: '25px 5px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
            <el-card
              v-if="scope.row.status === 3"
              :style="{width:'10px',backgroundColor:'#2D5637',border:'0px',padding: '25px 5px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：完成" placement="top">
            <el-card
              v-if="scope.row.status === 4"
              :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px',padding: '25px 5px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：超时" placement="top">
            <el-card
              v-if="scope.row.status === 5"
              :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px',padding: '25px 5px'}"
            ></el-card>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="任务状态/进度"
        prop="status"
        width="140px"
        align="left"
       
      >
        <template slot-scope="scope">
          {{scope.row.status|taskStatus}}
          <el-progress
            :stroke-width="12"
            :percentage="scope.row.schedule"
            v-if="scope.row.status != 3 && scope.row.status != 4"
          ></el-progress>
          <div v-if="scope.row.status == 3">{{scope.row.statements}}</div>
        </template>
      </el-table-column>
      <el-table-column label="开始日期">
        <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="total_hour" header-align="left" label="预设时间（小时）" width="80px;">
        <template slot-scope="scope">{{scope.row.total_hour}}</template>
      </el-table-column>
      <el-table-column label="提交次数" prop="submit_num"></el-table-column>
      <el-table-column label="难度" header-align="left" prop="grade">
        <template slot-scope="scope">{{scope.row.grade|taskgrade}}</template>
      </el-table-column>
      <el-table-column label="优先级" header-align="left" prop="priority">
        <template slot-scope="scope">{{scope.row.priority|taskPriority}}</template>
      </el-table-column>
      <!-- <el-table-column prop="link_dept" label="工种id"></el-table-column> -->
      <el-table-column prop="link_dept_name" label="工种名称"></el-table-column>
      <el-table-column prop="link_content" label="环节内容" width="50px;"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="outTaskLiist.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getOutTask, queryTask, getStatusTaskList } from "@/api/task";
export default {
  data() {
    return {
      outTaskLiist: [],
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      StatusList: [
        {
          label: "暂停",
          value: 0
        },
        {
          label: "未开始",
          value: 1
        },
        {
          label: "进行中",
          value: 2
        },
        {
          label: "超时",
          value: 5
        }
      ],
      changecolor: 1,
      colSel: "project_name",
      keyword: "",
      columnSelect: [
        {
          value: "project_name",
          label: "项目名称"
        },
        {
          value: "assetname",
          label: "镜头号"
        },
        {
          value: "priority",
          label: "优先等级"
        },
        {
          value: "start_date",
          label: "开始日期"
        },
        {
          value: "grade",
          label: "难度"
        },
        {
          value: "status",
          label: "状态"
        }
      ],
      name: "",
      colShow: true,
      colSel2: [],
      columnSelect2: [],
      timeSelection: "",
      timeSelection2: "",
      currentGrade: null
    };
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        this.columnSelect2 = [];
        switch (newVal) {
          case "status":
            this.colShow = false;
            this.columnSelect2 = [
              {
                value: 0,
                label: "暂停"
              },
              {
                value: 1,
                label: "未开始"
              },
              {
                value: 2,
                label: "进行中"
              },
              {
                value: 3,
                label: "审核中"
              },
              {
                value: 4,
                label: "完成"
              },
              {
                value: 5,
                label: "超时"
              },
              {
                value: 6,
                label: "反馈中"
              }
            ];
            break;
          case "grade":
            this.colShow = false;
            this.colSel2 = [1];
            this.columnSelect2 = [
              {
                label: "A+",
                value: 0
              },
              {
                label: "A",
                value: 1
              },
              {
                label: "A-",
                value: 2
              },
              {
                label: "B+",
                value: 3
              },
              {
                label: "B",
                value: 4
              },
              {
                label: "B-",
                value: 5
              },
              {
                label: "C+",
                value: 6
              },
              {
                label: "C",
                value: 7
              },
              {
                label: "D+",
                value: 8
              },
              {
                label: "D",
                value: 9
              },
              {
                label: "E",
                value: 10
              }
            ];
            break;
          case "priority":
            this.colShow = false;
            this.colSel2 = [0];
            this.columnSelect2 = [
              {
                value: 0,
                label: "低"
              },
              {
                value: 1,
                label: "中"
              },
              {
                value: 2,
                label: "高"
              }
            ];
            break;

          case "start_date":
            this.colShow = false;
            this.timeSelection = "";
            this.timeSelection2 = "";
            break;
          case "end_date":
            this.colShow = false;
            this.timeSelection = "";
            this.timeSelection2 = "";
            break;
          default:
            this.colShow = true;
            this.colSel2 = [];
            this.columnSelect2 = [];
        }
      }
    }
  },
  methods: {
    // 表内单元格样式（状态、优先级改变背景色）
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === "task.priority") {
        switch (row.task.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property === "grade") {
        switch (row.grade) {
          case 0:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return {
        borderRight: 0
      };
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
   //搜索
    getOutTasks() {
      let data = {};
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
      }
      switch (this.colSel) {
        case "project_name":
          this.keyword &&
            (data = {
              ...data,
              project_name: this.keyword,
              pagenum: 20,
              page: 1
            });
          this.name = { project_name: this.keyword };
          break;
        case "assetname":
          this.keyword &&
            (data = { ...data, assetname: this.keyword, pagenum: 20, page: 1 });
          this.name = { assetname: this.keyword };
          break;
        case "grade":
          if (this.colSel2.length) {
            data = {
              ...data,
              grade: "[" + String(this.colSel2) + "]",
              pagenum: 20,
              page: 1
            };
            this.name = { grade: "[" + String(this.colSel2) + "]" };
          }
          break;
        case "start_date":
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              start: "" + "," + DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            };
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) + "," + "",
              pagenum: 20,
              page: 1
            };
          } else {
            data = {
              ...data,
              start:
                DateFormat(this.timeSelection) +
                "," +
                DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            };
          }
          this.name = {
            start_date: DateFormat(this.timeSelection)
          };
          break;
        case "end_date":
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              end: "" + "," + DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            };
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) + "," + "",
              pagenum: 20,
              page: 1
            };
          } else {
            data = {
              ...data,
              end:
                DateFormat(this.timeSelection) +
                "," +
                DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            };
          }
          this.name = { end_date: DateFormat(this.timeSelection) };
          break;
        case "priority":
          if (this.colSel2.length) {
            data = {
              ...data,
              priority: "[" + String(this.colSel2) + "]",
              pagenum: 20,
              page: 1
            };
            this.name = { priority: "[" + String(this.colSel2) + "]" };
          }
          break;
        case "status":
          if (this.colSel2.length) {
            data = {
              ...data,
              status: "[" + String(this.colSel2) + "]",
              pagenum: 20,
              page: 1
            };
            this.name = { status: "[" + String(this.colSel2) + "]" };
          }
          break;
      }
      getOutTask(data).then(({ data }) => {
        this.outTaskLiist = [...data.msg];
        // this.authRole = data.auth.can_manage_material_state;
        this.currentPage = 1;
      });
    },
    //重置
    reOutTask() {
      getOutTask().then(
        ({ data }) => {
          this.outTaskLiist = [...data.msg];
         // this.currentPage = 1;
          this.keyword = "";
          this.colSel = "project_name";
          this.colSel2 = [];
          this.timeSelection = "";
          this.timeSelection2 = "";
        }
      );
    },
    //获取待提交外包任务列表
    getOutTaskList() {
      getOutTask().then(
        ({ data }) => {
          this.outTaskLiist = [...data.msg];
          // console.log("111111111");
          // console.log(this.outTaskLiist);
        }
      );
    }
  },
  created() {
    this.getOutTaskList();
  }
};
</script>

<style>
</style>