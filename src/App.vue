<template>
  <div id="app" class="el-scrollbar__wrap">
    <router-view />
    <el-backtop target=".el-scrollbar__wrap" />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
