<template>
  <el-dialog title="新建项目" :visible.sync="isShow" width="762px">
    <el-form
      :model="ProjectForm"
      :rules="rules"
      ref="projectForm"
      label-width="100px"
      class="demo-ProjectForm"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ProjectForm.name"></el-input>
      </el-form-item>
      <el-form-item label="项目编码" prop="code">
        <el-input v-model="ProjectForm.code"></el-input>
      </el-form-item>
      <el-form-item label="工作流" prop="region">
        <el-select v-model="ProjectForm.status" placeholder="请选择活动区域">
          <el-option label="草稿" :value="0"></el-option>
          <el-option label="激活" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目日期" required>
        <el-col :span="11">
          <el-form-item prop="start">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ProjectForm.start"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="end">
            <el-time-picker placeholder="选择时间" v-model="ProjectForm.end" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "CreateProject",
  data() {
    return {
      ProjectForm: {},
      rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        code:[{ required: true, message: "请输入项目编码", trigger: "blur" }],
      }
    };
  },
  props: {
    //传ishow控制是否显示状态
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
      cancel(){
          
      },
      submitForm(){

      }
  }
};
</script>

<style>
</style>
