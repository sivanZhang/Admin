<template>
  <div id="asset-list">
    <div>
      <el-row>
        <el-col :span="15" style="padding-bottom:15px;">
          <el-button icon="el-icon-plus" type="primary" @click="showAssetForm">添加资产</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="targetImport">批量导入</el-button>
          <el-button icon="el-icon-delete" type="danger" @click="delMulAssets" :disabled="this.multipleSelection.length === 0">批量删除</el-button>
        </el-col>
        <el-col :span="9" align="right">
          <el-input
            placeholder="输入关键字搜索"
            style="width:200px;"
            v-model="filterText"
            class="input-with-select"
          >
            <el-button @click="getAssetList(1)" slot="append" icon="el-icon-search" type="primary" />
          </el-input>
          <el-button @click="getAssetList()" icon="el-icon-refresh-left" type="primary">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="assetTable"
        :data="AssetList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%"
        border
        :stripe="true"
        :row-style="{'font-size':'13px'}"
        :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
        highlight-current-row
        row-class-name="hover"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" align="center" width="65px"></el-table-column>
        <el-table-column label="缩略图" align="center">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 50px;height: 30px;"
              @click.native="show(scope.row.id)"
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
        <el-table-column prop="changci" label="场次" align="center"></el-table-column>
        <el-table-column prop="jishu" label="集数" align="center"></el-table-column>
        <el-table-column prop="name" label="镜头号" align="left"></el-table-column>
        <el-table-column prop="version_inner" label="版本号" align="left"></el-table-column>
        <el-table-column prop="priority" label="优先级" :formatter="Priority" align="left"></el-table-column>
        <el-table-column prop="level" label="难度等级" :formatter="Level" align="left"></el-table-column>
        <el-table-column prop="id" label="资产ID" v-if="false" align="left"></el-table-column>
        <el-table-column prop="creator_name" label="创建人" align="left"></el-table-column>
        <el-table-column prop="creator_id" label="创建人ID" v-if="false" align="left"></el-table-column>
        <el-table-column prop="asset_status" label="状态" align="left"></el-table-column>
        <el-table-column label="当前环节" align="center" width="160px">
          <el-table-column prop="link" label="工种" align="left">
            <template slot-scope="scope">
              <div v-for="(todo,index) of scope.row.link" :key="index">{{todo.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="截止日期" align="left" width="95px">
            <template slot-scope="scope">
              <div
                v-for="(todo,index) of scope.row.link"
                :key="index"
                style="position:top"
              >{{todo.date_end|dateFormat}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="计划截止日期" align="left" width="95px">
          <template slot-scope="scope">{{scope.row.totle_date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hours" label="总工时" align="left"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="删除资产" placement="top">
              <el-button
                @click="deleteAssets(scope.row.id)"
                icon="el-icon-delete"
                type="text"
                style="color:red"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="AssetList.length"
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="新建资产" :visible.sync="isShow" width="480px" top="5vh">
      <el-form
        :model="AssetForm"
        :rules="rules"
        ref="assetForm"
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
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="AssetForm.name"></el-input>
        </el-form-item>
        <el-form-item label="存放路径" prop="path">
          <el-input v-model="AssetForm.path"></el-input>
        </el-form-item>
        <el-form-item label="优先等级" prop="priority">
          <!-- <el-input v-model="AssetForm.code"></el-input> -->
          <el-radio v-model="AssetForm.priority" :label="0">正常</el-radio>
          <el-radio v-model="AssetForm.priority" :label="1">优先</el-radio>
        </el-form-item>
        <el-form-item label="难度等级" prop="level">
          <el-select v-model="AssetForm.level" placeholder="请选择难度等级">
            <el-option
              v-for="item of LevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="所属团队" prop="team">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addAsset">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <Drawer
      scrollable
      closable
      v-model="value1"
      width="526"
      inner
      :transfer="false"
      :mask-style="{backgroundColor: 'transparent'}"
    >
      <Header :project="project"></Header>
      <assetsDrawer
        :project="project"
        :RemarksData="RemarksData"
        @get-tasks="getTasks"
        @refresh_assetList="getAssetList"
      />
    </Drawer>
  </div>
</template>

<script>
import assetsDrawer from "@/views/assetsManagement/components/assetsDrawer";
import Header from "@/components/projectDrawer/components/Header";
import * as HTTP from "@/api/assets";

import { getRemark } from "@/api/remark";
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  components: {
    /*  */

    assetsDrawer,
    Header
  },
  neme: "asset-list",
  data() {
    return {
      project: null,
      RemarksData: [],
      value1: false,
      activeAsset: null,

      isDrawerShow: false,
      SRC: "",
      AssetForm: {
        priority: 0
      },
      isShow: false,
      LevelList: [
        {
          label: "简单",
          value: 0
        },
        {
          label: "标准",
          value: 1
        },
        {
          label: "复杂",
          value: 2
        },
        {
          label: "高难度",
          value: 3
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入难度等级", trigger: "blur" }]
      },
      buttonStates: {
        createLoading: false
      },
      currentPage: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 50, 100],
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      multipleSelection: [],
      filterText: ""
    };
  },
 
  computed: {
    ...mapState("project", ["ProjectList"])
  },
  props: {
    AssetList: {
      type: Array
    },
    activeName: {
      type: String
    }
  },
  methods: {
    targetImport() {
      this.$router.push({
        name: "asset-import",
        params: { id: this.$route.params.id }
      });
    },
    getAssetList(type) {
      if (type) {
        this.$emit("refresh", this.filterText);
      } else {
        this.$emit("refresh");
      }
    },
    getTasks() {
      this.$emit("get-tasks");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    show(id) {
      //console.log(id);
      this.value1 = true;
      HTTP.queryAssets({ id }).then(({ data }) => {
        this.project = { ...[...data.msg][0], id };
      });
      const msg = {
        appid: id,
        apptype: 5
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    //删除单个资产
    deleteAssets(id) {
      this.$confirm("此操作将永久删除该资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //console.log(id);
        HTTP.deleteAssets({ id }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
          }
        });
      });
    },

    //批量删除资产
    delMulAssets() {
      this.$confirm("此操作将永久删除资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
        // console.log(ids);
        HTTP.deleteAssets({ ids }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
          }
        });
      });
    },
    showAssetForm() {
      this.isShow = true;
    },
    cancel() {
      this.isShow = false;
      this.$refs["assetForm"].resetFields();
    },
    //新建资产
    addAsset() {
      this.$refs["assetForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          if (this.activeName === "tab0") {
            this.AssetForm = Object.assign({}, this.AssetForm, {
              project: this.$route.params.id,
              asset_type: 0
            });
          } else {
            this.AssetForm = Object.assign({}, this.AssetForm, {
              project: this.$route.params.id,
              asset_type: 1
            });
          }

          HTTP.postAssets(this.AssetForm)
            .then(({ data }) => {
              this.createLoading = false;
              this.$message.success(data.msg);
              if (data.status === 0) {
                this.$emit("refresh");
                this.AssetForm = Object.assign(
                  {},
                  {
                    priority: 0
                  }
                );
              }
              this.isShow = false;
            })
            .catch(err => {
              this.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },

    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.AssetForm.image = response.msg;
      this.AssetForm.image_id = response.id;
    },
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
    },
    //难度等级格式化显示
    Level: function(row, column) {
      switch (row.level) {
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
    },
    //优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "正常";
          break;
        case 1:
          return "优先";
          break;
      }
    }
  },
  created() {
    this.$emit("refresh");
  }
};
</script>
<style lang="scss" >
.el-table--border th,
.el-table--border td {
  /*zjw*/
  border-right-width: 0px;
}
.hover {
  cursor: pointer;
}
#asset-list {
  min-height: calc(100vh - 159px);
}
</style>
