<template>
  <el-dialog title="新建项目" :visible.sync="isShow" width="480px" top="5vh" @closed="cancel()">
    <el-form
      :model="ProjectForm"
      :rules="rules"
      ref="projectForm"
      label-width="100px"
      class="demo-ProjectForm"
      label-position="left"
      hide-required-asterisk
    >
      <el-upload
        accept="image/jpeg, image/gif, image/png"
        ref="upload"
        class="upload-demo"
        action="/api/appfile/appfile/"
        :headers="headers"
        :on-success="handleSuccess"
        drag
        :show-file-list="false"
      >
        <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
        <template v-else>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </template>
      </el-upload>

      <el-form-item label="颜色" prop="color">
        <el-color-picker
          v-model="ProjectForm.color"
          :predefine="predefineColors"
          color-format="hex"
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model.trim="ProjectForm.name"></el-input>
      </el-form-item>
      <el-form-item label="项目编码" prop="code">
        <el-input v-model="ProjectForm.code"></el-input>
      </el-form-item>
      <el-form-item label="Windows路径" prop="windows_path">
        <el-input v-model="ProjectForm.windows_path"></el-input>
      </el-form-item>
      <el-form-item label="Mac路径" prop="mac_path">
        <el-input v-model="ProjectForm.mac_path"></el-input>
      </el-form-item>
      <el-form-item label="Linux路径" prop="linux_path">
        <el-input v-model="ProjectForm.linux_path"></el-input>
      </el-form-item>
      <el-form-item label="项目预算" prop="budget">
        <el-input v-model="ProjectForm.budget">
          <span slot="append">万</span>
        </el-input>
      </el-form-item>
      <el-form-item label="工作流" prop="region">
        <el-select v-model="ProjectForm.status" placeholder="请选择工作流">
          <el-option label="草稿" :value="0"></el-option>
          <el-option label="激活" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="region">
        <el-select v-model="ProjectForm.chargerid" placeholder="请选择负责人">
          <el-option
            v-for="item of UserList"
            :label="item.username"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止日期" required>
        <el-col :span="11">
          <el-form-item prop="start">
            <el-date-picker
              type="date"
              placeholder="项目开始日期"
              v-model="ProjectForm.start"
              style="width: 100%;"
              :picker-options="pickerBeginDateBefore"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="end">
            <el-date-picker
              type="date"
              placeholder="项目结束日期"
              v-model="ProjectForm.end"
              style="width: 100%;"
              :picker-options="pickerBeginDateAfter"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item class="subbtn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addProjects } from "@/api/project";
import AXIOS from "@/utils/request";
import { getToken } from "@/utils/auth";
import { mapState } from "vuex";
/* 
import { close } from "fs"; */
export default {
  name: "CreateProject",
  data() {
    return {
      ProjectForm: {
        image: null,
        color: "#409EFF"
      },
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
        code: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
        start: [
          { required: true, message: "请输入项目开始日期", trigger: "blur" }
        ],
        end: [
          { required: true, message: "请输入项目结束日期", trigger: "blur" }
        ],
        budget: [
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入数字",
            trigger: "change"
          }
        ]
      },
      SRC: "",
      file: null,
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.ProjectForm.end;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.ProjectForm.start;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      }
    };
  },
  props: {
    //父组件接，控制是否显示弹框
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
    cancel() {
      //告诉父组件：不显示弹框
      this.$emit("update:isShow", false);
    },
    //验证，并提交创建项目的表单
    submitForm() {
      this.$refs["projectForm"].validate(valid => {
        if (valid) {
          const Data = {
            ...this.ProjectForm,
            start: this.ProjectForm.start.toLocaleDateString(),
            end: this.ProjectForm.end.toLocaleDateString()
          };
          addProjects(Data).then(({ data }) => {
            this.$message(data.msg);
            if (data.status === 0) {
              this.$store.dispatch("project/get_Projects");
              this.$emit("update:isShow", false);
            }
          });
        } else {
          return false;
        }
      });
    },
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.ProjectForm["image"] = response.msg;
      this.ProjectForm.image_id = response.id;
    }
  },
  created() {
    !this.UserList && this.$store.dispatch("admin/get_UserList");
  },
  watch: {
    isShow(val) {
      //弹框关闭后，form数据重置、验证重置
      if (!val) {
        this.SRC = "";
        this.ProjectForm = {};
        this.$refs["projectForm"].resetFields();
      }
    }
  }
};
</script>
<style lang="scss">
.el-upload-dragger {
  width: 440px;
  height: 220px;
  border: 0px;
}
.el-upload-dragger:hover {
  border-color: transparent;
}

.el-dialog__body {
  padding-top: 0px;
}
</style>
<style lang="scss" scoped>
.el-form-item__label {
  font-size: 12px;
}

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
label {
  font-size: 12px;
  font-weight: 500;
}
.upload-demo {
  .el-upload {
    .el-upload-dragger {
      width: 440px;
      height: 220px;
    }
  }
}
.el-dialog__body {
  padding-top: 0px; /*zhangjiwei*/
}
.subbtn {
  text-align: center;
}
.subbtn {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>


