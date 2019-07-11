<template>
  <div id="userGroup">
    <el-container>
      <el-aside width="210px" style="border-right:1px solid #ddd;padding: 0 5px;">
        <div class="tag-nav">Users</div>
        <div class="tag-nav">Ungrouped users</div>
        <el-row type="flex" align="middle" class="nav-title">
          <el-col :span="8">用户组</el-col>
          <el-col :span="16" style="text-align:right">
            <el-button @click="append('root')" type="info" size="small">添加用户组</el-button>
          </el-col>
        </el-row>
        <el-input v-model="nodeLable" placeholder="组名" style="margin-bottom:30px;"/>
        <el-tree
          empty-text="为创建分组"
          highlight-current
          ref="tree"
          :data="TreeData"
          @node-click="handleNodeClick"
          :props="defaultProps"
          class="filter-tree"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="margin-right:10px;">{{node.label}}</span>
            <span class="iconWarp">
              <el-button size="mini" type="text" icon="el-icon-plus" @click="append(data)"></el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="remove(node, data)"></el-button>
            </span>
          </span>
        </el-tree>
      </el-aside>
      <el-container>
        <el-main style="margin:17px 0 0;">
          <div class="t-header">
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
            <el-table-column prop="email" label="邮箱" align="center"/>
            <el-table-column prop="phone" label="电话" align="center"/>
            <el-table-column prop="name" label="角色" align="center"/>
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
    <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>
    <!-- 添加用户组弹出框 -->
    <el-dialog title="添加用户组" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="form">
        <el-form-item label="组名" label-width="80px">
          <el-input v-model="form.name" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="负责人" label-width="80px">
          <el-select v-model="form.chargerid" placeholder="负责人" style="width:300px">
            <el-option v-for="(item,index) of tableData" :label="item.username" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="append()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getDept, addDept } from "@/api/settings";
export default {
  name: "Dashboard",
  data() {
    return {
      nodeLable: "",
      NodeData: null,
      tableData: [],
      title: "title",
      componentId: "",
      filterText: "",
      TreeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      form:{},
      dialogFormVisible:false
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
        this.TreeData = [...data.msg];
      });
    },
    //点击用户组  返回点击的用户组的 data 和 node 并让输入框的值= 点击的用户组名
    handleNodeClick(data, node) {
      console.log([...arguments]);
      this.NodeData = [data, node];
      this.nodeLable = data.label;
    },
    //添加用户组
    append(node) {
      
      let data;
      if (node) {
        data = {
          name: node.username,
          chargerid: node.chargerid,
          parentid: node.charger_id
        };
      } else {
        data = {
          name: node.username,
          chargerid: node.chargerid,
        };
      }
      dialogFormVisible = false
      addDept(data).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.getDeptList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    remove(node, data) {
      let l1 = this.$loading();
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      window.setTimeout(() => {
        l1.close();
      }, 3000);
    }
  },

  created() {
    this.getUsers();
    this.getDeptList();
  }
};
</script>

<style lang="scss" scoped src="./userGroup.scss"></style>