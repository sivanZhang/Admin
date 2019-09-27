<template>
  <div id="bind">
    <el-tabs tab-position="left" style="height: ;overflow: auto;padding-top:10px">
      <el-tab-pane label="配置" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width:50%;padding:5px">
            <div style="display:flex">
              <el-form
                ref="saveForm"
                :label-position="labelPosition"
                label-width="80px"
                :model="saveForm"
                :rules="saveRules"
                class="save-form"
              >
                <el-form-item label="IP地址" prop="host">
                  <el-input
                    ref="host"
                    v-model="saveForm.host"
                    placeholder="IP地址"
                    name="host"
                    type="text"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                  <el-input
                    ref="port"
                    v-model="saveForm.port"
                    type="text"
                    placeholder="端口号"
                    name="port"
                    style="width:220px"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button :loading="loading" type="primary" @click="save">保存</el-button>
                  <el-button @click="resetForm('saveForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="width:50%;padding:5px">
            <div style="display:flex">
              <h4 style="margin: 0 10px;">已完成的配置</h4>
              <el-button type="primary" style="margin: 0 10px" @click="search">查询配置</el-button>
            </div>
            <div class="maxstatus-name">
            <el-row >
              <el-col :span="4">IP地址：</el-col>
              <el-col :span="20">{{host}} </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">端口地址：</el-col>
              <el-col :span="20">{{port}} </el-col>
            </el-row>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客户部门绑定" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">部门列表</h4>
            <div class="box">
              <el-row v-for="(item,index) in DeptList" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right">
                    <el-tooltip class="item" effect="dark" content="绑定" placement="top">
                    <span @click="bindClient(item.id)">
                      <i class="el-icon-circle-check"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">当前绑定的客户</h4>
            <div class="maxstatus-name">
              <div>{{clientname}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="外包部门绑定" style="height: auto;overflow: auto;">
             <div style="display:flex">
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">部门列表</h4>
            <div class="box">
              <el-row v-for="(item,index) in DeptList" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right">
                    <el-tooltip class="item" effect="dark" content="绑定" placement="top">
                    <span @click="bindList(item.id)">
                      <i class="el-icon-circle-check"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">绑定的外包部门</h4>
            <div class="maxstatus-name">
              <div>{{listname}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getDept, bindClientDept, bindIP, searchIP } from "@/api/admin";
import { mapState } from "vuex";
export default {
  data() {
    return {
      clientname: null,
      listname:null,
      labelPosition: "right",
      saveForm: {},
      host:null,
      port:null,
      saveRules: {
        host: [
          {
            required: true,
            trigger: "blur",
            message: "请输入IP地址"
          }
        ],
        port: [
          {
            required: true,
            trigger: "blur",
            message: "请输入端口号"
          }
        ]
      },
      loading: false
    };
  },
  computed: {
    ...mapState("admin", ["DeptList", "DeptAuth"])
  },
  created() {
    this.getDeptList();
  },
  methods: {
    //ip和端口绑定
    save() {
      this.loading = true;
      bindIP(this.saveForm).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
        } 
        this.loading = false;
        this.$refs['saveForm'].resetFields();
      });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    search(){
      searchIP().then(({ data })=>{
          this.host = data.host;
          this.port = data.port;
        
      })
    },
    //http获取“用户组”列表
    getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },
    //绑定客户部门
    bindClient(id) {
      bindClientDept({ client: id }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          getDept({ id: id }).then(({ data }) => {
            this.clientname = data.msg.name;
          });
        }
      });
    },
    //外包部门绑定
     bindList(id) {
      bindClientDept({ client: id }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          getDept({ id: id }).then(({ data }) => {
            this.listname = data.msg.name;
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
#bind {
  .box {
    overflow: auto;
    margin: 0 10px;
  }
  .minstatus-name {
    width: 300px;
    height: 30px;
    font-display: center;
    padding-top:10px;
    cursor: pointer;
    border-bottom: 1px solid #e8eaec;
  }
   .maxstatus-name {
    height: 25px;
    width: 100%;
    padding: 5px;
    font-display: center;
   }
}
</style>