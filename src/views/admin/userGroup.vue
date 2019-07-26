<template>
  <div id="userGroup">
    <el-container>
        <el-header style="padding:0px;margin: 0px">
          <el-radio-group v-model="radio" size="small">
            <el-radio-button :label="1">所有用户</el-radio-button>
            <el-radio-button :label="2">未分组</el-radio-button>
          </el-radio-group>
        </el-header>
        <el-main style="padding: 0px">
          <users-table :UserList="UserList" ></users-table>
        </el-main>

    </el-container>
  </div>
</template>

<script>

  import usersTable from "@/components/UsersTable";

  import {mapState} from "vuex";

  export default {
    name: "userGroup",

    components: {
      usersTable
    },

    data() {
      return {
        radio: 1,
      };
    },

    computed: {
      ...mapState('admin',['UserList'])
    },

    methods: {},

    watch: {
      radio(val) {
        switch (val) {
          case 1:
            this.$store.dispatch("admin/get_UserList");

            break;

          case 2:
            break;
        }
      }
    },

    created() {
      this.$store.dispatch("admin/get_UserList");
    }
  };
</script>

<style lang="scss" scoped src="./userGroup.scss">
</style>
