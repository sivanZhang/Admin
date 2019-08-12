<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-download" type="success" @click="importAsset" class="pan-btn green-btn" size="mini">导入资产</el-button>
    </div>
    <div v-loading="tableLoading"
        :element-loading-text="tableLoadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table
        
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column label="配送信息">
          <el-table-column
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column label="地址">
            <el-table-column
              prop="province"
              label="省份"
              width="120">
            </el-table-column>
            <el-table-column
              prop="city"
              label="市区"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址" >
            </el-table-column>
            <el-table-column
              prop="zip"
              label="邮编"
              width="120">
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as HTTP from "@/api/assets";

import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import { Loading } from 'element-ui';

export default {
  neme: "asset-list",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, 'production')
    return {
      tableLoading:false,
      tableLoadingText:"",
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
      testData:{
        "keys": [
          "category",
          "image",
          "path",
          "name",
          "creator",
          "team",
          "inner_version",
          "outer_version",
          "priority",
          "level",
          "project",
          "session",
          "frame",
          "episode",
          "links",
          "content",
          "date_start",
          "date_end",
          "asset",
          "dept"
        ],
        "values": [
          [
            "4",
            "a",
            "aa",
            "资产1",
            "1",
            "3",
            "inner_version",
            "outer_version",
            "0",
            "1",
            "",
            "1",
            "5",
            "22",
            [
              {
                "content": "名字1",
                "date_start": "2019/12/09",
                "date_end": "2019/12/09",
                "asset": "aaa",
                "dept": "合成"
              }
            ]
          ],
          [
            "",
            "b",
            "bb",
            "资产2",
            "5",
            "",
            "",
            "",
            "1",
            "2",
            "",
            "11",
            "25",
            "",
            [
              {
                "content": "名字1",
                "date_start": "2019/12/09",
                "date_end": "2019/12/09",
                "asset": "aaa",
                "dept": "合成"
              }
            ]
          ],
          [
            "",
            "c",
            "cc",
            "资产3",
            "9",
            "",
            "",
            "",
            "0",
            "3",
            "",
            "12",
            "35",
            "",
            [
              {
                "content": "名字3",
                "date_start": "2019/12/09",
                "date_end": "2019/12/09",
                "asset": "aaa",
                "dept": "合成"
              },
              {
                "content": "名字4",
                "date_start": "2019/12/09",
                "date_end": "2019/12/09",
                "asset": "aaa",
                "dept": "动画"
              }
            ]
          ]
        ]
      },
      tableLabel:null,
      dealDatas:null,
      dealKeys:null,
      generalKeyIndex:0,//普通key的结束点下标
      tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
    };
  },

  computed: {
   },
  methods: {
    importAsset(){
        //this.$message.error('待接入');
        this.tableLoading=true;
        this.tableLoadingText="数据导入中"
        //此处接入Ajax
        let _self=this;
        setTimeout(() => {
          _self.tableLoadingText="数据组装中";
          _self.tableLoading=false;
          _self.dealKeys=_self.testData.keys;
          _self.dealDatas=_self.testData.values;
          _self.getTableHeader();
          
        }, 1000);
     },
     /**
      * 组装表格头
      */
     getTableHeader(){
       for(let i=0;i<this.dealDatas.length;i++){
          for(let j=0;j<this.dealDatas[i].length;j++){
            if("string"===typeof(this.dealDatas[i][j])){
            }
            if(i==0){
              if("object"===typeof(this.dealDatas[i][j])){
                this.generalKeyIndex=(j-1);
              }
            }
          }
        }

        //开始组装头
        for(let i=0;i<this.generalKeyIndex;i++){
          console.log(this.dealKeys[i])
        }
        
     }
      
    
  },
  components: {
    
  },
   
};
</script>
<style lang="scss" scoped>
</style>
