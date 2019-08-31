<template>
  <div id="config-project">
    <el-tabs
      tab-position="left"
      style="height: ;overflow: auto;"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="项目详情" name="first" style="height: auto;overflow: auto;">
        <div style="width:50%">
          <el-row>
            <el-col :span="6" class="comment">缩略图</el-col>
            <el-col :span="15" class="comment">
              <el-image
                class="mini-image"
                :src="project.image?$store.state.BASE_URL+project.image:''"
                fit="cover"
                style="width:60%;height:60%"
              ></el-image>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">项目名称</el-col>
            <el-col :span="15" class="comment">{{project.name}}</el-col>
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
            <el-col :span="15" class="comment">¥{{project.budget|numberFormat}}万元</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">负责人</el-col>
            <el-col :span="15" class="comment">{{project.charger_name}}</el-col>
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
      </el-tab-pane>
      <el-tab-pane label="参与工种" name="second" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width:50%;padding:5px ">
            <div style="display:flex">
              <h4>工种列表</h4>
              <el-button type="primary" style="margin: 0 10px" @click="addJoinDept">批量添加</el-button>
            </div>
            <el-tree
              class="filter-tree"
              show-checkbox
              empty-text="未创建工种"
              highlight-current
              ref="tree"
              :data="DeptList"
              node-key="id"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
            ></el-tree>
          </div>
          <div style="width:50%;border-left:2px soild #999999;padding:5px ">
            <div style="display:flex">
              <h4>当前项目参与的工种列表</h4>
              <el-button type="danger" style="margin: 0 10px" @click="delJoinDept">批量删除</el-button>
            </div>
            <el-tree
              class="filter-tree"
              empty-text="未绑定工种"
              show-checkbox
              highlight-current
              ref="jointree"
              :data="project.depts"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
            ></el-tree>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="状态配置" name="third" @click="getStatus" style="height:auto;overflow:auto;">
        <div style="display:flex">
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">状态列表</h4>
            <div class="box">
               <el-row>
                <div class="maxstatus-name">暂停：</div>
              </el-row>
              <el-row v-for="(item,index) of pauseStatus" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                 <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                  <span @click="addStatus(item.id)">
                    <i class="el-icon-plus" ></i>
                  </span>
                 </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">未开始：</div>
              </el-row>
              <el-row v-for="(item,index) of notstartStatus" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                  <span @click="addStatus(item.id)">
                    <i class="el-icon-plus" ></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">进行中：</div>
              </el-row>
              <el-row v-for="(item,index) of conductingStatus" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                  <span @click="addStatus(item.id)">
                    <i class="el-icon-plus" ></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">审核中：</div>
              </el-row>
              <el-row v-for="(item,index) of approvingStatus" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                  <span @click="addStatus(item.id)">
                    <i class="el-icon-plus" ></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              
              <el-row>
                <div class="maxstatus-name">完成：</div>
              </el-row>
              <el-row v-for="(item,index) of finishStatus" :key="index" class="minstatus-name">
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                  <span @click="addStatus(item.id)">
                    <i class="el-icon-plus" ></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              
             
            </div>
          </div>
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">当前项目拥有状态</h4>
            <div class="box">
                <el-row>
                <div class="maxstatus-name">暂停：</div>
              </el-row>
              <el-row
                v-for="(item,index) of projectStatus.pause"
                :key="index"
                class="minstatus-name"
              >
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                  <span @click="delStatus(item.id)">
                    <i class="el-icon-minus" style="color:red"></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">未开始：</div>
              </el-row>
              <el-row
                v-for="(item,index) of projectStatus.notstart"
                :key="index"
                class="minstatus-name"
              >
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                  <span @click="delStatus(item.id)">
                    <i class="el-icon-minus" style="color:red"></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">进行中：</div>
              </el-row>
              <el-row
                v-for="(item,index) of projectStatus.conducting"
                :key="index"
                class="minstatus-name"
              >
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                  <span @click="delStatus(item.id)">
                    <i class="el-icon-minus" style="color:red"></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">审核中：</div>
              </el-row>
              <el-row
                v-for="(item,index) of projectStatus.approving"
                :key="index"
                class="minstatus-name"
              >
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                  <span @click="delStatus(item.id)">
                    <i class="el-icon-minus" style="color:red"></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              
              <el-row>
                <div class="maxstatus-name">完成：</div>
              </el-row>
              <el-row
                v-for="(item,index) of projectStatus.finish"
                :key="index"
                class="minstatus-name"
              >
                <el-col :span="12">{{item.name}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                  <span @click="delStatus(item.id)">
                    <i class="el-icon-minus" style="color:red"></i>
                  </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              
            
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectProfession } from "@/api/project";
import {
  getAllMaxStatus,
  getAllMinStatus,
  getProjectStatus,
  addProjectStatus,
  delProjectMinStatus
} from "@/api/status";

