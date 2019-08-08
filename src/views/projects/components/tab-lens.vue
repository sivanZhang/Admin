<template>
  <div id="lens-list">
    <el-table
      style="width: 100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
    >
      <el-table-column label="序号"></el-table-column>
      <el-table-column label="集数"></el-table-column>
      <el-table-column label="缩略图"></el-table-column>
      <el-table-column label="镜头号"></el-table-column>
      <el-table-column label="帧数"></el-table-column>
      <el-table-column label="制作内容"></el-table-column>
      <el-table-column label="当前环节"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="等级"></el-table-column>
      <el-table-column label="内部通过日期"></el-table-column>
      <el-table-column label="客户通过日期"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "lens-list",
  data() {
    return {};
  },
  components: {},
  methods: {}
};
</script>

<style>
</style>
