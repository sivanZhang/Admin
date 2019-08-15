<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <input class="file_inp" ref="file_inp" type="file" @change="importExcel($event.target)" />
      <el-button
        icon="el-icon-circle-plus"
        type="success"
        @click="openFile"
        class="pan-btn green-btn"
        size="mini"
      >导入资产</el-button>
      <el-button
        icon="el-icon-upload"
        type="success"
        @click="getAsset"
        class="pan-btn green-btn"
        size="mini"
        :disabled="uploadDisabled"
      >上传</el-button>
    </div>
    <div>
      <import-table-template ref="tableTemplate" @returnAssemblingData="returnAssemblingData"></import-table-template>
    </div>
  </div>
</template>

<script>
import * as HTTP from "@/api/assets";
import XLSX from "xlsx";
import ImportTableTemplate from "@/views/components/importTableTemplate";
export default {
  neme: "asset-import",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      uploadDisabled: true,
      keysMap: {
        //category: "资产类别",
        image: "缩略图",
        path: "路径",
        name: "资产名称",
        //creator: "创建者",
        //team: "资产当前属于哪个部门",
        inner_version: "内部资产版本号",
        outer_version: "外部资产版本号",
        priority: "优先级（高中低）",
        level: "资产的难度等级（简单、标准、难）",
        //project: "资产属于哪个项目",
        session: "场次",
        frame: "帧数",
        episode: "集数",
        links: "资产的制作环节",
        content: "制作内容",
        date_start: "开始日期",
        date_end: "结束日期",
        asset: "资产",
        dept: "工种"
      },
      testDataJSON: []
    };
  },
  components: { ImportTableTemplate },
  methods: {
    openFile() {
      this.$refs.file_inp.click();
    },
    //导入excel 变异为数组
    importExcel(obj) {
      let _self = this;
      if (!obj.files) {
        return;
      }
      let file = obj.files[0],
        types = file.name.split(".")[1],
        fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
          item => item === types
        );
      if (!fileType) {
        this.$message.error("格式错误！请重新选择");
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });
        _self.testDataJSON = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          {
            header:1,//二维数组展示
            raw: false,
            skipHeader: true
          }
        );
        obj.value = null;
        _self.testDataJSON.shift()//去掉工作表头的数据
      };
      reader.readAsBinaryString(file);
      _self.importAsset();
      _self.uploadDisabled = false;
    },
    changeHandlerRadio(value) {
      if (this.hasBindKey.indexOf(value) < 0) {
        let label = this.tableCols[this.selectCurrentCol.index].label;
        this.tableCols[this.selectCurrentCol.index].label =
          label.split(",")[0] + "," + this.keysMap[value];
        this.tableCols[this.selectCurrentCol.index].name = value;
        this.hasBindKey[this.selectCurrentCol.index] = value;
        this.dialogVisible = false;
      } else {
        this.$message.error("改字段已有绑定过");
      }
    },

    //获得编辑后的数据
    getAsset() {
      this.$refs.tableTemplate.getAssemblingData();
    },
    /**
     * 获取表格组装好的数据
     * 组件中必须 @returnAssemblingData="returnAssemblingData"
     */
    returnAssemblingData(data) {
      // _self.uploadDisabled= true
      console.log("组装好的数据-------", data);
      data = { ...data, project: this.$route.params.id };
      //提交jsons数据
      HTTP.uploadAssets(data).then(({data}) => {
        this.$message(`资产创建成功${data.create_asset.success_num}条、失败${data.create_asset.failure_num}条; 环节创建成功${data.create_link.success_num}条、失败${data.create_link.failure_num}条`)
      });
    },
    //导入数据
    importAsset() {
      //此处接入Ajax
      let _self = this;
      _self.$refs.tableTemplate.openLoading("数据导入中");
      setTimeout(() => {
        let data = {};
        data.datas = _self.testDataJSON;
        data.keysMap = _self.keysMap;
        _self.$refs.tableTemplate.initData(data);
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.file_inp {
  display: none;
}
</style>
