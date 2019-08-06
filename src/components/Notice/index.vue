<template>
  <div>
    <svg-icon icon-class="notice" @click="show" />
    <el-badge :value="notice.length" class="item"></el-badge>
    <Drawer
      closable
      height="500"
      v-model="value1"
      width="526"
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
    >
      <div>
        <el-button
          type="warning"
          @click="delNotices"
          :disabled="this.multipleSelection.length === 0"
        >批量删除</el-button>
        <!--disabled值动态显示，默认为true,当选中复选框后值为false-->
      </div>

      <el-table
        :data="notice"
        style="width: 100%"
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row>
                <el-form-item label="通知类别:">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="通知内容:">
                  <span>{{ props.row.content }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="时间">
                  <span>{{ props.row.date|dateFormat }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="修改时间">
                  <span>{{ props.row.modify_date|dateFormat }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="是否已读">
                  <span>{{ props.row.read |isRead }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="紧急程度">
                  <span>{{ props.row.urgency_level |urgencyLevel}}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="url">
                  <span>{{ props.row.url }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column label="通知" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="`${scope.row.url}`">{{scope.row.title}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="是否已读" :formatter="readFormat"></el-table-column>
        <el-table-column label="紧急程度" :formatter="urgencyFormat"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="删除资产" placement="top">
              <el-button
                @click="delNotice(scope.row.id)"
                icon="el-icon-delete"
                type="text"
                style="color:red"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </Drawer>
  </div>
</template>

<script>
import * as HTTP from "@/api/notice";
export default {
  name: "Notice",
  created() {
    this.getNoticeDetail();
  },

  data() {
    return {
      value1: false,
      id: this.$store.state.login.userInfo.id,
      notice: [],
      active: null,
      multipleSelection: []
    };
  },

  methods: {
    //列表中是否已读显示
    readFormat: function(row, column) {
      switch (row.read) {
        case 0:
          return "未读";
          break;
        case 1:
          return "已读";
          break;
      }
    },
    //列表中紧急程度显示
    urgencyFormat: function(row, column) {
      switch (row.urgency_level) {
        case 0:
          return "一般";
          break;
        case 1:
          return "紧急";
          break;
        case 2:
          return "特急";
          break;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    show() {
      this.value1 = true;
    },
    handleChange(val) {
      console.log(val);
    },
    //获取当前用户收到的通知
    getNoticeDetail() {
      HTTP.noticeDetail(this.id).then(({ data }) => {
        this.notice = [...data.msg];
        //   console.log("通知详情");
        //   console.log(this.notice);
      });
    },
    //批量删除通知
    delNotices() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      //console.log(ids);
      this.$confirm("确定删除？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        HTTP.removeNotice({
          method: "delete",
          ids: ids
        }).then(({ data }) => {
          if (data.status === "ok") {
            this.$message.success(data.msg);
            this.$refs.multipleTable.clearSelection();
            this.getNoticeDetail();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //单个删除通知
    delNotice(id) {
      this.$confirm("确定删除此条通知？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        HTTP.removeNotice({
          method: "delete",
          ids: id
        }).then(({ data }) => {
          if (data.status === "ok") {
            this.$message.success(data.msg);
            this.$refs.multipleTable.clearSelection();
            this.getNoticeDetail();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.item {
  position: static;
  margin-left: -10px;
  margin-top: -16px;
}
svg-icon {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 22px;
  height: 22px;
  vertical-align: 10px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<style lang="scss">
.ivu-drawer-content{
  top:85px;
}
</style>

