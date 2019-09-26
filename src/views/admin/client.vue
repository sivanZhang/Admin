<template>
  <div>
   <el-container>
     <el-aside
     width="300px"
     style="border-right:1px solid #ddd;padding: 0 5px; margin-right:20px"
     >
    <!-- <el-row type="flex" align="middle" class="nav-title">
       <el-button 
       type="primary"
       disabled

       @click="multybindClient()"
      >批量绑定</el-button>
    </el-row> -->
     <el-input style="margin-top:8px" class="search-group" placeholder="输入关键字进行搜索" v-model="clientdata" @change="getClient()"></el-input>
    <el-table 
    ref="multipleTable" 
    :data="DeptList" 
    highlight-current
    style="margin-top:8px"
    @selection-change="handleAddSelectionChange"
    :header-cell-style="{'font-size':'13px',background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column style="fontsize:13px" label="部门列表" prop="name">  </el-table-column>
      <el-table-column style="fontsize:13px" label="操作" align="center"> 
         <template slot-scope="scope">
           <el-button 
           type="primary"
           @click="bindClient(scope.row.id)"
           >绑定</el-button>
        </template>   
      </el-table-column>
    </el-table>
    </el-aside>
    <el-main>
      <h3> 绑定的部门有:</h3>
      <div>{{clientname}}</div>
    </el-main>
   </el-container>
  </div>
</template>
<script>
import { getDept,bindClientDept } from  "@/api/admin";
import { mapState } from "vuex";
export default {
  data(){
    return{
    addMultipleSelection:[],
    clientname:null,
    clientdata:null,
    };
  },
  computed:{
   ...mapState("admin", ["DeptList","DeptAuth"])
  },
  created(){
    this.getDeptList();
  },
  methods:{
     getClient(){
      if(this.clientdata){
        console.log(this.clientdata)
       this.DeptList.forEach((item,index)=>{
          if(item.name === this.clientdata) {
            console.log(item)
            this.DeptList[index] = item;
          } else{
            this.getDeptList();
          }
        });
        }},
    handleAddSelectionChange(val) {
      this.addMultipleSelection = val;
      // console.log(this.addMultipleSelection.length)
    },
    //http获取“用户组”列表
     getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },
    //批量绑定客户
     multybindClient(){
     const add_perm_ids = this.addMultipleSelection
        .map(item => item.id)
        .join(",");
       console.log(add_perm_ids)
       bindClientDept({client:add_perm_ids}).then(({ data })=>{
          this.$message.success(data.msg);
          if(data.status === 0) {
            getDept({ id:add_perm_ids}).then(({ data })=>{
              console.log(data.msg)
              this.clientname = data.msg.name;
            })
          }
       });
        this.getDeptList();
  },
  //绑定客户
    bindClient(id){
         bindClientDept({client:id}).then(({ data })=>{
          this.$message.success(data.msg);
          if(data.status === 0) {
            getDept({ id:id}).then(({ data })=>{
              console.log(data.msg)
              this.clientname = data.msg.name;
            })
          }
       });
        this.getDeptList();
    }
  },

};
</script>