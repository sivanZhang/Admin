<style lang="scss" scoped>

</style>
<template>
  <div id="my-production" ref="drawer-parent">
    <el-select v-model="currentAuthor" placeholder="请选择">
      <el-option v-for="item in Authors" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="currentType" placeholder="请选择">
      <el-option v-for="item in Types" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button type="primary" @click="getProductions()">查询</el-button>
    <el-table :data="ProductionList" style="width: 100%;margin-top:30px" v-loading="tableLoading">
      <el-table-column label="作品" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.path && /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(scope.row.path)"
            :src="$store.state.BASE_URL+scope.row.path"
            style="width: 48px;height: 27px;cursor: pointer;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.path]"
          >
            <div slot="error">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
          <el-button
            v-else-if="scope.row.path"
            type="text"
            icon="el-icon-video-camera-solid"
            @click="showVideo(scope.row.path)"
          >{{scope.row.path}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="creator.username" label="创建者" header-align="center"></el-table-column>
      <el-table-column label="素材" header-align="center">
        <el-table-column label="所属项目" header-align="center" prop="task[0].project.name"></el-table-column>
        <el-table-column prop="asset.name" label="素材名称" header-align="center"></el-table-column>
        <el-table-column label="所属项目" header-align="center" prop="task[0].project.name"></el-table-column>
        <el-table-column prop="asset.image" label="缩略图" header-align="center">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.asset.image"
              style="width: 48px;height: 27px;cursor: pointer;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
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
      </el-table-column>
      <el-table-column label="任务" header-align="center">
        <el-table-column label="任务名称" header-align="center" prop="task[0].taskname"></el-table-column>
        <el-table-column label="工种名称" header-align="center" prop="task[0].link_dept_name"></el-table-column>
        <el-table-column label="所属项目" header-align="center" prop="task[0].project.name"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="viewComments(scope.row.task[0].taskid)">评论</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogTableVisible" @closed="endPlay">
      <video ref="videoplayer" :src="videoSrc" controls width="100%"></video>
    </el-dialog>
    <Drawer
      scrollable
      closable
      v-model="isDrawerShow"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      title="评论"
    >
      <remarks ref="remarks" :project="RemarkParams" :RemarksData="RemarksData" @refreshRemark="updateRemark"/>
    </Drawer>
  </div>
</template>

<script>
import remarks from "@/components/projectDrawer/components/remarks";
import { getProduction } from "@/api/production";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { getRemark} from "@/api/remark";
export default {
  name: "my-production",
  mixins: [thumbtackMixin], //drawer图钉效果
  components: {
    remarks
  },
  data() {
    return {
      RemarkParams: {}, //传给remark的参数
      RemarksData:[],
      isDrawerShow: false, //是否显示drawer
      videoSrc: "",
      dialogTableVisible: false, //dialog是否显示
      tableLoading: false, //table的加载效果
      ProductionList: [], //table的数据
      //作品参数
      Authors: [
        {
          label: "所有作品",
          value: ""
        },
        {
          label: "我的作品",
          value: "myworks"
        }
      ],
      currentAuthor: "myworks",
      //作品类型
      Types: [
        {
          label: "所有类型",
          value: ""
        },
        {
          label: "图片类型",
          value: "image"
        },
        {
          label: "视频类型",
          value: "video"
        }
      ],
      currentType: ""
    };
  },
  methods: {
    //点击评论按钮显示评论drawer
    viewComments(id) {
      this.RemarkParams = {
        id,
        entity_type: 1
      };
      const msg = {
          appid: this.RemarkParams.id,
          apptype: this.RemarkParams.entity_type
        };
      getRemark(msg).then(({ data }) => {
          this.RemarksData = [...data.msg];
          
          //console.log(this.RemarksData);
        });
      this.$nextTick(() => {
        // this.$refs["remarks"].getRemarkList();
        this.isDrawerShow = true;
      });

    },
    updateRemark() {
      getRemark({
        appid: this.RemarkParams.id,
        apptype: this.RemarkParams.entity_type
      }).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    //关闭dialog回调，停止视频播放
    endPlay() {
      this.$refs["videoplayer"].pause();
    },
    //打开视频弹框，为视频src赋值
    showVideo(path) {
      this.videoSrc = this.$store.state.BASE_URL + path;
      this.dialogTableVisible = true;
    },
    //获取作品列表
    getProductions() {
      this.tableLoading = true;
      let params = {};
      this.currentType && (params[this.currentType] = "");
      this.currentAuthor && (params[this.currentAuthor] = "");
      getProduction(params)
        .then(({ data }) => {
          this.ProductionList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    this.getProductions();
  }
};
</script>