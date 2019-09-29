<!-- 属性 -->
<template>
  <div id="attrs">
      <el-table
          ref="attrsList"
          :data="attrsList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          :cell-style="{borderRight:0}"
          highlight-current-row
          v-loading="tableLoading"
          :border="false"
        >
          <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
          <el-table-column label="属性名" prop="name"></el-table-column>
          <el-table-column label="属性类型" prop="type">
            <template slot-scope="scope">{{scope.row.type|attrsFilter}}</template>
          </el-table-column>
          <el-table-column label="属性值" prop="value"></el-table-column>
          <el-table-column label="默认值" prop="default"></el-table-column>
          <el-table-column label="操作">
              <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <el-button icon="el-icon-edit" style="color:green" type="text" ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button icon="el-icon-delete" style="color:red" type="text"></el-button>
              </el-tooltip>

          </el-table-column>
        </el-table>
        <div class="block" style="text-align: center;margin-top:10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="attrsList.length"
        ></el-pagination>
        </div>
      
      
  </div>
</template>

<script>
export default {
  name: "attrs",
  components: {},
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
    };
  },
  props:["attrsList","tableLoading"],
  watch: {},
  methods: {
       //分页
    handleSizeChange(val) {
      this.pageSize = val;
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>