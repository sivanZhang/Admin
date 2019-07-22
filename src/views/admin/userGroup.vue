<template>
  <div id="userGroup">
    <el-container>
      <el-header style="height:auto;padding:0">
        <el-radio-group v-model="radio" size="mini">
          <el-radio-button :label="1">所有用户</el-radio-button>

          <el-radio-button :label="2">未分组</el-radio-button>

          <el-radio-button :label="3">工种</el-radio-button>
        </el-radio-group>
      </el-header>

      <el-container>
        <transition name="el-zoom-in-center">
          <el-aside
            v-if="radio==3"
            width="240px"
            style="border-right:1px solid #ddd;padding: 0 5px; margin-right:20px"
          >
            <el-row type="flex" align="middle" class="nav-title">
              <el-col :span="8">用户组</el-col>

              <el-col :span="16" style="text-align:right">
                <el-button @click="openGroupForm('add')" type="info" size="mini">添加工种</el-button>
              </el-col>
            </el-row>

            <el-input size="mini" class="search-group" placeholder="输入关键字进行搜索" v-model="filterText"></el-input>

            <el-tree
              class="filter-tree"
              empty-text="未创建工种"
              highlight-current
              ref="tree"
              :data="TreeData"
              @node-click="handleGroupClick"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="searchGroup"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span style="margin-right:6px;">{{node.label}}</span>

                <span class="iconWarp">
                  <i
                    class="el-icon-plus"
                    @click="openGroupForm('add',data)"
                    style="color:#409EFF"
                    title="添加子工种"
                  ></i>

                  <i
                    class="el-icon-delete"
                    @click="removeGroup(data)"
                    style="color:#F56C6C"
                    title="删除当前工种"
                  ></i>
                </span>
              </span>
            </el-tree>
          </el-aside>
        </transition>

        <el-main>
          <div class="t-header">
            <el-row v-if="radio==3" type="flex" align="middle">
              <el-col :span="12">
                <el-button @click="openGroupForm('update')" type="primary" size="mini">修改工种信息</el-button>

                <el-button @click="openChangeMember(1)" type="primary" size="mini">添加成员</el-button>

                <el-button @click="openChangeMember(0)" type="danger" size="mini">删除成员</el-button>
              </el-col>

              <el-col :span="6">
                <label for>工种名称</label>

                ： {{ActiveGroup?ActiveGroup.name:'--'}}
              </el-col>

              <el-col :span="6">
                <label for>工种负责人</label>

                ：{{ActiveGroup?ActiveGroup.charger_name : '未指定'}}
              </el-col>
            </el-row>

            <el-row v-else type="flex" align="middle">
              <el-col :span="12">
                <el-button disabled type="primary" size="mini">添加用户</el-button>
              </el-col>
            </el-row>
          </div>

          <users-table :UserList="radio==3?GroupUsers:UserList"></users-table>
        </el-main>
      </el-container>
    </el-container>

    <!-- 添加用户组弹出框 -->

    <el-dialog :title="DialogType.title" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="GroupForm" ref="GroupForm" :rules="GroupRules">
        <el-form-item label="工种名" label-width="20%" prop="name">
          <el-input v-model.trim="GroupForm.name" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="负责人" label-width="20%" prop="chargerid">
          <el-select v-model="GroupForm.chargerid" placeholder="负责人" style="width:100%">
            <el-option
              v-for="(item,index) of UserList"
              :label="item.username"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>

        <el-button
          :loading="Loadings.addDeptLoading"
          type="primary"
          @click="DialogType.type==='add'?appendGroup():updateGroup()"
        >提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="MemberEditState['title']" :visible.sync="isMemberEditShow" width="460px">
      <el-select
        v-model="SelectMembers"
        multiple
        placeholder="请选择"
        style="width:100%"
        size="medium"
      >
        <el-option
          v-for="(item,index) of AllMembers"
          :label="item.username"
          :value="item.id"
          :key="index"
        ></el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isMemberEditShow = false">取 消</el-button>

        <el-button
          :loading="Loadings.memberEditLoading"
          :type="MemberEditState.type?'primary':'danger'"
          @click="changeMember"
        >{{MemberEditState.type?'添 加':'删 除'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getDept,
  addDept,
  putDept,
  removeDept
} from "@/api/admin";

import usersTable from "@/components/UsersTable";

import { mapState } from "vuex";

export default {
  name: "userGroup",

  components: {
    usersTable
  },

  data() {
    return {
      SelectMembers: [],

      AllMembers: [],

      MemberEditState: {},

      isMemberEditShow: false,

      radio: 1,

      GroupUsers: [],

      filterText: "",

      DialogType: {},

      ActiveGroup: null,

      TreeData: [],

      defaultProps: {
        children: "children",

        label: "name"
      },

      GroupForm: {},

      dialogFormVisible: false,

      GroupRules: {
        name: [
          {
            required: true,

            trigger: "blur",

            message: "工种名称未填写"
          }
        ],

        chargerid: [
          {
            required: true,

            trigger: "blur",

            message: "工种负责人未选择"
          }
        ]
      },

      Loadings: {
        addDeptLoading: false,

        memberEditLoading: false
      }
    };
  },

  computed: {
    classObject: function() {
      return {
        active: this.isActive && !this.error
      };
    },

    ...mapState({
      UserList: state => state.admin.UserList
    })
  },

  methods: {
    openChangeMember(type = 0) {
      this.SelectMembers = [];

      if (type) {
        this.MemberEditState = Object.assign(
          {},
          {
            type,

            title: "添加成员"
          }
        );

        this.AllMembers = Object.assign({}, this.UserList);
      } else {
        this.MemberEditState = Object.assign(
          {},
          {
            type,

            title: "删除成员"
          }
        );

        this.AllMembers = Object.assign({}, this.GroupUsers);
      }

      this.isMemberEditShow = true;
    },

    async changeMember() {
      if (!this.SelectMembers.length) {
        this.$message.warning("未选择用户");

        return;
      }

      let data = {
        id: this.ActiveGroup.id,

        method: "put"
      };

      if (this.MemberEditState.type) {
        data = {
          ...data,

          add_user_ids: this.SelectMembers.join()
        };
      } else {
        data = {
          ...data,

          del_user_ids: this.SelectMembers.join()
        };
      }

      this.Loadings.memberEditLoading = true;

      await putDept(data)
        .then(({ data }) => {
          this.Loadings.memberEditLoading = false;

          if (data.status === 0) {
            this.$message.success(data.msg);

            //成功后刷新该组成员

            this.handleGroupClick(this.ActiveGroup);
          } else {
            this.$message.error(data.msg);
          }
        })

        .catch(() => {
          this.Loadings.memberEditLoading = false;
        });

      this.isMemberEditShow = false;
    },

    //打开“用户组”弹窗

    openGroupForm(type, node = null) {
      if (type === "add") {
        if (node) {
          this.DialogType = Object.assign(
            {},
            {
              title: "添加子工种",

              type
            }
          );

          this.GroupForm = Object.assign(
            {},
            {
              parentid: node.id
            }
          );
        } else {
          this.DialogType = Object.assign(
            {},
            {
              title: "添加工种",

              type
            }
          );

          this.GroupForm = {};
        }
      } else if (type === "update") {
        this.DialogType = Object.assign(
          {},
          {
            title: "修改工种信息",

            type
          }
        );

        this.GroupForm = Object.assign(
          {},
          {
            id: this.ActiveGroup.id,

            method: "put",

            name: this.ActiveGroup.name,

            chargerid: this.ActiveGroup.charger_id
          }
        );
      }

      this.dialogFormVisible = true;
    },

    //http获取“用户组”列表

    getDeptList() {
      getDept().then(({ data }) => {
        this.TreeData = [...data.msg];
      });
    },

    /**
  
       *
  
       *点击用户组事件
  
       * @param data 当前点击激活的组
  
       *
  
       */

    handleGroupClick(data) {
      this.ActiveGroup = { ...data };

      getDept({
        id: data.id
      }).then(({ data }) => {
        this.GroupUsers = [...data.users];
      });
    },

    appendGroup() {
      //验证表单

      this.$refs["GroupForm"].validate(async valid => {
        if (valid) {
          this.Loadings.addDeptLoading = true;

          await addDept(this.GroupForm)
            .then(({ data }) => {
              this.Loadings.addDeptLoading = false;

              if (data.status === 0) {
                this.$message.success(data.msg);

                this.getDeptList();
              } else {
                this.$message.error(data.msg);
              }
            })

            .catch(() => {
              this.Loadings.addDeptLoading = false;
            });

          this.dialogFormVisible = false;
        }
      });
    },

    updateGroup() {
      //验证表单

      this.$refs["GroupForm"].validate(async valid => {
        if (valid) {
          this.Loadings.addDeptLoading = true;

          await putDept(this.GroupForm)
            .then(({ data }) => {
              this.Loadings.addDeptLoading = false;

              if (data.status === 0) {
                this.$message.success(data.msg);

                this.getDeptList();
              } else {
                this.$message.error(data.msg);
              }
            })

            .catch(() => {
              this.Loadings.addDeptLoading = false;
            });

          this.dialogFormVisible = false;
        }
      });
    },

    removeGroup(data) {
      this.$confirm("此操作将永久删除该工种?", "注意", {
        confirmButtonText: "删除",

        cancelButtonText: "取消",

        type: "warning"
      }).then(() => {
        removeDept({
          id: data.id,

          method: "delete"
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);

            this.getDeptList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    searchGroup(value, data) {
      if (!value) return true;

      return data.name.indexOf(value) !== -1;
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },

    radio(val) {
      switch (val) {
        case 1:
          this.$store.dispatch("admin/get_UserList");

          break;

        case 2:
          break;

        case 3:
          if (!this.ActiveGroup) {
            //如果没有激活的组，则自动选择第一个根组

            let level1Arr = this.TreeData.filter(item => item.level == 1);

            this.ActiveGroup = level1Arr[0];

            this.handleGroupClick(this.ActiveGroup);
          }

          break;
      }
    }
  },

  created() {
    this.$store.dispatch("admin/get_UserList");

    this.getDeptList();
  }
};
</script>

<style lang="scss" scoped src="./userGroup.scss">
</style>