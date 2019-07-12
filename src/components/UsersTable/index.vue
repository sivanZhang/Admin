<template>
  <div>
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
  </div>
</template>

<script>
  export default {
    name: "UsersTable",
    props: {
      UserList: {
        type: Array
      }
    }
  }
</script>

<style>

</style>