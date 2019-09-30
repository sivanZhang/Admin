<!-- 自定义属性 -->
<template>
  <div id="customAttrs">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="属性" name="tab0" lazy>
        <attrs :attrsList="attrsList" :tableLoading="tableLoading" @refresh-attrs="getAttrs"/>
      </el-tab-pane>
      <el-tab-pane label="属性实体" name="tab1" lazy>
        <attrsEntity :attrsEntityList="attrsEntityList" :tableLoading="tableLoading" @refresh-attrsEntity="getAttrsEntity"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as HTTP from "@/api/attrs";
import attrs from "./components/attrs";
import attrsEntity from "./components/attrsEntity"
export default {
  name: "customAttrs",
  components: { attrs,attrsEntity },
  data() {
    return {
      activeName: "tab0",
      attrsList: [],
      attrsEntityList:[],
      tableLoading: false
    };
  },
  watch: {},
  methods: {
    getAttrs() {
      this.tableLoading = true;
      HTTP.getAttrsList().then(({ data }) => {
        if (data.status === 0) {
          this.attrsList = [...data.msg];
          this.tableLoading = false;
        }
      });
    },
    getAttrsEntity(){
      HTTP.getAttrsEntityList().then(({data})=>{
        this.tableLoading = true;
        if(data.status === 0){
          this.attrsEntityList = [...data.msg];
          this.tableLoading = false;
        }
      })
    }

  },
  created() {
    this.getAttrs();
    this.getAttrsEntity()
  }
};
</script>
<style lang='scss' scoped>
</style>