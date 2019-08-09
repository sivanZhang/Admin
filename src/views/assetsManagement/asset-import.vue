<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-plus" type="primary" @click="importAsset">导入资产</el-button>
    </div>
     
  </div>
</template>

<script>
import * as HTTP from "@/api/assets";

import { mapState } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  neme: "asset-list",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, 'production')
    return {
      
    };
  },

  computed: {
   },
  methods: {
    importAsset(){
        this.$message.error('待接入')
     }
    
  },
  components: {
    
  },
   
};
</script>
<style lang="scss" scoped>
</style>
