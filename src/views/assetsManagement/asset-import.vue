<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-download" type="success" @click="importAsset" class="pan-btn green-btn" size="mini">导入资产</el-button>
            <el-button icon="el-icon-download" type="success" @click="getAsset" class="pan-btn green-btn" size="mini">获取当前表格数据</el-button>

    </div>
    <div>
      <import-table-template ref="tableTemplate" @returnAssemblingData="returnAssemblingData"></import-table-template>
    </div>
    

  
  </div>
</template>

<script>
import * as HTTP from "@/api/assets";

import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import { Loading } from 'element-ui';
import ImportTableTemplate from '@/views/components/importTableTemplate';

export default {
  neme: "asset-import",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, 'production')
    return {
     
      keysMap:{
         "category":"资产类别",
          "image":"缩略图",
          "path":"路径",
          "name":"资产名称",
          "creator":"创建者",
          "team":"资产当前属于哪个部门",
          "inner_version":"内部资产版本号",
          "outer_version":"外部资产版本号",
          "priority":"优先级（高中低）",
          "level":"资产的难度等级（简单、标准、难）",
          "project":"资产属于哪个项目",
          "session":"场次",
          "frame":"帧数",
          "episode":"集数",
          "links":"资产的制作环节",
          "content":"制作内容",
          "date_start":"开始日期",
          "date_end":"结束日期",
          "asset":"资产",
          "dept":"工种"
      },
      testDataJSON:[
        ["张三",12,"男","1991-12-23","数学","89","英语","98"],
        ["李四",12,"男","1991-12-23","数学","89","英语","98"],
        ["王五",12,"男","1991-12-23","数学","89","英语","98"],
        ["赵六",12,"男","1991-12-23","数学","89","英语","98"],
        ["称其",12,"男","1991-12-23","数学","89","英语","98"],
        ["霍元甲",112,"男","1991-12-23","数学","99","英语","100"],
      ],
      
    };
  },
  components: { ImportTableTemplate},

  computed: {
   },
  methods: {
    changeHandlerRadio(value){
      if(this.hasBindKey.indexOf(value)<0){
        let label=this.tableCols[this.selectCurrentCol.index].label;
        this.tableCols[this.selectCurrentCol.index].label=label.split(",")[0]+","+this.keysMap[value];
        this.tableCols[this.selectCurrentCol.index].name=value;
        this.hasBindKey[this.selectCurrentCol.index]=value;
        this.dialogVisible=false;
      }else{
        this.$message.error('改字段已有绑定过')
      }
    },
    
    //获得编辑后的数据
    getAsset(){
      this.$refs.tableTemplate.getAssemblingData()
    },
    /**
     * 获取表格组装好的数据
     * 组件中必须 @returnAssemblingData="returnAssemblingData"
     */
    returnAssemblingData(data){
      console.log("组装好的数据-------",data);
            //此处接入ajax

    },
    //导入数据
    importAsset(){
        //此处接入Ajax
        let _self=this;
         _self.$refs.tableTemplate.openLoading("数据导入中")
        setTimeout(() => {
          let data={};
          data.datas=_self.testDataJSON;
          data.keysMap=_self.keysMap;
          _self.$refs.tableTemplate.initData(data)
         
          
        }, 1000);
     },
      
      
    
  }
   
   
};
</script>
<style lang="scss" scoped>
</style>
