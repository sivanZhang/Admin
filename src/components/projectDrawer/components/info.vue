<template>
  <div id="info">
    <!-- 项目消息栏 -->
    <template v-if="project && project.entity_type === 4">
      <div>
        <el-row>
          <el-col :span="6" class="comment">项目名称</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit=true" @mouseleave="showEdit = false">
              <span v-if="!editing">{{project.name}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit"
                @click="edit(0)"
              ></i>
            </div>
            <div v-if="editing">
              <input type="text" ref="input" class="input" value="project.name" v-model="name" />
              <el-button @click="save(0)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目编码</el-col>
          <el-col :span="15" class="comment">{{project.code}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Windows路径</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit7=true" @mouseleave="showEdit7 = false">
              <span v-if="!editing7"> {{project.Windows?project.Windows:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit7"
                @click="edit(6)"
              ></i>
            </div>
            <div v-if="editing7">
              <input type="text" ref="input" class="input" v-model="windows" />
              <el-button @click="save(6)" type="primary">修改</el-button>
            </div>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Mac路径</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit8=true" @mouseleave="showEdit8 = false">
              <span v-if="!editing8"> {{project.Mac?project.Mac:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit8"
                @click="edit(7)"
              ></i>
            </div>
            <div v-if="editing8">
              <input type="text" ref="input" class="input"  v-model="mac" />
              <el-button @click="save(7)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Linux路径</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit9=true" @mouseleave="showEdit9 = false">
              <span v-if="!editing9"> {{project.Linux?project.Linux:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit9"
                @click="edit(8)"
              ></i>
            </div>
            <div v-if="editing9">
              <input type="text" ref="input" class="input"  v-model="linux" />
              <el-button @click="save(8)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目预算</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit2=true" @mouseleave="showEdit2 = false">
              <span v-if="!editing2">¥{{project.budget|numberFormat}}万元</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit2"
                @click="edit(1)"
              ></i>
            </div>
            <div v-if="editing2">
              ¥
              <input type="text" ref="input" class="input" value="project.budget" v-model="budget" />万元
              <el-button @click="save(1)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="comment">负责人</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit3=true" @mouseleave="showEdit3 = false">
              <span v-if="!editing3">{{project.charger_name}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit3"
                @click="edit(2)"
              ></i>
            </div>
            <div v-if="editing3">
              <el-select v-model="charger" filterable placeholder="请选择负责人" ref="selete" @change="userChange">
                <el-option
                  v-for="item of UserList"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
              <el-button @click="save(2)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">工作流</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit6=true" @mouseleave="showEdit6 = false">
              <span v-if="!editing6">{{project.status|projectStatus}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit6"
                @click="edit(5)"
              ></i>
            </div>
            <div v-if="editing6">
              <el-select v-model="status" placeholder="请选择工作流" ref="selete">
                <el-option label="未开始" :value="0"></el-option>
                <el-option label="正在进行" :value="1"></el-option>
                <el-option label="已完成" :value="2"></el-option>
                <el-option label="超期" :value="3"></el-option>
                <el-option label="重启" :value="4"></el-option>
              </el-select>
              <el-button @click="save(5)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">开始日期</el-col>
          <el-col :span="15" class="comment">{{project.date_start|dateFormat}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">结束日期</el-col>
          <el-col :span="15" class="comment">{{project.date_end|dateFormat}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">客户信息</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit5=true" @mouseleave="showEdit5 = false">
              <span v-if="!editing5">{{project.client.client_name?project.client.client_name:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit5"
                @click="edit(4)"
              ></i>
            </div>
            <div v-if="editing5">
              <el-select v-model="client" placeholder="请选择" ref="selete" @change="clientChange">
                <el-option
                  v-for="item of clientList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button @click="save(4)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- 资产消息栏 -->
    <template v-if="project && project.entity_type === 5">
      <div >
        <el-row>
          <el-col :span="6" class="comment">名称</el-col>
          <el-col :span="18" class="comment">{{project.name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">类型</el-col>
          <el-col :span="18" class="comment">{{project.category>0?project.category:"未分类"}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">路径</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit4=true" @mouseleave="showEdit4 = false">
              <span v-if="!editing4">{{project.path?project.path:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit4"
                @click="edit(3)"
              ></i>
            </div>
            <div v-if="editing4">
              <input type="text" ref="input" class="input" value="project.path" v-model="path" />
              <el-button @click="save(3)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">创建人</el-col>
          <el-col :span="18" class="comment">{{project.creator_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">优先级</el-col>
          <el-col :span="18" class="comment">{{project.priority |Priority}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">难度等级</el-col>
          <el-col :span="18" class="comment">{{project.level |Level}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">帧数</el-col>
          <el-col :span="18" class="comment">{{project.frame}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">内部版本</el-col>
          <el-col :span="18" class="comment">{{project.inner_version}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">外部版本</el-col>
          <el-col :span="18" class="comment">{{project.outer_version}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">备注</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit10=true" @mouseleave="showEdit10 = false">
              <span v-if="!editing10" v-html="project.remark">
                
              </span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit10"
                @click="edit(9)"
              ></i>
            </div>
            
            <div v-if="editing10" style="display:flex">
              <el-input type="textarea" ref="input"   v-model="remark" />
              <el-button @click="save(9)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
import { putProjects } from "@/api/project";
import { getClientList } from "@/api/admin";
import { editAssets } from "@/api/assets";
import { mapState } from "vuex";
import { returnStatement } from '@babel/types';
import { constants } from 'crypto';
export default {
  props: ["project"],
  name: "info",
  data() {
    return {
      editing: false,
      editing2: false,
      editing3: false,
      editing4: false,
      editing5: false,
      editing6:false,
      editing7:false,
      editing8:false,
      editing9:false,
      editing10:false,
      name: null,
      budget: null,
      charger: null,
      charger_name:null,
      path: null,
      client: null,
      client_name:null,
      status:null,
      windows:null,
      mac: null,
      linux:null,
      remark:null,
      showEdit: false,
      showEdit2: false,
      showEdit3: false,
      showEdit4: false,
      showEdit5: false,
      showEdit6:false,
      showEdit7:false,
      showEdit8:false,
      showEdit9:false,
      showEdit10:false,
      clientList: null
    };
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  created() {
    
  },
  methods: {
    userChange(val){
      //console.log(val);
      this.charger_name=this.UserList.find(item=>{
        return item.id === val;
      }).username;
      //console.log(this.charger_name);
    },
    clientChange(val){
      this.client_name=this.clientList.find(item=>{
        return item.id === val;
      }).username;
      // console.log(this.client_name)
    },
    edit(Type) {
      if (Type === 0) {
        this.showEdit = false;
        this.editing = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 1) {
        this.showEdit2 = false;
        this.editing2 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 2) {
        this.showEdit3 = false;
        this.editing3 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 3) {
        this.showEdit4 = false;
        this.editing4 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 4) {
        this.showEdit5 = false;
        this.editing5 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
        getClientList().then(({ data }) => {
          this.clientList = [...data];
          // console.log(this.clientList);
        });
      }
      if (Type === 5) {
        this.showEdit6 = false;
        this.editing6 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 6) {
        this.showEdit7 = false;
        this.editing7 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 7) {
        this.showEdit8 = false;
        this.editing8 = true;
        
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 8) {
        this.showEdit9 = false;
        this.editing9 = true;
        
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 9) {
        this.showEdit10 = false;
        this.editing10 = true;
        
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
    save(Type) {
      let data = null;
      if (Type === 0) {
        this.editing = false;
        data = {
          method: "put",
          id: this.project.id,
          name: this.name
        };
      }
      if (Type === 1) {
        this.editing2 = false;
        data = {
          method: "put",
          id: this.project.id,
          budget: this.budget
        };
      }
      if (Type === 2) {
        this.editing3 = false;
        data = {
          method: "put",
          id: this.project.id,
          charger: this.charger
        };
      }
      if (Type === 3) {
        this.editing4 = false;
        data = {
          method: "put",
          id: this.project.id,
          path: this.path
        };
        editAssets(data).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.project.path = this.path;
            this.path = null;
          }
        });
        this.$emit("refresh_assetList");
      }
      if (Type === 4) {
        this.editing5 = false;
        data = {
          method: "put",
          id: this.project.id,
          client: this.client
        };
      }
      if (Type === 5) {
        this.editing6 = false;
        data = {
          method: "put",
          id: this.project.id,
          status: this.status
        };
      }
      if (Type === 6) {
        this.editing7 = false;
        data = {
          method: "put",
          id: this.project.id,
          windows_path: this.windows
        };
      }
      if (Type === 7) {
        this.editing8 = false;
        data = {
          method: "put",
          id: this.project.id,
          mac_path: this.mac
        };
      }
      if (Type === 8) {
        this.editing9 = false;
        data = {
          method: "put",
          id: this.project.id,
          linux_path: this.linux
        };
      }
      if (Type === 9) {
        this.editing10 = false;
        data = {
          method: "put",
          id: this.project.id,
          remark: this.remark
        };
        console.log(data.remark);
        console.log(data.remark.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;'));
        editAssets(data).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.project.remark = this.remark.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
            this.remark = null;
          }
        });
        this.$emit("refresh_assetList");
      }

      putProjects(data).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          if (Type === 0) {
            this.project.name = this.name;
            this.name = null;
          }
          if (Type === 1) {
            this.project.budget = this.budget;
            this.budget = null;
          }
          if (Type === 2) {
            this.project.charger_name = this.charger_name;
            this.charger = null;
          }
          if (Type === 4) {
            this.project.client.client_name = this.client_name;
            this.client = null;
          }
          if (Type === 5) {
            this.project.status = this.status;
            this.status = null;
          }
          if (Type === 6) {
            this.project.Windows = this.windows;
            this.windows = null;
          }
          if (Type === 7) {
            this.project.Mac = this.mac;
            this.mac = null;
          }
          if (Type === 8) {
            this.project.Linux = this.linux;
            this.linux = null;
          }
          
        }
      }).catch(({data})=>{
        thsi.$message.error(data.msg);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#info {
  .comment {
    padding: 5px 10px;
    font-size: 12px;
  }
  input {
    width: 100px;
    border: none;
    border-bottom: solid 2px deepskyblue;
  }
  input:focus {
    outline: none;
  }
}
</style>

