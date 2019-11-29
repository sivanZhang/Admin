<template>
  <!--部门内，全部项目的任务/人员分配图(甘特图表示) -->
  <div id="personalDistribute" >
    <!-- 甘特图组件  +table-->
    <el-row>
        <el-col :span="4">
          <label for style="width:80px">部门人员工时统计</label>
        </el-col>
        <el-col :span="8">
          <el-cascader
            v-model="colSel2"
            placeholder="输入搜索部门"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
          ></el-cascader>
        <el-button type="primary" @click="getSearchDepartment()">开始统计</el-button>
        <el-button type="primary" @click="refreshDept()">重置</el-button>
        </el-col>
      </el-row>
    <!-- <div class="gantt-header">
      <h4>部门人员工时统计</h4>
      <div class="query-parent">
          <el-cascader
            v-model="colSel2"
            placeholder="输入搜索部门"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
          ></el-cascader>
        <el-button type="primary" @click="getSearchDepartment()">开始统计</el-button>
        <el-button type="primary" @click="refreshDept()">重置</el-button>
      </div>
    </div> -->
    <!-- <Gantt
      v-loading="ganttStatLoading"
      :gantt-data="ganttStatData"
      :customHeaderOption="customHeaderOption"
      :customOptions="customOptions"
    /> -->
    <div style="padding-top:15px;width:100%">
      <el-table
        :data="userGantTable"
        :border="true"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        :span-method="objectSpanMethod"
        
      >
        <el-table-column label="人员名称" prop="name"></el-table-column>
        <el-table-column label="开始时间" prop="start">
          <template slot-scope="scope">{{scope.row.start|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="结束时间" prop="end">
          <template slot-scope="scope">{{scope.row.end|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="计划工时（小时）" prop="plan"></el-table-column>
        <el-table-column label="实际工时（小时）" prop="actual"></el-table-column>
        <el-table-column label="进度" prop="progress">
          <template slot-scope="scope">
            <el-progress :stroke-width="12" :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getDeptMember } from "@/api/statistics";
import { mapState } from "vuex";
import dayjs from "dayjs";
import Gantt from "@/components/Gantt";
export default {
  name: "personalDistribute",
  components:{
    Gantt
  },
  data() {
    return {
        userGantTable: [],
        user: [],
        selectList: [],
        deptChoose: [],
        colSel2: null,
        ganttStatData: [], // 传给甘特图的数据
        ganttStatLoading: false,
        //甘特图 的header配置,
      customHeaderOption: {
        title: {
          label: ""
        }
      },
      //甘特图的配置
      customOptions: {
        taskList: {
          //甘特图中的表格配置
          columns: [
            {
              id: 1,
              label: "人员名称",
              value: task => {
                if (task.parentId) {
                  return "";
                } else {
                  return task.name;
                }
              },
              width: 130,
              expander: true // 显示 "+" 拓展图标
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 100,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 100
            },
            {
              id: 4,
              label: "计划工时",
              value: "preinstall",
              width: 80
            },
            {
              id: 5,
              label: "实际工时",
              value: "actual",
              width: 80
            },
            {
              id: 6,
              label: "进度",
              value: task => `${task.progress}%`,
              width: 80,
              html: true
            }
          ]
        }
      },
    };
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"]), //DeptUsers是根据登录账号得来的
    groupNum() {
      return new Set(this.userGantTable.map(item => item.name));
    }
  },
  watch:{
     
  },
  mounted(){
    // this.getganttStat();
  },
  methods: {
      //获取甘特图数据
    // getganttStat() {
    //   this.ganttStatLoading = true;
    //   this.ganttStatData = [];
    //   let data = {};
    //   if(this.colSel2){
    //         data = { dept_id: this.colSel2[this.colSel2.length - 1] }
    //     }
    //   // this.kpiList = [];
    //   getDeptMember(data).then(({ data }) => {
    //       // this.userGantTable = [];//表格中的data
    //       let arr = [...data.msg];
    //       arr.map(item => {
    //         this.userGantTable.push({
    //           id: item[0],
    //           name: item[1],
    //           start: item[2],
    //           end: item[3],
    //           plan: item[4],
    //           progress: item[5],
    //           actual: item[6]
    //         });
    //       });
    //       if (this.user.length) {
    //         // this.ganttStatData = [];
    //         arr.map((t, i) => {
    //           this.user.forEach(item => {
    //             if (t[1] === item.name) {
    //               let obj = {
    //                 id: t[0], // *
    //                 type: "task", // * 甘特图内图形显示类型
    //                 start: t[2] * 1000, // *任务开始时间
    //                 end: t[3] * 1000,
    //                 progress: t[5] || 0, // *进度
    //                 duration: t[4] * 60 * 60 * 1000, // *工时
    //                 label: `${t[1]} (${t[5] || 0}%)`, // *
    //                 collapsed: false, // * 有子节点默认是否收缩
    //                 name: t[1],
    //                 preinstall: t[4],
    //                 actual: t[6]
    //               };
    //               if (t[7]) {
    //                 obj.parentId = t[7];
    //               }
    //               this.ganttStatData.push(obj);
    //             }
    //           });
    //         });
    //       } else {
    //         this.ganttStatData = [];
    //         this.ganttStatData = arr.map((t, i) => {
    //           let obj = {
    //             id: t[0], // *
    //             type: "task", // * 甘特图内图形显示类型
    //             start: t[2] * 1000, // *任务开始时间
    //             end: t[3] * 1000,
    //             progress: t[5] || 0, // *进度
    //             duration: t[4] * 60 * 60 * 1000, // *工时
    //             label: `${t[1]} (${t[5] || 0}%)`, // *
    //             collapsed: false, // * 有子节点默认是否收缩
    //             name: t[1],
    //             preinstall: t[4],
    //             actual: t[6]
    //           };
    //           if (t[7]) {
    //             obj.parentId = t[7];
    //           }
    //           return obj;
    //         });
    //       }
    //       // console.log(this.ganttStatData);
    //     })
    //     .finally(() => {
    //       this.ganttStatLoading = false;
    //     });
    // },
     //甘特图处理table数据
    Group(name) {
      return this.userGantTable.filter(item => item.name == name).length;
    },
    NameLen(name) {
      const tmp = Array.from(this.groupNum);
      const index = tmp.indexOf(name);
      let len = 0;
      for (let i = 0; i < index; i++) {
        len += this.Group(tmp[i]);
      }
      return len;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const len = this.Group(row.name);
        const lenName = this.NameLen(row.name);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    //重置下拉列表框数据
    refreshDept(){
      this.colSel2 = [];
      // this.getganttStat();
    },
    //查询部门人员
    getSearchDepartment() {
      this.user = [];
      let data = {};
      if(this.colSel2){
            data = { dept_id: this.colSel2[this.colSel2.length - 1] }
        }
      getDeptMember(data).then(({ data }) => {
          this.userGantTable = [];
          let arr = [...data.msg];
          arr.map(item => {
            this.userGantTable.push({
              id: item[0],
              name: item[1],
              start: item[2],
              end: item[3],
              plan: item[4],
              progress: item[5],
              actual: item[6]
            });
          });
      });
      // this.getganttStat();//获取甘特图的数据/
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
      //获取部门列表
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>
<style lang="scss" scoped>
// #personalDistribute {
//   position: relative;
//   width: 100%;
// }
// .gantt-header {
//   position: relative;
//   .query-parent {
//     position: absolute;
//     bottom: -40px;
//     text-align: left;
//   }
// }
</style>