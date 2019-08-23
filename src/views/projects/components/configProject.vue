<template>
  <div id="config-project">
    <el-tabs
      tab-position="left"
      style="height: 500px;overflow: auto;"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="项目详情" name="first">
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
      </el-tab-pane>
      <el-tab-pane label="工种管理" name="second">
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
      <el-tab-pane label="配置管理" name="third">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectProfession } from "@/api/project";
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
      }
    };
  },
  watch: {},
  computed: {
    ...mapState("admin", ["DeptList"])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },

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
    }
  },
  
};
</script>

<style lang="scss" scoped>
#config-project {
  .comment {
    padding: 5px 10px;
    font-size: 12px;
  }
}
</style>
