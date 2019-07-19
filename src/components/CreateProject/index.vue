<template>
  <el-dialog title="新建项目" :visible.sync="isShow" width="526px">
    <el-form
      :model="ProjectForm"
      :rules="rules"
      ref="projectForm"
      label-width="100px"
      class="demo-ProjectForm"
    >
      <el-form-item label="图片" prop="color">
        <el-upload
          class="avatar-uploader"
          action="/projects/projects/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePreview"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
        >
          <img v-if="ProjectForm.image" :src="ProjectForm.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="颜色" prop="color">
        <el-color-picker v-model="ProjectForm.color" show-alpha :predefine="predefineColors"></el-color-picker>
      </el-form-item>
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
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ProjectForm.end"
              style="width: 100%;"
            ></el-date-picker>
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
      ProjectForm: { image: null },
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#c7158577"
      ],
      rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入项目编码", trigger: "blur" }]
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
    cancel() {
      this.isShow = false
    },
    handlePreview(file) {
      console.log(file);
       this.ProjectForm.image = URL.createObjectURL(file.raw);
    },
    submitForm() {},
    handleAvatarSuccess(res, file) {
      this.ProjectForm.image = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

