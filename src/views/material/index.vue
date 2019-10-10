<!-- 素材库 -->
<template>
  <div id="material">
    <div style="padding-bottom:10px" v-if="authRole">
      <el-row>
        <el-col :span="16">
          <el-button type="primary" icon="el-icon-plus" @click="AddMaterial(1)">素材添加</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="mulDelMaterial()"
            :disabled="this.multipleSelection.length === 0"
          >批量删除</el-button>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="16">
              <el-input
                v-model="filterText"
                placeholder="请输入素材名称"
                @keyup.enter.native="searchMaterial(1)"
              >
                <el-button
                  @click="searchMaterial(1)"
                  slot="append"
                  icon="el-icon-search"
                  type="primary"
                />
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-button @click="searchMaterial()" type="primary" style="margin-left: 15px">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="materialList"
      :data="materialList"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="{borderRight:0}"
      highlight-current-row
      :row-key="(row)=>{ return row.id}"
      :border="false"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" align="left"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="缩略图" prop="image">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 48px;height: 27px;cursor: pointer;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
            v-if="!editing||clickId !== scope.row.id"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 48px;height: 27px;"
            @click.native="img(scope.row)"
            v-if="editing&&clickId === scope.row.id"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="素材名称" prop="name">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.name"
            placeholder="请输入素材名称"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.name?scope.row.name:"-"}}</span>
          </el-input>
          <span v-if="!editing||clickId !== scope.row.id">{{scope.row.name?scope.row.name:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="素材分类" prop="category">
        <template slot-scope="scope">
          <el-select
            v-model="categorys"
            multiple
            placeholder="请选择类型"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <el-option label="文本" value="1"></el-option>
            <el-option label="图片" value="2"></el-option>
            <el-option label="视频" value="3"></el-option>
            <el-option label="音频" value="4"></el-option>
            <el-option label="动漫" value="5"></el-option>
            <el-option label="多媒体" value="6"></el-option>
          </el-select>
          <span v-if="!editing||clickId !== scope.row.id">
            <el-row v-for="(item,index) of scope.row.category" :key="index">
              <el-col>{{item.name}}</el-col>
            </el-row>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目信息" prop="project_id">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.project_id"
            placeholder="请选择项目"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <el-option
              v-for="item of ProjectList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <span
            v-if="!editing||clickId !== scope.row.id"
          >{{scope.row.project?scope.row.project:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="素材路径" prop="path">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.path"
            placeholder="请输入素材路径"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.path?scope.row.path:"-"}}</span>
          </el-input>
          <span
            v-if="!editing||clickId !== scope.row.id"
            @click="show(scope.row.id)"
          >{{scope.row.path?scope.row.path:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="素材说明" prop="explain">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.explain"
            placeholder="请输入素材说明"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.explain?scope.row.explain:"-"}}</span>
          </el-input>
          <span
            v-if="!editing||clickId !== scope.row.id"
            @click="show(scope.row.id)"
          >{{scope.row.explain?scope.row.explain:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="estdate">
        <template slot-scope="scope">{{scope.row.estdate|dateFormat}}</template>
      </el-table-column>
      <template v-if="authRole">
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                @click="editMaterial(scope.row)"
                icon="el-icon-edit"
                type="text"
                style="color:blue"
                v-if="!editing||clickId !== scope.row.id"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="确认" placement="top">
              <el-button
                v-if="editing&&clickId === scope.row.id"
                type="text"
                icon="el-icon-check"
                style="color:green"
                @click="saveMaterial(scope.$index,scope.row)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteMaterial(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
                type="text"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 修改素材时更改图片 -->
    <el-dialog title="上传图片" :visible.sync="dialogImg" width="480px" top="5vh">
      <el-form
        :model="ImgForm"
        ref="ImgForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
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
        <el-form-item>
          <el-button @click="cancel2">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addImg">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加素材 -->
    <el-dialog title="添加素材" :visible.sync="addDialog" width="480px" top="5vh">
      <el-form :model="materialForm" label-width="90px">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="素材分类" prop="categorys">
          <el-select v-model="materialForm.categorys" multiple placeholder="请选择类型">
            <el-option label="文本" value="1"></el-option>
            <el-option label="图片" value="2"></el-option>
            <el-option label="视频" value="3"></el-option>
            <el-option label="音频" value="4"></el-option>
            <el-option label="动漫" value="5"></el-option>
            <el-option label="多媒体" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目信息" prop="project_id">
          <el-select v-model="materialForm.project_id" placeholder="请选择项目">
            <el-option
              v-for="item of ProjectList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材路径" prop="path">
          <el-upload
            class="upload-demo"
            ref="upload"
            accept="file"
            :action="action"
            :headers="headers"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :clearFiles="clearFiles"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="素材说明" prop="explain">
          <el-input type="textarea" v-model="materialForm.explain"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="AddMaterial()">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMaterial,
  addMaterial,
  delMaterial,
  putMaterial
} from "@/api/material";
import { getToken } from "@/utils/auth";
import { mapState } from "vuex";
import { getProjects } from "@/api/project";
export default {
  name: "material",
  components: {},
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      action: isPro
        ? this.$store.state.BASE_URL + "appfile/appfile/"
        : "/api/appfile/appfile/",
      materialForm: {},
      materialList: [],
      editing: false,
      ProjectList: [],
      clickId: null,
      iconShow: false,
      dialogImg: false,
      row: null,
      SRC: "",
      ImgForm: {},
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      buttonStates: {
        createLoading: false
      },
      multipleSelection: [],
      imagePath: null,
      fileList: [],
      addDialog: false,
      authRole: null,
      filterText: null,
      categorys: []
    };
  },
  watch: {},
  methods: {
    //获取所有项目
    getAllProjectList() {
      getProjects().then(({ data }) => {
        this.ProjectList = data.msg;
      });
    },
    //素材添加
    AddMaterial(Type) {
      if (Type === 1) {
        this.addDialog = true;
      } else {
        this.materialForm.categorys = this.materialForm.categorys
          .map(item => item)
          .join(",");
        addMaterial(this.materialForm).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.addDialog = false;
            this.materialForm = {};
            this.fileList = [];
            this.searchMaterial();
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    //修改图片弹出
    img(row) {
      this.dialogImg = true;
      this.row = row;
      this.SRC = this.$store.state.BASE_URL + row.image;
    },
    //修改图片
    addImg() {
      // console.log(this.ImgForm)
      this.imagePath = this.ImgForm.image;
      this.SRC = this.$store.state.BASE_URL + this.imagePath;
      this.row.image = this.imagePath;
      this.row.image_id = this.ImgForm.id;
      this.dialogImg = false;
    },
    //图片弹框退出
    cancel2() {
      this.SRC = "";
      this.dialogImg = false;
    },
    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.ImgForm.image = response.msg;
      this.ImgForm.image_id = response.id;
      this.materialForm.path = response.msg;
      //this.materialForm.path_id = response.id;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    clearFiles() {
      this.fileList = [];
    },
    //是否显示行内修改框
    showEditIcon() {
      this.iconShow = true;
    },
    //修改素材
    editMaterial(row) {
      if (this.iconShow === true) {
        this.$confirm("当前修改未保存", "注意", {
          // confirmButtonText: "确定",

          // concelButtonText: "取消",

          type: "warning"
        });
      } else {
        this.editing = true;
        this.clickId = row.id;
      }
    },
    //确认修改素材
    saveMaterial(index, row) {
      this.iconShow = false;

      let dataMaterial = {
        method: "put",
        id: row.id,
        name: row.name,
        ...this.ImgForm,
        path: row.path,
        explain: row.explain,
        project_id: row.project_id
      };
      if (this.categorys.length) {
        dataMaterial = {
          ...dataMaterial,
          categorys: this.categorys.map(item => item).join(",")
        };
      } else {
        dataMaterial = {
          ...dataMaterial,
          categorys: row.category.map(item => item.id).join(",")
        };
      }
      putMaterial(dataMaterial).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.searchMaterial();
          (this.categorys = null), (this.editing = false);
        } else {
          this.$message.error(data.msg);
        }
      });
      // console.log(dataMaterial)
    },
    //素材删除
    deleteMaterial(id) {
      this.$confirm("此操作将永久删除素材, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMaterial({ ids: id, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.searchMaterial();
          }
        });
      });
    },
    //素材批量删除
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(this.multipleSelection.length);
    },
    mulDelMaterial() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      this.$confirm("此操作将永久删除素材, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMaterial({ ids, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.searchMaterial();
          }
        });
      });
    },
    //查询素材库
    searchMaterial(Type) {
      if (Type === 1 && this.filterText) {
        getMaterial({ name: this.filterText }).then(({ data }) => {
          if (data.status === 0) {
            this.materialList = [...data.msg];
            this.authRole = data.auth.can_manage_material_state;
          }

          //console.log(this.materialList)
        });
      } else {
        getMaterial().then(({ data }) => {
          if (data.status === 0) {
            this.materialList = [...data.msg];
            this.authRole = data.auth.can_manage_material_state;
          }

          //console.log(this.materialList)
        });
      }
    }
  },
  created() {
    this.searchMaterial();
    this.getAllProjectList();
  }
};
</script>
<style lang='scss' scoped>
</style>