<script>
import { getStatusTaskList } from "@/api/task";
import MyTask from "./components/MyTask";
import MyManWork from "./components/MyManWork";
import MyApprove from "./components/MyApprove";
import noticeDetail from "@/components/Notice/components/notice-detail";
import MyAllocation from "./components/MyAllocation";
import { mapState } from "vuex";
export default {
  name: "home-page",
  components: {
    MyTask,
    MyManWork,
    MyApprove,
    noticeDetail,
    MyAllocation
  },
  data() {
    return {
      MyTaskList: [],
    };
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount"]),
    ...mapState("login", ["userInfo"]),
    unreadList() {
      if (this.Notice && this.Notice.length) {
        return this.Notice.filter(t => !t.read);
      } else {
        return [];
      }
    }
  },
  created() {
    this.getMyTasks();
  },
  methods: {
    //修改是否已读
    updateIsRead(row) {
      console.log(row);
      if (row.read === 0) {
        row.read = 1;
      }
      HTTP.putNotice({
        method: "put",
        ids: row.id,
        read: row.read
      }).then(({ data }) => {
        if (data.status === 0) {
          //this.$message.success(data.msg);
          this.getNoticeDetail();
        }
      });
    },
    //获取我在进行中的任务
    getMyTasks() {
      getStatusTaskList({
        mytask: null,
        status: 2
      }).then(({ data }) => {
        this.MyTaskList = [...data.msg];
      });
    },
    getNoticeDetail() {
      this.$store.dispatch("notice/get_Notice", {
        userid: this.$store.state.login.userInfo.id
      });
    }
  }
};
</script>

<template>
  <div id="home-page">
    <el-card body-style="margin-bottom:15px;">
      <el-row :gutter="16">
        <el-col :span="4">
          <div class="card-item">
            <div class="labels">
              <el-avatar>{{userInfo.username | avatarFormat}}</el-avatar>
            </div>
            <div class="content">
              {{userInfo.username}}
              <svg-icon :icon-class="userInfo.sex && userInfo.sex==='男'?'nanxing':'nvxing'" />
            </div>
          </div>
          <div class="card-item">
            <div class="labels">邮 箱</div>
            <div class="content">{{userInfo.email}}</div>
          </div>
          <div class="card-item">
            <div class="labels">角 色</div>
            <div class="content">{{userInfo.role.role}}</div>
          </div>
          <div class="card-item">
            <div class="labels">工 种</div>
            <div class="content">
              <router-link
                class="dept-link"
                v-for="(item,index) of userInfo.dept"
                :key="index"
                :to="{path:'/admin/userGroup',query:{id:item.id}}"
              >{{item.name}}</router-link>
            </div>
          </div>
          <div class="card-item message">
            <div class="labels">
              <span>消 息</span>
              <!-- <el-badge
                :value="unreadCount"
                :hidden="!unreadCount"
                :max="99"
                class="item"
              >
                
              </el-badge>-->
            </div>
            <div class="content">
              <!--  <el-table
                :data="unreadList.filter((t,i)=>i<5)"
                style="width: 100%"
                ref="multipleTable"
                tooltip-effect="dark"
                @row-click="updateIsRead"
                :show-header="false"
              >
                <el-table-column label="通知" width="256" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <svg-icon v-if="scope.row.read == 0" icon-class="notice-close" />

                    <svg-icon v-if="scope.row.read == 1" icon-class="notice-open" />
                    <router-link :to="{path:scope.row.url}">{{scope.row.title}}</router-link>
                  </template>
                </el-table-column>
              </el-table>-->
              <!-- <el-button v-show="unreadList.length>5" @click="$store.commit('notice/SET_CARDSHOW', true)" type="text">查看更多</el-button> -->
              <el-button
                @click="$store.commit('notice/SET_CARDSHOW', true)"
                type="text"
                style="color:#ed4014"
              >{{unreadCount}} 条未读 <el-icon class="el-icon-position"/></el-button>
            </div>
          </div>
        </el-col>
        <!-- <svg-icon icon-class="caitongzhi" />-->
        <el-col :span="5">
          <MyTask :my-task-list="MyTaskList" :target-more="()=>$router.push({name:'my-task'})" />
        </el-col>
        <el-col :span="5">
          <MyManWork :my-tasks="MyTaskList" class="card" />
        </el-col>
        
        <el-col :span="5">
          <MyApprove />
        </el-col>
        <el-col :span="5">
          <MyAllocation />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss">
#home-page {
  .card {
  }
  .card-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
    &.message {
      align-items: flex-start;
    }
    .labels {
      width: 80px;
      text-align: center;
      vertical-align: middle;
      color: #909399;
    }
  }
  .label {
    width: 200px;
  }
  .el-button--text {
    padding: 0;
  }
  .svg-icon {
    font-size: 16px;
  }
  .dept-link {
    font-size: 12px;
    color: #2d8cf0;
    & + .dept-link {
      margin-left: 5px;
    }
  }
}
</style>