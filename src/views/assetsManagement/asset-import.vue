<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-download" type="success" @click="importAsset" class="pan-btn green-btn" size="mini">导入资产</el-button>
            <el-button icon="el-icon-download" type="success" @click="getAsset" class="pan-btn green-btn" size="mini">获取当前表格数据</el-button>

    </div>
    <div v-loading="tableLoading"
        :element-loading-text="tableLoadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
         


      <el-table
        :data="tableData"
        border
        @cell-dblclick="dblhandleCurrentChange"
        style="width: 100%;height:100%">
        
         <template v-for="(col ,index) in tableCols">
                <el-table-column
                 v-if="col.type==='normal'" 
                 :index="index" 
                 v-bind:key="index" 
                 :prop="col.prop" 
                 :label="col.label" 
                 :render-header="renderHeader" 
                 align="center" width="120">
                  <template scope="scope">
                    <el-input
                      v-if="scope.row.isEdit"
                      size="small"
                      v-model="scope.row[col.prop]"
                      placeholder="请输入内容"
                      v-on:blur="inputblur"
                    >

                    </el-input>
                    <span v-if="!scope.row.isEdit">{{scope.row[col.prop]}}</span>
                  </template>
                </el-table-column>
                 <el-table-column v-if="col.type==='array'" v-bind:key="index"  :label="col.label" :render-header="renderHeader" align="center" >
                   <template v-for="(labelLabel ,labelLabelIndex) in col.labels">
                    <el-table-column
                      v-bind:key="labelLabelIndex"
                      :prop="labelLabel.prop"
                      :label="labelLabel.label"
                      width="120"
                      align="center">
                      <template scope="scope">
                        <el-input
                          v-if="scope.row.isEdit"
                          size="small"
                          v-model="scope.row[labelLabel.prop]"
                          placeholder="请输入内容"
                          v-on:blur="inputblur"
                        >

                        </el-input>
                        <span v-if="!scope.row.isEdit">{{scope.row[labelLabel.prop]}}</span>
                      </template>
                    </el-table-column>
                   </template>
                </el-table-column>
                 
            </template>
      </el-table>
    </div>

    <el-dialog
      :title="'字段绑定['+selectCurrentCol.label+']'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        
          <el-menu  class="el-menu-demo" mode="horizontal"  >
            <el-submenu index="2">
              <template slot="title">选择事件</template>
              <el-menu-item index="2-2" @click="cancelMapping">取消映射</el-menu-item>
              <el-submenu index="2-4">
                <template slot="title">必须字段<span style="color:red"> * </span></template>
                <el-radio-group v-model="selectKey" @change="changeHandlerRadio">

                  <el-menu-item  v-for="(key,index) in dealKeys" v-bind:key="index" :name="key">
                    <el-radio :label="key">{{keysMap[key]}}</el-radio>
                  </el-menu-item>
                </el-radio-group>

              </el-submenu>
             
            </el-submenu>
            
          </el-menu>
      </div>
      
    </el-dialog>
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
      dialogVisible: false,
      tableLoading:false,
      tableLoadingText:"",
      selectKey:null,
      selectCurrentCol:{label:''},
      hasBindKey:[],
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
              },
              {
                "content": "名字1",
                "date_start": "2019/12/09",
                "date_end": "2019/12/09",
                "asset": "aaa",
                "dept": "合成"
              }
            ],
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
            "18",
            [
              {
                "content": "名字1",
                "date_start": "2019/12/09",
                "date_end": "2019/12/09",
                "asset": "aaa",
                "dept": "合成"
              },{
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
      dealDatas:null,
      dealKeys:null,
      generalKeyIndex:0,//普通key的结束点下标
      arrayKeyIndex:0,//普通key的结束点下标
      tableCols: [
      ],
      tableData: [
            
      ],
      letterIndex:0,
    };
  },

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
    //取消绑定
    cancelMapping(){
        let label=this.tableCols[this.selectCurrentCol.index].label;
        this.tableCols[this.selectCurrentCol.index].label=label.split(",")[0]+",未映射字段";
        this.tableCols[this.selectCurrentCol.index].name='';
        this.hasBindKey[this.selectCurrentCol.index]='';
        this.dialogVisible=false;
    },

    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    //自定义表头样式
    renderHeader(h,{column}){
      let _self=this;
      let a= column.label.split(",")[0];
      let b= column.label.split(",")[1];
      console.log(h)
      return h(
          'div',{
              style:'cursor:pointer;',
              on:{
               click:function(){
                 console.log(_self.tableCols[column.index]);
                 if(_self.tableCols[column.index]){
                  _self.selectCurrentCol=column;
                  _self.dialogVisible=true;
                  _self.selectKey="";
                 }
                
               }
              },
          },
          
          [ 
            h('p',{
              style:'height:17px;'
            },a),
            h('p',{
              style:'height:30px;'
            },b)
          ],
        );
    },
    dblhandleCurrentChange(row, column, cell, event){
      row.isEdit = true;
    },
    inputblur(row, event, column) {
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.isEdit = false;
     
      });
    },
    //获得编辑后的数据
    getAsset(){
      console.log(this.tableData,this.tableCols)
      //此处接入ajax
    },
    //导入数据
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
                this.generalKeyIndex=j+1;

            }
            if("object"===typeof(this.dealDatas[i][j])){
              this.arrayKeyIndex=j+1;
            }
          }
        }
        //开始组装头
        this.tableCols.length=0;
        //label: "A,未映射字段", prop: "node", type: "normal" 
        for(let i=0;i<this.generalKeyIndex;i++){
          this.letterIndex=65+i;
          let label={
            label: String.fromCharCode(65+i)+",未映射字段", 
            prop: "node"+i, 
            name:"",
            type: "normal" 
          }
          this.tableCols.push(label);
        }
        for(let i=this.generalKeyIndex;i<this.arrayKeyIndex;i++){
          for(let j=0;j<this.dealDatas[0][i].length;j++){
            let label={
              label: String.fromCharCode( this.letterIndex+j+1)+",未映射字段"+this.dealDatas[0][i][j][0],
              type: "array" ,
            }
            let index=0;
            for(let key in this.dealDatas[0][i][j]){
              if(index==0){
                label.label=this.keysMap[key];
              }
              index++;
            }
            label.labels=new Array();
            let current=0;
            for(let key in this.dealDatas[0][i][j]){
              let labelLabel={
                label: this.keysMap[key], 
                name:key,
                prop: "node"+ this.letterIndex+j+(current++), 
                type: "normal" 
              }
              label.labels.push(labelLabel);
            }
            this.tableCols.push(label);

          }
        }
       // this.hasBindKey.length=this.tableCols.length;
        //开始组装数据
         this.getTableData();
     },
     /**
      * 组装数据
      */
     getTableData(){
       this.tableData.length=0;
       for(let i=0;i<this.dealDatas.length;i++){
         let data={};
         //普通数据
          for(let j=0;j<this.generalKeyIndex;j++){
            data["node"+j]=this.dealDatas[i][j]
          }
          //数组数据
          for(let j=this.generalKeyIndex;j<this.arrayKeyIndex;j++){
            /**
             * 第几个数据
             */
            for(let k=0;k<this.dealDatas[i][j].length;k++){
              let object=this.dealDatas[i][j][k];
              let current=0;
               for(let key in object){
                data["node"+this.letterIndex+k+(current++)]=object[key]

              }
            }
          }
          data.isEdit=false;
         this.tableData.push(data);
       } 
     }
      
    
  },
  components: {
    
  },
   
};
</script>
<style lang="scss" scoped>
</style>
