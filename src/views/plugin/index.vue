<template>
  <div id="plugin">
    <div style="display:flex">
      <div style="width:30%;padding:3 10px">
       
          <div style="display:flex">
             <h4 style="margin: 0 10px;"> 创建插件 </h4>
          </div>
           <div style="display:flex;margin-top:20px" >
          <el-form
            ref="saveForm"
            :label-position="labelPosition"
            label-width="100px"
            :model="saveForm"
            :rules="saveRules"
            class="save-form"
          >
            <el-form-item label="插件名称" prop="name">
              <el-input
                ref="name"
                v-model="saveForm.name"
                placeholder="插件名称"
                name="name"
                type="text"
                style="width:220px"
              />
            </el-form-item>
            <el-form-item label="适用软件" prop="software">
              <el-input
                ref="software"
                v-model="saveForm.software"
                type="text"
                placeholder="适用软件"
                name="software"
                style="width:220px"
              />
            </el-form-item>
            <el-form-item label="插件版本" prop="version">
              <el-input
                ref="version"
                v-model="saveForm.version"
                type="text"
                placeholder="版本号"
                name="version"
                style="width:220px"
                oninput="value=value.replace(/[^\d.]/g,'')"
              />
            </el-form-item>
            <el-form-item label="发布日期" prop="pubdate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="saveForm.pubdate"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="插件文件" prop="file">
              <el-upload
                class="upload-demo"
                ref="upload"
                accept="file"
                :action="action"
                :headers="headers"
                :on-success="handleSuccess"
                :before-remove="beforeRemove"
                :file-list="fileList"
              >
                <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="save">立即创建</el-button>
              <el-button @click="resetForm('saveForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="width:70%;padding:5px">
        <div style="display:flex">
          <h4 style="margin: 0 10px;"> 插件管理 </h4>
          <el-button style="margin: 0 10px;" @click="search" type="primary">查询</el-button>
        </div>
        <div style="margin-top:10px; border: 1px solid #dfe6ec;">
          <el-table :data="tableData" style="width: 100%" ref="plugin">
            <el-table-column prop="name" label="插件名称"  width="120px">
               <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column prop="software" label="适用软件" width="120px" >
               <template slot-scope="scope">{{scope.row.software}}</template>
            </el-table-column>
               
            <el-table-column prop="version" label="插件版本" width="120px">
                <template slot-scope="scope">{{scope.row.version}}</template>
            </el-table-column>
              
            <el-table-column prop="pubdate" label="发布日期" width="120px">
               <template slot-scope="scope">{{scope.row.pubdate}}</template>
             </el-table-column>  
            <el-table-column prop="filepath" label="插件文件" width="300px">
               <template slot-scope="scope">{{scope.row.filepath}}</template>
             </el-table-column>
            <el-table-column label="操作" width="106px">
              <template slot-scope="scope">
               <el-button @click="deletePlugin(scope.row.name)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
import { setPlugin, searchPlugin, deletePlugin } from "@/api/plugin";
import { getToken } from "@/utils/auth";
export default {
  name: "plugin",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      action: isPro
        ? "http://tl.chidict.com:8081/appfile/appfile/"
        : "/api/appfile/appfile/",
      fileList: [],
      labelPosition: "right",
      saveForm: {},
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      tableData:[],
      saveRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "请输入插件名称"
          }
        ],
        software: [
          {
            required: true,
            trigger: "blur",
            message: "请输入适用的软件"
          }
        ],
        version: [
          {
            required: true,
            trigger: "blur",
            message: "请输入插件版本号"
          }
        ],
        pubdate: [
          {
            required: true,
            trigger: "blur",
            message: "请输入时间"
          }
        ],
        file: [
          {
            required: true,
            trigger: "blur",
            message: "请上传文件"
          }
        ]
      },
      loading: false,
      headers: {
        Authorization: `JWT ${getToken()}`
      }
    };
  },
  methods: {
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //监听文件上传成功
    handleSuccess(response, file, fileList) {
      this.saveForm.file = response.msg;
      this.saveForm.file_id = response.id;
    },
    save() {
      this.$refs["saveForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let data = {
            name: this.saveForm.name,
            software: this.saveForm.software,
            version: this.saveForm.version,
            pubdate: this.saveForm.pubdate,
            pubdate: this.saveForm.pubdate,
            file: this.saveForm.file
          };
          setPlugin(data).then(({ data }) => {
            console.log(data);
            // if (data.status === 0) {
            //   this.$message.success(data.msg);
            // }
            // this.loading = false;
            // this.$refs["saveForm"].resetFields();
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search() {
      searchPlugin().then(({ data }) => {
        this.tableData = [...data.plugin];
      });
    },
    deletePlugin(name) {
      deletePlugin({ method: "delete", name:name }).then(
        ({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            
          }
          
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>

</style>