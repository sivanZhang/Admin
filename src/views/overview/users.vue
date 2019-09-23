<template>
  <div id="users-overview">
    <users-table :UserList="UserList"></users-table>
  </div>
</template>

<script>
import usersTable from "@/views/components/UsersTable";
import { mapState } from "vuex";
export default {
  name: "users",
  components: {
    usersTable
  },
  computed: {
    ...mapState('admin',['UserList'])
  },
  created() {
    !this.UserList && (this.$store.dispatch("admin/get_UserList"));
  }
};
</script>

<style lang="scss">
#users-overview {
  padding: 20px;
}
</style>