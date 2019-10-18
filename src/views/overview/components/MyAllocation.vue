<template>
  <el-card>
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="sceneNeed.length" :hidden="!sceneNeed.length" :max="99" class="item">
        <span style="padding-right: 10px;">待分配镜头</span>
      </el-badge>
      <el-button @click="$router.push({name:'team-manager'})" type="text">查看更多</el-button>
    </el-row>
    <el-table :data="sceneNeed">
        <el-table-column label="镜头号" prop="name" show-overflow-tooltip class-name="links">
        <template slot-scope="scope">
          <span @click="showDrawer(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" class-name="links" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      
    </el-table>
  </el-card>
</template>

<script>
import { allocationScene } from "@/api/assets";
export default {
  data() {
    return {
      sceneNeed: []
    };
  },
  created() {
    this.getScene();
  },
  methods: {
    getScene() {
      allocationScene().then(({ data }) => {
        this.sceneNeed = [...data.need];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>