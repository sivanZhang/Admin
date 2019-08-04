<template>
  <div>
    <el-table
      :data="UserList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe style="width: 100%" border
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}">
      <el-table-column label="头像" width="100" align="center">
        <template slot-scope="scope">
          <el-avatar size="small">{{scope.row.username | avatarFormat}}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="姓名" align="left" />
      <el-table-column prop="sex" label="性别" align="left" width="50"/>
      <el-table-column prop="email" label="邮箱" align="left" />
      <el-table-column prop="phone" label="电话" align="left" />
      <el-table-column prop="dept" label="工种" align="left" />
      <el-table-column prop="role" label="职务/角色" align="left" />
      <el-table-column label="是否启用" align="center" width="100">
        <template slot-scope="scope">
          <!-- <el-checkbox v-model="scope.row.is_active" disabled></el-checkbox> -->
          <i v-if="scope.row.is_active" class="el-icon-check"></i>
          <i v-else class="el-icon-close"></i>
        </template>
      </el-table-column>
      <!--
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="用户权限" placement="top">
            <el-button icon="el-icon-user" type="text" style="color:deepskyblue" />
          </el-tooltip>
          <el-tooltip content="编辑用户" placement="top">
            <el-button icon="el-icon-edit" type="text" style="color:lawngreen" />
          </el-tooltip>
          <el-tooltip content="删除用户" placement="top">
            <el-button icon="el-icon-delete" type="text" style="color:red"  />
          </el-tooltip>
        </template>
      </el-table-column>
      -->
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :pagesize="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=UserList.length>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UsersTable",
    props: {
      UserList: {
        type: Array
      }
    },
    data(){
      return {
        currentPage:1,
        pageSize:10,
        pageSizeList:[10,20,50,100],
      }
    },
    methods:{
      //分页
      handleSizeChange(val) {
        this.pageSize=val;
        //console.log(this.pagesize);
      },
      handleCurrentChange(currentPage) {
        this.currentPage=currentPage;
        //console.log(this.currentPage);
      },
    }
  }
</script>

<style>

</style>
