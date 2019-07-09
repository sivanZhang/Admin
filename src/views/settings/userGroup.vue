<template>
  <div id="userGroup">
    <el-container>
      <el-aside
        width="210px"
        style="border-right:1px solid #ddd;padding: 0 5px;margin-right:-17px; z-index:10001"
      >
        <div class="tag-nav">Users</div>
        <div class="tag-nav">Ungrouped users</div>
        <el-row type="flex" align="middle" class="nav-title">
          <el-col :span="8">用户组</el-col>
          <el-col :span="16" style="text-align:right">
            <el-button @click="addRoot" type="info" size="small">添加用户组</el-button>
          </el-col>
        </el-row>
        <el-input v-model="nodeLable" placeholder="组名" style="margin-bottom:30px;"/>
        <el-tree
          highlight-current
          ref="tree2"
          :data="TreeData"
          @node-click="handleNodeClick"
          :props="defaultProps"
          class="filter-tree"
          default-expand-all
          :expand-on-click-node="false"
        />
      </el-aside>
      <el-container>
        <el-main style="margin:15px;">
          <div class="t-header">
            <el-button @click="append" type="success" size="small">添加子用户组</el-button>
            <el-button type="primary" size="small">添加成员</el-button>
            <el-button type="danger" size="small">删除成员</el-button>
          </div>
          <el-table :data="tableData" stripe style="width: 100%" border>
            <el-table-column label="头像" width="100" align="center">
              <template slot-scope="scope">
                <el-avatar size="small">{{scope.row.username | avatarFormat}}</el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名称" align="center"/>
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="phone" label="电话" align="center"/>
            <el-table-column prop="name" label="角色" align="center" />
            <el-table-column label="是否启用" align="center" width="100">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.is_active" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip content="用户权限" placement="top">
                  <el-button icon="el-icon-user" type="text"/>
                </el-tooltip>
                <el-tooltip content="编辑用户" placement="top">
                  <el-button icon="el-icon-edit" type="text"/>
                </el-tooltip>
                <el-tooltip content="删除用户" placement="top">
                  <el-button icon="el-icon-delete" type="text"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getUserList, getDept } from "@/api/settings";
export default {
  name: "Dashboard",
  data() {
    return {
      nodeLable: "",
      NodeData: null,
      tableData: [{ name: "sss" }],
      title: "title",
      componentId: "",
      filterText: "",
      TreeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    //Http请求获取用户列表
    getUsers() {
      getUserList().then(({ data }) => {
        this.tableData = [...data] || [];
      });
    },
    getDeptList() {
      getDept().then(({ data }) => {
        this.tableData = [...data.msg] || [];
      });
    },
    //点击用户组  返回点击的用户组的 data 和 node 并让输入框的值= 点击的用户组名
    handleNodeClick(data, node) {
      this.NodeData = [data, node];
      this.nodeLable = data.label;
    },
    //添加根组
    addRoot() {
      if (!this.nodeLable) {
        this.$message.warning("请先输入用户组名");
        return;
      }
      this.TreeData.push({
        label: this.nodeLable
      });
    },
    //添加子组
    append() {
      if (this.NodeData[1].level === 4) {
        this.$message.warning("您只能有4层嵌套组");
        return;
      }
      if (!this.nodeLable) {
        this.$message.warning("请先输入组名");
        return;
      }
      const newChild = { label: this.nodeLable, children: [], id: id++ };
      if (!this.NodeData[0].childNodes) {
        this.$set(this.NodeData[0], "children", []);
      }
      this.NodeData[0].children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    }
  },

  created() {
    this.getUsers();
  }
};
</script>

<style lang="scss" scoped src="./userGroup.scss"></style>