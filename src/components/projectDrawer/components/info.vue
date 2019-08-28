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
              <i class="el-icon-edit" style="color:blue" v-if="$store.state.login.userInfo.auth.manage_project&&showEdit" @click="edit(0)"></i>
            </div>
           <div  v-if="editing">
              <input
              type="text"
              ref="input"        
              class="input"
              value="project.name"
              v-model="name"
              
            />
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
          <el-col :span="15" class="comment">{{project.Windows}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Mac路径</el-col>
          <el-col :span="15" class="comment">{{project.Mac}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Linux路径</el-col>
          <el-col :span="15" class="comment">{{project.Linux}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目预算</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit2=true" @mouseleave="showEdit2 = false">
              <span v-if="!editing2">¥{{project.budget|numberFormat}}万元</span>
              <i  class="el-icon-edit" style="color:blue" v-if="$store.state.login.userInfo.auth.manage_project&&showEdit2" @click="edit(1)"></i>
            </div>
            <div v-if="editing2">
              ¥
              <input
                type="text"
                ref="input"
                class="input"
                value="project.budget"
                v-model="budget"
                
              />万元
              <el-button @click="save(1)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="comment">负责人</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit3=true" @mouseleave="showEdit3 = false">
              <span v-if="!editing3">{{project.charger_name}}</span>
              <i class="el-icon-edit" style="color:blue" v-if="$store.state.login.userInfo.auth.manage_project&&showEdit3" @click="edit(2)"></i>
            </div>
            <div v-if="editing3">
              <el-select v-model="charger" filterable placeholder="请选择负责人" ref="selete">
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
          <el-col :span="15" class="comment">{{project.status|projectStatus}}</el-col>
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
          <el-col :span="15" class="comment">{{project.client.client_name}}</el-col>
        </el-row>
      </div>
    </template>
    <!-- 资产消息栏 -->
    <template v-if="project && project.entity_type === 5">
      <div>
        <el-row>
          <el-col :span="6" class="comment">资产名称</el-col>
          <el-col :span="15" class="comment">{{project.name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">资产类型</el-col>
          <el-col :span="15" class="comment">{{project.category>0?project.category:"未分类"}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">资产路径</el-col>
          <el-col :span="15" class="comment">
            <div @mouseover="showEdit4=true" @mouseleave="showEdit4 = false">
              <span v-if="!editing4"> {{project.path>0?project.path:"-"}}</span>
              <i class="el-icon-edit" style="color:blue" v-if="$store.state.login.userInfo.auth.manage_project&&showEdit4" @click="edit(3)"></i>
            </div>
           <div  v-if="editing4">
              <input
              type="text"
              ref="input"        
              class="input"
              value="project.path"
              v-model="path"
              
            />
            <el-button @click="save(3)" type="primary">修改</el-button>
           </div>
           
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">创建人</el-col>
          <el-col :span="15" class="comment">{{project.creator_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">优先级</el-col>
          <el-col :span="15" class="comment">{{project.priority |Priority}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">难度等级</el-col>
          <el-col :span="15" class="comment">{{project.level |Level}}</el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
import { putProjects } from "@/api/project";
import {getUsersRole} from "@/api/admin";
import {editAssets} from "@/api/assets"
import { mapState } from "vuex";
export default {
  props: ["project"],
  name: "info",
  data() {
    return {
      editing: false,
      editing2: false,
      editing3: false,
      editing4:false,
      name: null,
      budget: null,
      charger: null,
      path:null,
      showEdit: false,
      showEdit2: false,
      showEdit3: false,
      showEdit4:false
    };
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
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
    },
    save(Type, item) {
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
      if (Type === 2 ) {
        this.editing3 = false;
        data = {
          method: "put",
          id: this.project.id,
          charger: this.charger
        };
        
      }
      if (Type === 3 ) {
        this.editing4 = false;
        data = {
          method: "put",
          id: this.project.id,
          path: this.path
        };
        editAssets(data).then(({data})=>{
          this.$message.success(data.msg);
          if(data.status===0){
            this.project.path=this.path;
            this.path=null
          }
        })
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
            
            this.project.charger_name = username;
            this.charger = null;
          }
        }
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
>
</style>