export default {
  name: "config-project",
  props: ["project"],
  components: {},
  data() {
    return {
      activeName: "first",
      defaultProps: {
        children: "children",

        label: "name"
      },
      allMaxStatus: null,
      approvingStatus: null,
      conductingStatus: null,
      finishStatus: null,
      notstartStatus: null,
      pauseStatus: null,
      projectStatus: {
        approving: null,
        conducting: null,
        finish: null,
        notstart: null,
        pause: null
      },
      show: true,
      showid: null
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "third") {
          this.getStatus();
          this.getPeojectAllStatus();
        }
      }
    }
  },
  computed: {
    ...mapState("admin", ["DeptList"])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //获取工种信息
    getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },
    //给项目添加参与的工种
    addJoinDept() {
      const add_depts_ids = this.$refs.tree
        .getCheckedNodes()
        .map(item => item.id)
        .join(",");
      console.log(add_depts_ids);

      projectProfession({
        method: "put",
        id: this.project.id,
        add_depts_ids: add_depts_ids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$refs.tree.setCheckedKeys([]);
        }
      });
    },
    //给项目删除参与的工种
    delJoinDept() {
      const del_depts_ids = this.$refs.jointree
        .getCheckedNodes()
        .map(item => item.id)
        .join(",");
      //   console.log(del_depts_ids);
      projectProfession({
        method: "put",
        id: this.project.id,
        del_dept_ids: del_depts_ids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$refs.tree.setCheckedKeys([]);
        }
      });
    },
    //获取状态信息
    getStatus() {
      //获取所有大状态
      getAllMaxStatus().then(({ data }) => {
        this.allMaxStatus = [...data.msg];
      });
      //获取所有小状态
      getAllMinStatus().then(({ data }) => {
        //大状态审批中的小状态
        this.approvingStatus = [...data.approving];
        //大状态进行中的小状态
        this.conductingStatus = [...data.conducting];
        //大状态完成中的小状态
        this.finishStatus = [...data.finish];
        //大状态未开始中的小状态
        this.notstartStatus = [...data.notstart];
        //大状态暂停中的小状态
        this.pauseStatus = [...data.pause];
      });
    },
    getPeojectAllStatus() {
      //获取当前项目的状态
      getProjectStatus({ project_id: this.project.id }).then(({ data }) => {
        this.projectStatus = data;
        // //大状态审批中的小状态
        // this.projectStatus.approvingStatus = [...data.approving];
        // //大状态进行中的小状态
        // this.projectStatus.conductingStatus = [...data.conducting];
        // //大状态完成中的小状态
        // this.projectStatus.finishStatus = [...data.finish];
        // //大状态未开始中的小状态
        // this.projectStatus.notstartStatus = [...data.notstart];
        // //大状态暂停中的小状态
        // this.projectStatus.pauseStatus = [...data.pause];
      });
    },
    //给项目添加小状态
    addStatus(id) {
      addProjectStatus({
        project_id: this.project.id,
        state_branch_list: [id]
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) this.getPeojectAllStatus();
      });
      //
    },
    //给项目删除小状态
    delStatus(id) {
      delProjectMinStatus({
        method: "delete",
        project_id: this.project.id,
        state_branch_list: [id]
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(
            data.delete[0].state_branch_name + "状态已移除"
          );
          this.getPeojectAllStatus();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#config-project {
  .comment {
    padding: 5px 10px;
    font-size: 12px;
  }
  .box {
    overflow: auto;
    border: 1px solid #E8EAEC;
    margin: 0 10px;
  }
  .maxstatus-name {
    width: 100%;
    background-color: #EEF1F6;
    height: 30px;
    font-weight: 600;
    font-display: center;
    padding:5px;
    border-bottom: 1px solid rgb(234, 232, 236);
  }
  .minstatus-name {
    border-bottom: 1px solid #E8EAEC;
    height:25px;
    width: 100%;
    padding:5px;
    font-display: center;
    cursor: pointer;
  }
  .col {
    padding-right: 5px;
  }
}
</style>
<style lang="scss">
.el-checkbox__inner {
  margin-right: 10px;
}
</style>
