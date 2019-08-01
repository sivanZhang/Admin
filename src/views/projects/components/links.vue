<template>
  <div id="links">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-plus" type="primary" @click="showLinksForm">添加环节</el-button>
    </div>
    <el-table
      ref="assetTable"
      :data="LinkList"
      style="width: 100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
    >
      <el-table-column type="index" :index="indexMethod" label="序号" align="center" width="65px"></el-table-column>
      <el-table-column prop="content" label="环节内容" align="left"></el-table-column>
      <el-table-column prop="charger_name" label="委托人" align="left"></el-table-column>

      <el-table-column prop="top_dept_name" label="工种" align="left"></el-table-column>
      <el-table-column label="难度等级" align="center">
        <template slot-scope="scope">{{scope.row.level|levelFilter}}</template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加环节" :visible.sync="isDrawerShow" width="526px" center :modal='false'>
      <el-form :model="LinkForm" :rules="rules" ref="linkForm" label-width="120px">
        <el-form-item label="环节内容" prop="name">
          <el-input v-model="LinkForm.content"></el-input>
        </el-form-item>
        <el-form-item label="存放路径" prop="path">
          <el-input v-model="LinkForm.path"></el-input>
        </el-form-item>
        <el-form-item label="难度等级" prop="level">
          <el-select v-model="LinkForm.level" placeholder="请选择难度等级">
            <el-option
              v-for="item of LevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产类别" prop="category">
          <el-input v-model="LinkForm.category"></el-input>
        </el-form-item>
        <el-form-item label="内部资产版本号" prop="inner_version">
          <el-input v-model="LinkForm['inner_version']"></el-input>
        </el-form-item>
        <el-form-item label="外部资产版本号" prop="outer_version">
          <el-input v-model="LinkForm['outer_version']"></el-input>
        </el-form-item>
        <el-form-item label="关联任务" prop="task">
          <el-input v-model="LinkForm.task"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="createLoading" type="primary" @click="addAsset">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "links",
  data() {
    return {
      isDrawerShow: false,
      rules: {
        content: [{ required: true, message: "请输入环节内容", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入难度等级", trigger: "blur" }],
        path: [{ required: true, message: "请输入路径", trigger: "blur" }]
      },
      LinkForm: {},
      createLoading: false
    };
  },
  filters: {
    levelFilter(key) {
      switch (key) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "复杂";
          break;
        case 3:
          return "高难度";
          break;
      }
    }
  },
  props: ["LevelList", "LinkList","assetId"],
  methods: {
    showLinksForm() {
      this.isDrawerShow = true;
    },
    cancel() {
      this.isDrawerShow = false;
    },
    addAsset() {

    }
  }
};
</script>

<style lang="scss" scoped>
</style>

