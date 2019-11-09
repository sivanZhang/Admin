<template>
  <div id="kpi">
    <el-row>
      <el-col :span="5">
         <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
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
export default {
  data() {
    return {
      kpiList: [],
      uploadVisible: false,
    };
  },
  methods: {
    //kpi列表导出
        //任务导出dialog
    targetUpload() {
      this.uploadVisible = true;
      console.log("111111111")
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
      this.kpiList = [];
      searchKpi().then(({ data }) => {
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
              if (i == j) {
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
        // console.log(this.kpiList);
      });
    }
  },
  created() {
    this.getSearchKpi();
  }
};
</script>
<style lang='scss' scoped>
</style>