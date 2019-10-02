<template>
  <div id="time-management">
    <el-button>
      <router-link :to="{name:'date-import'}">导入节假日</router-link>
    </el-button>
  </div>
</template>

<script>
import { getDates } from "@/api/admin";
export default {
  name: "time-management"
};
</script>

<style lang="scss" scoped>
#time-management {
}
</style>