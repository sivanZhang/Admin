<template>
  <div id="notiec-info">
    {{userInfo}}
    <!--  -->
  </div>
</template>
<script>
import * as HTTP from "@/api/notice";
import { getUserPermission, getUserRole } from "@/api/login";
export default {
  name: "NoticeInfo",
  props: ["userInfo"],
  data() {
    return {
    };
  },

  methods: {
    
  }
};
</script>

<style scoped>

</style> 