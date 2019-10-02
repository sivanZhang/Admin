<!-- 素材库 -->
<template>
  <div id="material">
    {{materialList}}
  </div>
</template>

<script>
import {getMaterial,addMaterial,delMaterial,putMaterial} from "@/api/material"
export default {
  name: "material",
  components: {},
  data() {
    return {
      materialList:[]
    };
  },
  watch: {},
  methods: {
    searchMaterial(){
      getMaterial().then(({data})=>{
        if(data.status === 0){
          this.materialList = [...data.msg]
        }
      })
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>