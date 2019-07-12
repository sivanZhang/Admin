<template>
  <div>
    <users-table :UserList="UserList"></users-table>
  </div>
</template>

<script>
  import usersTable from "@/components/UsersTable"
  import { mapState } from 'vuex'
  export default {
    name: 'users',
    components: {
      usersTable
    },
    computed: {
      ...mapState({
        UserList: state => state.admin.UserList
      })
    },
    created(){
        this.$store.dispatch('admin/get_UserList')
    }
  }
</script>

<style lang="scss">
</style>