<template>
  <div>
      <el-button type="primary" @click="$router.push({name:'clockin-import'})">打卡记录上传</el-button>
  </div>
</template>

<script>
import {getClockRecord} from '@/api/notice'
export default {
 created() {
   getClockRecord()
 },
}
</script>

<style>

</style>