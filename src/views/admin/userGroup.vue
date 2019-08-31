<template>
  <div id="userGroup">
    <el-container>
      <el-header style="padding:0px;margin: 0px">
        <el-row>
          <el-col :span="5" >
            <el-radio-group v-model="radio" style="padding-top:8px">
              <el-radio-button :label="1">所有用户</el-radio-button>
              <el-radio-button :label="2">未分组</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="19" align="top">
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
        <users-table :UserList="UserList"></users-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import usersTable from "@/components/UsersTable";
import { getUserList } from "@/api/admin";

export default {
  name: "userGroup",

  components: {
    usersTable
  },

  data() {
    return {
      radio: 1,
      filterText: "",
      UserList: null
    };
  },

  // computed: {
  //   ...mapState('admin',['UserList'])
  // },

  methods: {
    getAllUserlist() {
      getUserList().then(({ data }) => {
        this.UserList = [...data];
        //console.log(this.UserList)
      });
    },
    getNullDeptUser(){
      getUserList({deptid:null}).then(({data})=>{
        this.UserList=[...data]
      })
    }
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
