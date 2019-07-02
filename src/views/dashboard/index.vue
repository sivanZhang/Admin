<template>
  <div class="dashboard-container">
    <el-tabs tab-position="left" v-model="tab">
      <el-tab-pane label="Users">
        <div class="tab-page"></div>
      </el-tab-pane>
      <el-tab-pane label="Ungrouped users">
        <div class="tab-page"></div>
      </el-tab-pane>
    </el-tabs>
    <el-button @click="guan">
      点我
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      tab:''
    }
  },
  computed: {},
  methods:{
    guan(){
      this.tab = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container{
  
}
</style>
