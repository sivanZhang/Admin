<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-plus" type="primary" @click="showAssetForm">创建资产</el-button>
    </div>

    <el-table
      ref="assetTable"
      :data="AssetList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      @row-dblclick="rowSelected"
      row-class-name="hover"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" align="center" width="65px"></el-table-column>
      <el-table-column label="缩略图" align="center">
        <template slot-scope="scope">
          <el-image :src="$store.state.BASE_URL+scope.row.image" style="width: 50px;height: 30px;" @click.native="show(scope.row.id)">
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
      <el-table-column prop="name" label="资产名称" align="left"></el-table-column>
      <el-table-column prop="category" label="类型" align="left"></el-table-column>
      <el-table-column prop="version_inner" label="版本号" align="left"></el-table-column>
      <el-table-column prop="priority" label="优先级" align="left"></el-table-column>
      <el-table-column prop="level" label="难度等级" align="left"></el-table-column>
      <el-table-column prop="id" label="资产ID" v-if="false" align="left"></el-table-column>
      <el-table-column prop="path" label="资产路径" align="left"></el-table-column>
      <el-table-column prop="creator_name" label="创建人" align="left"></el-table-column>
      <el-table-column prop="creator_id" label="创建人ID" v-if="false" align="left"></el-table-column>
      <el-table-column prop="status" label="状态" align="left"></el-table-column>
      <el-table-column prop="executor" label="执行人" align="left"></el-table-column>
      <el-table-column prop="deadline" label="截止日期" align="left"></el-table-column>
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

    <el-dialog title="新建资产" :visible.sync="isShow" width="500px">
      <el-form :model="AssetForm" :rules="rules" ref="assetForm" label-width="100px" hide-required-asterisk label-position="left">
        <el-form-item label="图片">
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
        </el-form-item>
        <el-form-item label="资产名称" prop="name" >
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
        <el-form-item label="资产类别" prop="category">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属团队" prop="team">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>-->
        <el-form-item label="内部资产版本号" prop="inner_version">
          <el-input v-model="AssetForm['inner_version']"></el-input>
        </el-form-item>
        <el-form-item label="外部资产版本号" prop="outer_version">
          <el-input v-model="AssetForm['outer_version']"></el-input>
        </el-form-item>
        <el-form-item label="关联任务" prop="task">
          <el-input v-model="AssetForm.task"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addAsset">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
     <Drawer closable v-model="value1" width="526" inner :transfer="false" :mask-style="{backgroundColor: 'transparent'}">
      <Header :project="project"></Header>
      <assetsDrawer :project="project" :RemarksData="RemarksData" />
    </Drawer>
    <Drawer
      :title="activeAsset.name+' 的环节详情'"
      v-model="isDrawerShow"
      width="512px"
      inner
      :transfer="false"
      :mask-style="{backgroundColor: 'transparent'}"
    >
      <links :link-list="LinkList" :asset-id="activeAsset.id" @refresh="getLinkList"></links>
    </Drawer>
  </div>
</template>

<script>
import assetsDrawer from "@/views/assetsManagement/components/assetsDrawer";
import Header from "@/components/projectDrawer/components/Header"
import * as HTTP from "@/api/assets";
import { addLinks, getLinks } from "@/api/links";
import { getRemark } from "@/api/remark";
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import links from "./links";
export default {
  components: {
    /*  */
    links,
    assetsDrawer,
    Header
  },
  neme: "asset-list",
  data() {
    return {
      project: null,
      RemarksData: [],
      value1: false,
      activeAsset: {},
      LinkList: [],
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
        level: [{ required: true, message: "请输入难度等级", trigger: "blur" }],
        path: [{ required: true, message: "请输入路径", trigger: "blur" }]
      },
      buttonStates: {
        createLoading: false
      },
      currentPage: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 50, 100],
      headers: {
        Authorization: `JWT ${getToken()}`
      }
    };
  },
  computed: {
    ...mapState("project", ["ProjectList"])
  },
  props: {
    AssetList: {
      type: Array
    }
  },
  methods: {
    show(id) {
      //console.log(id);
      this.value1 = true;
      HTTP.queryAssets({ id }).then(({ data }) => {
        this.project = {...[...data.msg][0],id};
      });
      const msg = {
          appid: id,
          apptype: 5
        };
        getRemark(msg).then(({ data }) => {
          this.RemarksData = [...data.msg];
        });
    },
    //行被点击后出发
    rowSelected(row) {
      this.activeAsset = row;
      this.isDrawerShow = true;
      this.getLinkList();
    },
    deleteAssets(id) {
      this.$confirm("此操作将永久删除该资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(id);
        HTTP.deleteAssets({ id }).then(({ data }) => {
          this.$message(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
          }
        });
      });
    },
    showAssetForm() {
      this.isShow = true;
      this.$refs["assetForm"].resetFields();
    },
    cancel() {
      this.isShow = false;
    },
    //新建资产
    addAsset() {
      this.$refs["assetForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          this.AssetForm = Object.assign({}, this.AssetForm, {
            project: this.$route.params.id
          });
          HTTP.postAssets(this.AssetForm)
            .then(({ data }) => {
              this.createLoading = false;
              this.$message(data.msg);
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
    getLinkList() {
      getLinks({
        asset: this.activeAsset.id
      }).then(res => {
        this.LinkList = [...res.data.msg];
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
  border-right: 0px solid #dfe6ec;
}
.hover {
  cursor: pointer;
}
#asset-list{
  min-height: calc(100vh - 159px);
}
</style>
