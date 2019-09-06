<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <input
        class="file_inp"
        ref="file_inp"
        accept=".xlsx"
        type="file"
        @change="importExcel"
      />
      <el-button
        icon="el-icon-circle-plus"
        type="success"
        @click="openFile"
        class="pan-btn green-btn"
        size="mini"
      >添加Excel</el-button>
      <el-button
        icon="el-icon-upload"
        type="success"
        @click="getAsset"
        class="pan-btn green-btn"
        size="mini"
        :disabled="uploadDisabled"
      >上传</el-button>
    </div>
    <import-table-template ref="tableTemplate" @returnAssemblingData="returnAssemblingData"></import-table-template>
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
      requiredKeysMap: {
        name: "镜头号",
        content: "制作内容",
        date_start: "开始日期",
        date_end: "结束日期",
      },
      keysMap: {
        //category: "资产类别",
        image: "缩略图",
        path: "路径",
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
        asset: "资产",
        dept: "工种"
      },
      testDataJSON: []
    };
  },
  components: { ImportTableTemplate },
  methods: {
    //点击隐藏的上传文件按钮
    openFile() {
      this.$refs.file_inp.click();
    },
    //导入excel 变异为数组
    importExcel(e) {
      if (!e.target.files) {
        return;
      }
      let file = e.target.files[0]
      let Fdata = new FormData()
      Fdata.append('file',file)
      this.$refs.tableTemplate.openLoading("数据导入中");
      HTTP.parseExcel(Fdata).then(({data})=>{
        //这里可判断数据是否为空
        this.testDataJSON = [...data.msg];
        this.importAsset();
        this.uploadDisabled = false;
        obj.value = null;//可以重新导入同一个表
      })
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
      data = { ...data, project: this.$route.params.id };
      //提交jsons数据
      HTTP.uploadAssets(data).then(({ data }) => {
        this.$notify({
          title: '提交状态',
          message: `资产/镜头创建成功${data.create_asset.success_num}条、失败${data.create_asset.failure_num}条; 环节创建成功${data.create_link.success_num}条、失败${data.create_link.failure_num}条`,
          duration: 0,
          type:'warning'
        });
        this.$router.push({name:'project-detail',params:{id:this.$route.params.id}})
      });
    },
    //导入数据
    importAsset() {
      let data = {
        datas: this.testDataJSON,
        keysMap: this.keysMap,
        requiredKeysMap:this.requiredKeysMap
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
