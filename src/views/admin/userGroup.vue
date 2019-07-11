<template>
  <div id="userGroup">
    <el-container>
      <el-aside width="210px" style="border-right:1px solid #ddd;padding: 0 5px;">
        <div class="tag-nav">Users</div>
        <div class="tag-nav">Ungrouped users</div>
        <el-row type="flex" align="middle" class="nav-title">
          <el-col :span="8">用户组</el-col>
          <el-col :span="16" style="text-align:right">
            <el-button @click="openUserGroupForm('add')" type="info" size="small">添加部门</el-button>
          </el-col>
        </el-row>
        <!-- <el-input v-model="nodeLable" placeholder="部门名称" style="margin-bottom:30px;" /> -->
        <el-tree empty-text="未创建部门" highlight-current ref="tree" :data="TreeData" @node-click="handleNodeClick" :props="defaultProps" class="filter-tree" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="margin-right:6px;">{{node.label}}</span>
            <span class="iconWarp">
              <i class="el-icon-plus" @click="openUserGroupForm('add',data)" style="color:#67C23A" title="添加子部门"></i>
              <i class="el-icon-delete" @click="remove(data)" style="color:#F56C6C" title="删除当前部门"></i>
            </span>
          </span>
        </el-tree>
      </el-aside>
      <el-container>
        <el-main style="margin:17px 0 0;">
          <div class="t-header">
            <el-row type="flex" align="middle">
              <el-col :span="12">
                <el-button @click="openUserGroupForm('update')" type="primary" size="small">修改部门信息</el-button>
                <el-button type="primary" size="small">添加成员</el-button>
                <el-button type="danger" size="small">删除成员</el-button>
              </el-col>
              <el-col :span="6">
                <label for="">部门名称</label>： {{ClickedData?ClickedData.name:'--'}}
              </el-col>
              <el-col :span="6">
                <label for="">部门负责人</label>：{{ClickedData?ClickedData.charger_name : '未指定'}}
              </el-col>
            </el-row>
          </div>
          <el-table :data="UserList" stripe style="width: 100%" border>
            <el-table-column label="头像" width="100" align="center">
              <template slot-scope="scope">
                <el-avatar size="small">{{scope.row.username | avatarFormat}}</el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名称" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="phone" label="电话" align="center" />
            <el-table-column label="是否启用" align="center" width="100">
              <template slot-scope="scope">
                <!-- <el-checkbox v-model="scope.row.is_active" disabled></el-checkbox> -->
                <i v-if="scope.row.is_active" class="el-icon-check"></i>
                <i v-else class="el-icon-close"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip content="用户权限" placement="top">
                  <el-button icon="el-icon-user" type="text" />
                </el-tooltip>
                <el-tooltip content="编辑用户" placement="top">
                  <el-button icon="el-icon-edit" type="text" />
                </el-tooltip>
                <el-tooltip content="删除用户" placement="top">
                  <el-button icon="el-icon-delete" type="text" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <!-- 添加用户组弹出框 -->
    <el-dialog :title="DialogType.title" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="GroupForm" ref="GroupForm" :rules="GroupRules">
        <el-form-item label="部门名" label-width="20%" prop="name">
          <el-input v-model.trim="GroupForm.name" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="负责人" label-width="20%" prop="chargerid">
          <el-select v-model="GroupForm.chargerid" placeholder="负责人" style="width:100%">
            <el-option v-for="(item,index) of UserList" :label="item.username" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="Loadings.addDeptLoading" type="primary" @click="DialogType.type==='add'?append():updateGroup()">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getUserList, getDept, addDept, putDept, removeDept } from "@/api/admin";
  export default {
    name: "userGroup",
    data() {
      return {
        DialogType: {},
        ClickedData: null,
        UserList: [],
        TreeData: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        GroupForm: {},
        dialogFormVisible: false,
        GroupRules: {
          name: [
            { required: true, trigger: "blur", message: "部门名称未填写" },
          ],
          chargerid: [
            { required: true, trigger: "blur", message: "部门名称未选择" },
          ]
        },
        Loadings: {
          addDeptLoading: false,
        }
      };
    },
    methods: {
      openUserGroupForm(type, node = null) {
        if (type === 'add') {
          if (node) {
            this.DialogType = Object.assign({}, {
              title: '添加子部门',
              type
            })
            this.GroupForm = Object.assign({}, {
              parentid: node.id
            })
          } else {
            this.DialogType = Object.assign({}, {
              title: '添加部门',
              type
            })
            this.GroupForm = {}
          }
        } else if (type === 'update') {
          this.DialogType = Object.assign({}, {
            title: '修改部门信息',
            type
          })
          this.GroupForm = Object.assign({}, {
            parentid: this.ClickedData.parentid,
            method: 'put',
            name: this.ClickedData.name,
            chargerid:this.ClickedData.charger_id
          })
        }

        this.dialogFormVisible = true
      },
      //Http请求获取用户列表
      getUsers() {
        getUserList().then(({ data }) => {
          this.UserList = [...data];
        });
      },
      //Http请求,获取用户组列表
      getDeptList() {
        getDept().then(({ data }) => {
          this.TreeData = [...data.msg];
        });
      },
      //点击用户组  返回点击的用户组的 data 和 node 并让输入框的值= 点击的用户组名
      handleNodeClick(data, node) {
        console.log(data)
        this.ClickedData = { ...data }
      },
      //添加用户组
      append() {
        //验证表单，如果通过则触发http请求
        this.$refs['GroupForm'].validate(async (valid) => {
          if (valid) {
            this.Loadings.addDeptLoading = true
            await addDept(this.GroupForm).then(({ data }) => {
              this.Loadings.addDeptLoading = false
              if (data.status === 0) {
                this.$message.success(data.msg)
                this.getDeptList();
              } else {
                this.$message.error(data.msg)
              }
            }).catch(() => {
              this.Loadings.addDeptLoading = false
            })
            this.dialogFormVisible = false
          }
        })
      },
      updateGroup() {
        //验证表单，如果通过则触发http请求
        this.$refs['GroupForm'].validate(async (valid) => {
          if (valid) {
            this.Loadings.addDeptLoading = true
            await putDept(this.GroupForm).then(({ data }) => {
              this.Loadings.addDeptLoading = false
              if (data.status === 0) {
                this.$message.success(data.msg)
                this.getDeptList();
              } else {
                this.$message.error(data.msg)
              }
            }).catch(() => {
              this.Loadings.addDeptLoading = false
            })
            this.dialogFormVisible = false
          }
        })
      },
      remove(data) {

        this.$confirm('此操作将永久删除该部门?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeDept({
            id: data.id,
            method: 'delete'
          }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg)
              this.getDeptList();
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },

    created() {
      this.getUsers();
      this.getDeptList();
    }
  };
</script>

<style lang="scss" scoped src="./userGroup.scss"></style>