<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <input class="file_inp" ref="file_inp" accept=".xlsx" type="file" @change="importExcel" />
      <el-button
        icon="el-icon-circle-plus"
        type="success"
        @click="openFile"
        class="pan-btn green-btn"
        size="mini"
      >添加Excel</el-button>
      <!-- openFile -->
      <el-button
        icon="el-icon-upload"
        type="success"
        @click="getAsset"
        class="pan-btn green-btn"
        size="mini"
        :loading="uploadLoading"
        :disabled="uploadDisabled"
      >上传</el-button>
      <el-button
        icon="el-icon-refresh-left"
        type="success"
        @click="importAsset(1)"
        class="pan-btn green-btn"
        size="mini"
      >清空表格</el-button>
      <el-button
        icon="el-icon-delete-solid"
        type="danger"
        @click="deleteTableRow()"
        class="pan-btn red-btn"
        v-show="$refs.tableTemplate?$refs.tableTemplate.tableData.length : false"
        size="mini"
      >删除已选</el-button>
    </div>
    <import-table-template ref="tableTemplate" @returnAssemblingData="returnAssemblingData"></import-table-template>
  </div>
</template>

<script>
import { uploadDates } from "@/api/admin";
import { updateWorkLog } from "@/api/checkingIn";
import ImportTableTemplate from "@/views/components/importTableTemplate";
import { parseExcel } from "@/api/assets";
export default {
  neme: "asset-import",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      uploadLoading: false,
      uploadDisabled: true,
      requiredKeysMap: {
        festivalname: "节假日名",
        festivalday: "日期"
      },
      keysMap: {},
      testDataJSON: []
    };
  },
  components: { ImportTableTemplate },
  methods: {
    //点击隐藏的上传文件按钮
    openFile() {
      this.$refs.file_inp.click();
    },
    deleteTableRow() {
      this.$refs.tableTemplate.deleteRow();
    },
    //导入excel 变异为数组
    importExcel(e) {
      if (!e.target.files) {
        return;
      }
      let file = e.target.files[0];
      let Fdata = new FormData();
      Fdata.append("file", file);
      this.$refs.tableTemplate.openLoading("数据导入中");
      parseExcel(Fdata).then(({ data }) => {
        //这里可判断数据是否为空
        this.testDataJSON = [...data.msg];
        this.importAsset();
        this.uploadDisabled = false;
        e.target.value = null; //可以重新导入同一个表
      });
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
      //提交jsons数据
      this.uploadLoading = true;
      uploadDates(data)
        .then(({ data }) => {
          if (data.msg) {
            this.$message.warning(data.msg);
          } else {
            this.$notify({
              title: "提交状态",
              message: `资产/镜头创建成功${data.create_asset.success_num}条、失败${data.create_asset.failure_num}条; 环节创建成功${data.create_link.success_num}条、失败${data.create_link.failure_num}条`,
              duration: 0,
              type: "warning"
            });
            this.$router.push({
              name: "project-detail",
              params: { id: this.$route.params.id },
              qurey: {
                tab: "tab0"
              }
            });
          }
        })
        .finally(() => {
          this.uploadLoading = false;
        });
    },
    //导入数据 type=1表示重置
    importAsset(type) {
      if (type === 1) {
        this.$refs.tableTemplate.initData({
          reset: true,
          datas: [],
          keysMap: {},
          requiredKeysMap: {}
        });
        return;
      }
      let data = {
        reset: false,
        datas: this.testDataJSON,
        keysMap: this.keysMap,
        requiredKeysMap: this.requiredKeysMap
      };
      this.$refs.tableTemplate.initData(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.file_inp {
  display: none;
}
</style>
