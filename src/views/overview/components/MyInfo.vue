<template>
  <el-card shadow="always">
    <el-row slot="header" type="flex" justify="space-between" align="middle">
      <span>我的信息</span>
    </el-row>
    <div class="card-item">
      <div class="labels">
        <el-avatar size="small">{{userInfo.username | avatarFormat}}</el-avatar>
      </div>
      <div class="content">
        {{userInfo.username}}
        <svg-icon :icon-class="userInfo.sex && userInfo.sex==='男'?'nanxing':'nvxing'" />
      </div>
    </div>
    <div class="card-item">
      <div class="labels">邮 箱</div>
      <div class="content">{{userInfo.email}}</div>
    </div>
    <div class="card-item">
      <div class="labels">角 色</div>
      <div class="content">{{userInfo.role.role}}</div>
    </div>
    <div class="card-item">
      <div class="labels">工 种</div>
      <div class="content">
        <router-link
          class="dept-link"
          v-for="(item,index) of userInfo.dept"
          :key="index"
          :to="{path:'/admin/userGroup',query:{id:item.id}}"
        >{{item.name}}</router-link>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: {
    ...mapState("login", ["userInfo"]),
  },
};
</script>
<style lang="scss" scoped>
.card-item {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}
.labels {
    vertical-align: middle;
    color: #909399;
    width: 60px;
    flex: 0 0 40px;
  }
</style>