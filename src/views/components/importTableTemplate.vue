<template>
  <div class="import-table-template">
     <div  v-loading="tableLoading"
      :element-loading-text="tableLoadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-row>
            <el-button type="success" @click="mergeCell()">合并单元格</el-button>
            <el-button type="danger" @click="cancelCell()">取消合并</el-button>
        </el-row>
        <el-table
            :data="tableData"
            border
            @cell-dblclick="dblhandleCurrentChange"
            style="width: 100%;height:100%">
             <el-table-column
                v-if="isShowOptionBar"
                fixed="left"
                label="操作"
                width="100"
                
                align="center">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="danger"
                    size="small">
                    移除
                    </el-button>
                </template>
                </el-table-column>
             <template v-for="(col ,index) in tableCols">
                <el-table-column
                 v-if="col.type==='normal'" 
                 :index="index" 
                 v-bind:key="index" 
                 :prop="col.prop" 
                 :label="col.label" 
                 :render-header="renderHeader" 
                 align="center">
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
import { log } from 'util';
export default {
  name: 'ImportTableTemplate',
  data() {
    return {
      isShowOptionBar:false,
      dialogVisible: false,
      assemblingData:{},
      tableLoading:false,
      tableLoadingText:"",
      dealDatas:[],//原始数据
      keysMap:[],//映射字段
      dealKeys:[],//原始keys

      tableCols: [],//表格头
      tableData: [],//表格数据
      selectKey:null,
      selectCurrentCol:{label:''},//选中的当前列
      hasBindKey:[],//已经绑定key
    };
  },
  created(){
     
  },
  methods: {
    openLoading(msg){
        this.tableLoading=true;
        this.tableLoadingText=msg;
    },
    closeLoading(){
        this.tableLoading=false;
    },
    initData(data){
        this.tableData.length=0;
        this.tableLoading=true;
        this.tableLoadingText="数据组装中"
        this.dealDatas=data.datas;
        this.keysMap=data.keysMap;
        this.dealKeys.length=0;
        console.log('this.dealKeys:',this.dealKeys);
        for(let key in this.keysMap){
            this.dealKeys.push(key)
        }
        
        this.getTableHeader();
    },
    getAssemblingData(){
      this.assemblingData.values=[];
      /**
       * 已经绑定列的下下标
       */
      let tempKeyIndexs=[];
      let bindKeys=[];
      for(let i=0;i<this.hasBindKey.length;i++){
          if(this.hasBindKey[i]){
            bindKeys.push(this.hasBindKey[i]);
            tempKeyIndexs.push(i);
          }
      }
      let values=[];
      for(let i=0;i<this.tableData.length;i++){
          let value=[];
          let tableRowData=this.tableData[i];  
          for(let j=0;j<tempKeyIndexs.length;j++){
            value.push(tableRowData['node'+j])
          }
          values.push(value);
      }
      
      this.assemblingData.keys=bindKeys;
      this.assemblingData.values=values;
      this.$emit("returnAssemblingData",this.assemblingData)
    },
    /**
     * 组装表格头
     */
    getTableHeader(){
        this.tableCols.length=0;
        this.tableLoadingText="数据组装表头中"
        if(this.dealDatas.length>0){
            this.tableLoading=true;
            let firstData=this.dealDatas[0];
            for(let i=0;i<firstData.length;i++){
                this.letterIndex=65+i;
                let label={
                    label: String.fromCharCode(65+i)+",未映射字段", 
                    prop: "node"+i, 
                    name:"",
                    type: "normal" 
                }
                this.tableCols.push(label);
            }
            this.isShowOptionBar=true;
            //开始组装数据
            this.getTableData();
        }else{
            this.tableLoading=false;
            this.isShowOptionBar=false;

            this.$message.error('导入的数据是空数据')
        }
    },
     getTableData(){
       this.tableLoadingText="数据组装数据中"
       this.tableData.length=0;
       for(let i=0;i<this.dealDatas.length;i++){
         let data={};
         //普通数据
          for(let j=0;j<this.dealDatas[i].length;j++){
            data["node"+j]=this.dealDatas[i][j]
          }
          data.isEdit=false;
         this.tableData.push(data);
       } 
       this.tableLoading=false;

     },
    /**
     * 单击单元格选中事件
     */
    changeHandlerRadio(value){
      if(this.hasBindKey.indexOf(value)<0){
        console.log(this.selectCurrentCol);
        
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
    dblhandleCurrentChange(row, column, cell, event){
      row.isEdit = true;
    },
    inputblur(row, event, column) {
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.isEdit = false;
     
      });
    },
    /**
     * 格式化表头
     */
    renderHeader(h,{column}){
      let _self=this;
      let a= column.label.split(",")[0];
      let b= column.label.split(",")[1];
      console.log(h)
      return h(
          'div',{
              style:'cursor:pointer;',
          },[ 
            h('el-checkbox',{
                style:'display:inline-flex;margin-left:5px;',
                class:'1111',
                on:{
                    change: function($event, column){
                        console.log($event,column)
                    },
                }
            }),
            h('div',{

            },[
                h('p',{
                    style:'height:17px;',
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
                },a),
                h('p',{
                    style:'height:30px;',
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
                },b)
            ]),
          ],
        );
    },
    //对话框关闭
    handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
            done();
            })
            .catch(_ => {});
    },
    deleteRow(index,rows){
        console.log(rows);
        rows.splice(index, 1);
    },
    mergeCell(){
      this.$message.error('开发中');
      var inputs = document.getElementsByTagName("input");
        var boxs = [];
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox") {
                console.log(inputs[i].id)
                boxs.push(inputs[i])
            }
        }
       console.log(boxs)
    },
    cancelCell(){
      this.$message.error('开发中')

    }
  }
};
</script>
<style lang="scss" scoped>
  
</style>
