<template>
  <div id="userGroup">
    <el-container>
      <el-header style="padding:0px;margin: 0px">
        <el-row>
          <el-col :span="5">
            <el-radio-group v-model="radio" style="padding-top:8px">
              <el-radio-button :label="1">所有用户</el-radio-button>
              <el-radio-button :label="2">未分组</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="10" align="top" style="padding-top:8px">
            <el-button
              type="primary"
              @click="openDialog(1)"
              v-if="perssion"
            >添加用户</el-button>
            <el-button icon="el-icon-upload2" type="success" @click="openDialog(2)" v-if="perssion" :disabled="true">
              <slot name="import">用户导入</slot>
            </el-button>
           <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delMulUsers()"
            :disabled="this.multipleSelection.length === 0"
          >批量删除</el-button> 
          </el-col>
          <el-col :span="9" align="top">
            <span>
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </span>
            <el-input
              placeholder="输入关键字搜索"
              style="width:200px;"
              v-model="filterText"
              class="input-with-select"
            ></el-input>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="padding: 0px">
        <users-table :UserList="UserList" :perssion="perssion" @refresh="getAllUserlist" @selection="handleSelectionChange"></users-table>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogShow" :title="dialogName" width="400px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="userForm"
        :rules="rules"
        ref="userForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" @input="change($event)">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex" style="padding-top:8px">
            <el-radio-button :label="0">男</el-radio-button>
            <el-radio-button :label="1">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码(默认)" prop="password">
          <el-input v-model="userForm.password" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isactive">
          <el-switch v-model="userForm.isactive"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addUser">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import usersTable from "@/components/UsersTable";
import { getUserList, getUserPerfession, deleteUser } from "@/api/admin";
import { addUser } from "@/api/login";
export default {
  name: "userGroup",

  components: {
    usersTable
  },

  data() {
    return {
      radio: 1,
      filterText: "",
      UserList: null,
      dialogShow: false,
      dialogName: null,
      perssion:null,
      userForm: {
        password: "123456",
        isactive: true
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
      },
      buttonStates: {
        createLoading: false
      },
      multipleSelection: []
    };
  },

  // computed: {
  //   ...mapState('admin',['UserList'])
  // },

  methods: {
    change() {
      this.$forceUpdate();
    },
    getAllUserlist() {
      getUserList().then(({ data }) => {
        this.UserList = [...data];
        // console.log(this.UserList)
      });
      getUserPerfession().then(({data})=>{
        this.perssion = data.auth.admin_management;
        //console.log(this.perssion)
      })
    },
    getNullDeptUser() {
      getUserList({ deptid: null }).then(({ data }) => {
        this.UserList = [...data];
      });
    },
    openDialog(Type) {
      if (Type === 1) {
        this.dialogName = "添加用户";
        this.dialogShow = true;
      } else {
        this.$router.push({
          name: "user-import"
        });
      }
    },
   //批量删除用户
    delMulUsers(){
      this.$confirm("此操作将永久删除用户,是否继续?","提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
          deleteUser({ ids:ids,method:"delete "}).then(({ data }) => {
           console.log(data.msg)
           if (data.status === 0){
             this.$emit("refresh");
             this.$message.success(data.msg);
           } else {
            this.$message.error(data.msg);
          }
         });
      })
    },
    addUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          if(this.userForm.sex === 0){
            this.userForm={
              ...this.userForm,
              sex : "男"}
            }else{
              this.userForm={
              ...this.userForm,
              sex : "女"
              }
            }
          
          addUser(this.userForm).then(({ data }) => {
            if (data.status === 0) {
              this.createLoading = false;
              this.$message.success(data.msg);
              this.dialogShow = false;
              this.getAllUserlist()
            } else {
              this.createLoading = false;
              this.$message.error(data.msg);
              this.dialogShow = false;
            }
          });
        }else{
          return false
        }
      });
    },
    cancel() {
      this.dialogShow = false;
      this.$refs["userForm"].resetFields();
      this.userForm = {
        password: "123456",
        isactive: true
      };
    },
     handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },

  watch: {
    radio(val) {
      switch (val) {
        case 1:
          // this.$store.dispatch("admin/get_UserList");
          this.getAllUserlist();
          break;

        case 2:
          this.getNullDeptUser();
          break;
      }
    },
    filterText: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          //this.$store.dispatch("admin/get_UserList",newVal);
          getUserList({ username: newVal }).then(({ data }) => {
            this.UserList = [...data];
          });
        } else {
          this.getAllUserlist();
        }
      }
    }
  },

  created() {
    // this.$store.dispatch("admin/get_UserList");
    this.getAllUserlist();
  }
};
</script>

<style lang="scss" scoped src="./userGroup.scss">
</style>
