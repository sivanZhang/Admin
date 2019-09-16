<template>
  <div id="asset-list">
    <div>
      <el-row>
        <el-col :span="15" style="padding-bottom:15px;">
          <el-button icon="el-icon-plus" type="primary" @click="showAssetForm(1)">
            <slot name="add">添加资产</slot>
          </el-button>
          <el-button icon="el-icon-upload2" type="primary" @click="targetImport">
            <slot name="import">资产导入</slot>
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delMulAssets()"
            :disabled="this.multipleSelection.length === 0"
          >批量删除</el-button>
          <el-popover placement="bottom" width="300" trigger="click" style="margin-left:15px">
            <el-col :span="12">
              <el-checkbox v-model="ind">序号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_image">缩略图</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_session">场次</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_episode">集数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_name">镜头号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_frame">帧数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_frame_range">帧数范围</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_report">画面调整信息</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_retime">变速信息</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_inner_version">版本号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_content">制作内容</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_priority">优先级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_level">难度等级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_id">资产ID</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_name">创建人</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_id">创建人ID</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_status">状态</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_link">当前环节</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_totle_date_end">计划截止日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_total_hours">总工时</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_remark">备注</el-checkbox>
            </el-col>
            <el-button slot="reference" type="primary" icon="el-icon-setting" size="mini">展示列</el-button>
          </el-popover>
          <el-popover placement="bottom" width="150" trigger="click" style="margin-left:15px">
            <el-row style="padding-bottom:5px">状态</el-row>
              <el-radio-group v-model="statusRadio" @change="getAssetList">
              <el-radio :label="0" >暂停</el-radio>
              <el-radio :label="1">未开始</el-radio>
              <el-radio :label="2">进行中</el-radio>
              <el-radio :label="3">审核中</el-radio>
              <el-radio :label="4">完成</el-radio>
            </el-radio-group>
            <el-col align="right"><el-button @click="getAssetList(-1)" type="primary">重置</el-button></el-col>
            <el-button slot="reference" type="primary" size="mini">筛选</el-button>
          </el-popover>
        </el-col>
        <el-col :span="9" align="right">
          <el-input
            placeholder="输入关键字搜索"
            style="width:200px;"
            v-model="filterText"
            class="input-with-select"
          >
            <el-button @click="getAssetList()" slot="append" icon="el-icon-search" type="primary" />
          </el-input>
          <el-button @click="getAssetList(1)" type="primary">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="assetTable"
        :data="AssetList"
        style="width: 100%"
        border
        :stripe="true"
        :row-style="{'font-size':'13px'}"
        :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
        highlight-current-row
        row-class-name="hover"
        @selection-change="handleSelectionChange"
        :row-key="(row)=>{ return row.id}"
        v-loading="tableLoading"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55px"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" align="center" v-if="ind"></el-table-column>
        <el-table-column label="缩略图" align="center" v-if="show_image">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 50px;height: 30px;"
              @click.native="show(scope.row.id)"
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
              style="width: 50px;height: 30px;"
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
        <el-table-column prop="session" label="场次" align="center" v-if="show_session">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.session"
              placeholder="请输入场次"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.session?scope.row.session:"-"}}</span>
            </el-input>
            <span
              v-if="!editing||clickId !== scope.row.id"
            >{{scope.row.session?scope.row.session:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="episode" label="集数" align="center" v-if="show_episode">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.episode"
              placeholder="请输入集数"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.episode?scope.row.episode:"-"}}</span>
            </el-input>
            <span
              v-if="!editing||clickId !== scope.row.id"
            >{{scope.row.episode?scope.row.episode:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="镜头号"
          align="left"
          width="120px"
          show-overflow-tooltip
          v-if="show_name"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.name"
              placeholder="请输入镜头号"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.name?scope.row.name:"-"}}</span>
            </el-input>
            <span v-if="!editing||clickId !== scope.row.id">{{scope.row.name?scope.row.name:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="frame" label="帧数" align="left" v-if="show_frame">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.frame"
              placeholder="请输入帧数"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.frame?scope.row.frame:"-"}}</span>
            </el-input>
            <span v-if="!editing||clickId !== scope.row.id">{{scope.row.frame?scope.row.frame:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="frame_range"
          label="帧数范围"
          align="left"
          width="120px"
          v-if="show_frame_range"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.frame_range"
              placeholder="请输入帧数范围"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.frame_range?scope.row.frame_range:"-"}}</span>
            </el-input>
            <span
              v-if="!editing||clickId !== scope.row.id"
            >{{scope.row.frame_range?scope.row.frame_range:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="report" label="画面调整信息" align="left" width="120px" v-if="show_report">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.report"
              placeholder="请输入画面调整信息"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.report?scope.row.report:"-"}}</span>
            </el-input>
            <span
              v-if="!editing||clickId !== scope.row.id"
            >{{scope.row.report?scope.row.report:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="retime" label="变速信息" align="left" width="120px" v-if="show_retime">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.retime"
              placeholder="请输入变速信息"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.retime?scope.row.retime:"-"}}</span>
            </el-input>
            <span
              v-if="!editing||clickId !== scope.row.id"
            >{{scope.row.retime?scope.row.retime:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inner_version"
          label="版本号"
          align="left"
          show-overflow-tooltip
          v-if="show_inner_version"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="制作内容"
          align="left"
          show-overflow-tooltip
          v-if="show_content"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.content"
              placeholder="请输入帧数"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.content?scope.row.content:"-"}}</span>
            </el-input>
            <span
              v-if="!editing||clickId !== scope.row.id"
            >{{scope.row.content?scope.row.content:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          :formatter="Priority"
          align="left"
          v-if="show_priority"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.priority"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <el-option label="正常" :value="0"></el-option>
              <el-option label="优先" :value="1"></el-option>
            </el-select>
            <span v-if="!editing||clickId !== scope.row.id">{{scope.row.priority|Priority}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="难度等级"
          :formatter="Level"
          align="left"
          v-if="show_level"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.level"
              placeholder="请选择难度等级"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <el-option
                v-for="item of LevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span v-if="!editing||clickId !== scope.row.id">{{scope.row.level|Level}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="资产ID" v-if="show_id" align="left"></el-table-column>
        <el-table-column prop="creator_name" label="创建人" align="left" v-if="show_creator_name"></el-table-column>
        <el-table-column prop="creator_id" label="创建人ID" v-if="show_creator_id" align="left"></el-table-column>
        <el-table-column prop="status" label="状态" align="left" v-if="show_status">
          <template slot-scope="scope">{{scope.row.status|assetStatus}}</template>
        </el-table-column>
        <el-table-column label="当前环节" align="center" width="160px" v-if="show_link">
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
        <el-table-column label="计划截止日期" align="left" width="95px" v-if="show_totle_date_end">
          <template slot-scope="scope">{{scope.row.totle_date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hours" label="总工时" align="left" v-if="show_total_hours"></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="left"
          show-overflow-tooltip
          v-if="show_remark"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.remark"
              placeholder="请输入备注"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <p v-html="scope.row.remark"></p>
            </el-input>
            <span v-if="!editing||clickId !== scope.row.id">
              <p v-html="scope.row.remark"></p>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                @click="editOneAsset(scope.row)"
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
                @click="saveEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteAssets(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
                type="text"
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
          :page-count="pageCount"
          :total="total"
          :hide-on-single-page="total<=20"
        ></el-pagination>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="isShow" width="480px" top="5vh">
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="AssetForm.name" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="存放路径" prop="path">
          <el-input v-model="AssetForm.path" @input="change($event)"></el-input>
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
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="AssetForm.remark"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属团队" prop="team">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="addAsset"
          >{{DialogName===1?'立即创建':'立即修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    <Drawer
      scrollable
      closable
      v-model="value1"
      width="526"
      inner
      :transfer="false"
      :mask="false"
    >
      <Affix :offset-top="20">
      <Header :project="project">
        <span v-if="drawerType==='scene'" slot="type">镜头类型</span>
      </Header>
      <assetsDrawer
        :project="project"
        :RemarksData="RemarksData"
        @refresh_assetList="getAssetList"
        ref="assetsDrawer"
      />
      </Affix>
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
    assetsDrawer,
    Header
  },
  neme: "asset-list",
  data() {
    return {
      pageCount: 0,
      AssetList: [],
      total: 0,
      tableLoading: false, //表格加载状态
      project: null,
      RemarksData: [],
      value1: false,
      activeAsset: null,
      isDrawerShow: false,
      SRC: "",
      AssetForm: {
        priority: 0
      },
      ImgForm: {},
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
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入难度等级", trigger: "blur" }]
      },
      buttonStates: {
        createLoading: false
      },
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      multipleSelection: [],
      filterText: "",
      dialogTitle: "",
      DialogName: null,
      editing: false,
      clickId: null,
      iconShow: false,
      dialogImg: false,
      imagePath: null,
      row: null,
      ind: true,
      show_image: true,
      show_session: true,
      show_episode: true,
      show_name: true,
      show_frame: true,
      show_frame_range: true,
      show_report: true,
      show_retime: true,
      show_inner_version: true,
      show_content: true,
      show_priority: true,
      show_level: true,
      show_id: false,
      show_creator_name: true,
      show_creator_id: false,
      show_status: true,
      show_link: true,
      show_totle_date_end: true,
      show_total_hours: true,
      show_remark: true,
      statusRadio:null
    };
  },

  computed: {
    ...mapState("project", ["ProjectList"])
  },
  props: {
    activeName: {
      type: String
    },
    drawerType: {
      //侧边栏为资产还是镜头
      default: ""
    }
  },
  methods: {
    
    img(row) {
      this.dialogImg = true;
      (this.row = row), (this.SRC = this.$store.state.BASE_URL + row.image);
    },
    addImg() {
      // console.log(this.ImgForm)
      this.imagePath = this.ImgForm.image;
      this.SRC = this.$store.state.BASE_URL + this.imagePath;
      this.row.image = this.imagePath;
      this.row.image_id = this.ImgForm.id;
      this.dialogImg = false;
    },
    handleCurrentChange(row, event, column) {
      // console.log(row, event, column, event.currentTarget);
    },
    showEditIcon() {
      this.iconShow = true;
      this.rowClick = true;
    },
    editOneAsset(row) {
      // console.log("edit");
      // console.log(row);
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
      // console.log("edit");
      // console.log(index);
    },
    saveEdit(index, row) {
      this.iconShow = false;
      HTTP.editAssets({
        id: row.id,
        priority: row.priority,
        level: row.level,
        ...this.ImgForm,
        session: row.session,
        frame: row.frame,
        episode: row.episode,
        name: row.name,
        method: "put",
        remark: row.remark,
        report: row.report,
        retime: row.retime,
        frame_range: row.frame_range
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.getAssetList();
          this.editing = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    change() {
      this.$forceUpdate();
    },
    //跳转批量上传页
    targetImport() {
      this.$router.push({
        name: "asset-import",
        params: { id: this.$route.params.id }
      });
    },
    //获取资产或者镜头列表，type=1时表示重置
    getAssetList(type) {
      if (type === 1) {
        this.filterText = "";
      }
      if(type === -1){
        this.statusRadio = -1;
      }
      let payload = {
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1,
        pagenum: this.pageSize,
        page: this.currentPage
      };
      if (this.filterText) {
        payload = { ...payload, name: this.filterText };
      }
      if(this.statusRadio>=0){
        payload={...payload,status: this.statusRadio};
      }
      this.tableLoading = true;
      HTTP.queryAssets(payload)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection.length);
    },
    show(id) {
      this.value1 = true;
      HTTP.queryAssets({ id }).then(({ data }) => {
        this.project = { ...[...data.msg][0], id };
      });
      this.$refs.assetsDrawer.getLinkList(id);
      // this.$refs.assetsDrawer.getAssetVersion(id);
      this.$refs.assetsDrawer.getAssetTask(id);
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
            this.getAssetList();
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
            this.getAssetList();
          }
        });
      });
    },
    showAssetForm(Type, row) {
      this.DialogName = Type;

      if (Type === 1) {
        this.AssetForm = {
          priority: 0
        };
        this.SRC = "";
        this.dialogTitle = "新建";
      }
      if (Type === 2) {
        this.dialogTitle = "修改资产";
        this.SRC = this.$store.state.BASE_URL + row.image;
        this.AssetForm = {
          image: row.image,
          name: row.name,
          path: row.path,
          priority: row.priority,
          level: row.level,
          id: row.id,
          remark: row.remark
        };
      }
      this.isShow = true;
    },
    cancel() {
      this.isShow = false;
      this.$refs["assetForm"].resetFields();
      this.AssetForm = {
        priority: 0
      };
      this.SRC = "";
    },
    cancel2() {
      this.SRC = "";
      this.dialogImg = false;
    },
    //新建
    addAsset() {
      this.$refs["assetForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          if (this.DialogName == 1) {
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
                  this.getAssetList();
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
          }
          if (this.DialogName === 2) {
            this.AssetForm = Object.assign({}, this.AssetForm, {
              method: "put"
            });
            HTTP.editAssets(this.AssetForm)
              .then(({ data }) => {
                if (data.status === 0) {
                  this.$message.success(data.msg);
                  this.getAssetList();
                  this.isShow = false;
                } else {
                  this.$message.error(data.msg);
                }
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
          }
        } else {
          return false;
        }
      });
      this.DialogName = null;
    },

    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      // this.AssetForm.image = response.msg;
      // this.AssetForm.image_id = response.id;
      this.ImgForm.image = response.msg;
      this.ImgForm.image_id = response.id;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAssetList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getAssetList();
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
    this.getAssetList();
  }
};
</script>
<style lang="scss" >
.hover {
  cursor: pointer;
}
#asset-list {
  min-height: calc(100vh - 199px);
  & /deep/ .el-table--border th,
  & /deep/ .el-table--border td {
    /*zjw*/
    border-right-width: 0px;
  }
}
</style>
