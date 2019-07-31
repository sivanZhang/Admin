<template>
  <div id="remarks">
    <!--添加备注输入框  -->
    <div style="width: 100%;padding:0 0 10px">
      <input
        type="text"
        v-model="remarks"
        placeholder="添加备注..."
        size="larger"
        @focus="buttons=!buttons"
      />
    </div>
    <!-- 添加备注的按钮是否显示 -->
    <div
      class="button-show"
      style="display: flex;justify-content: flex-end;padding: 5px"
      v-show="buttons"
    >
      <el-button @click="buttons=!buttons" size="small">取消</el-button>
      <el-button type="primary" @click="addRemarks"  size="small">添加备注</el-button>
    </div>
    <!-- 备注展示与筛选 -->
    <div class="remark-cont">
      <!-- 备注筛选 -->
      <div class="search-header" style="display:flex;width: 100%;padding:10px 0 10px">
        <!-- 筛选条件 -->
        <div style="width:220px">
          <input
          class="input-remarks"
          placeholder="在此输入筛选条件..."
          v-model=" optionInput"
        />
        </div>
        
        <!-- 备注筛选框 -->
        <el-select v-model="timeRemarks" multiple placeholder="请选择" size="mini" style="border:0px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 备注与对应评论的展示 -->
      <ul class="remark-list">
        <!-- 备注展示 -->
        <li class="remark-item" v-for="(item,index) in RemarksData" :key="index">
          <!-- 备注者头像 -->
          <div class="user-shot">
            <span>{{item.user.username | avatarFormat}}</span>
          </div>

          <div class="desc">
            <p class="user-text">
              <!-- 备注作者 -->
              <span>{{item.user.username}}</span>
              <!-- 备注时间 -->
              <span>
                {{item.date|dateFormat}}
                <!-- 删除备注按钮 -->
                <el-dropdown>
                  <i class="el-icon-more"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="delRemark(item)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </p>
            <!-- 备注内容 -->
            <p class="desc-text">{{item.content}}</p>
            <p class="pro-text">
              <!-- 实体图片 -->
              <el-image
                class="mini-image"
                :src="project.image?$store.state.BASE_URL+project.image:''"
                fit="cover"
                style="width: 30px;height: 30px;float: left;margin-right: 10px"
              ></el-image>
              <!-- 进入实体的链接 -->
              <span>
                <router-link :to="`/projects/project-detail/${item.user.id}`">{{project.name}}</router-link>
              </span>
            </p>
            <!-- 备注对应的评论的展示 -->
            <div>
              <ul class="comment-list">
                <template v-if="item.subs.length === 1||item.subs.length === 0">
                  <li class="comment-item" v-for="(todo,index) in item.subs" :key="index">
                    <div>
                      <div class="user-shot">
                        <span>{{todo.user.username | avatarFormat}}</span>
                      </div>
                      <div class="comment-desc">
                        <p class="user-text">
                          <span>{{todo.user.username}}</span>
                          <span>
                            {{todo.date |dateFormat}}
                            <el-dropdown>
                              <i class="el-icon-more"></i>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="delCommentTodo(todo)">删除</el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </span>
                        </p>
                        <p class="desc-text">{{todo.content}}</p>
                      </div>
                    </div>
                  </li>
                </template>
                <template v-else>
                  <li class="comment-item" >
                    <el-button 
                    @click="showAll=item.id"
                    v-show="item.subs.length - 1>0?item.subs.length - 1:0"
                  >显示剩余{{item.subs.length - 1}}条回复</el-button>
                  </li>
                  
                  <template v-if="showAll==item.id">
                    <li class="comment-item" v-for="(todo,index) in item.subs" :key="index">
                      <div>
                        <div class="user-shot">
                          <span>{{todo.user.username | avatarFormat}}</span>
                        </div>
                        <div class="comment-desc">
                          <p class="user-text">
                            <span>{{todo.user.username}}</span>
                            <span>
                              {{todo.date |dateFormat}}
                              <el-dropdown>
                                <i class="el-icon-more"></i>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item @click.native="delCommentTodo(todo)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </span>
                          </p>
                          <p class="desc-text">{{todo.content}}</p>
                        </div>
                      </div>
                    </li>
                  </template>
                  <template v-else>
                    <li class="comment-item">
                      <div>
                        <div class="user-shot">
                          <span>{{item.subs[item.subs.length - 1].user.username | avatarFormat}}</span>
                        </div>
                        <div class="comment-desc">
                          <p class="user-text">
                            <span>{{item.subs[item.subs.length - 1].user.username}}</span>
                            <span>
                              {{item.subs[item.subs.length - 1].date |dateFormat}}
                              <el-dropdown>
                                <i class="el-icon-more"></i>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item @click.native="delComment(item)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </span>
                          </p>
                          <p class="desc-text">{{item.subs[item.subs.length - 1].content}}</p>
                        </div>
                      </div>
                    </li>
                  </template>
                </template>
                <p class="reply-text">
                  <input
                    type="text"
                    v-model="comment[item.id]"
                    placeholder="回复..."
                    @focus="active=item.id"
                  />
                </p>
                <div
                  style="display: flex;justify-content: flex-end;padding: 5px"
                  v-show="active==item.id"
                >
                  <el-button @click="active=!active">取消</el-button>
                  <el-button type="primary" @click="addComment(item)">回复</el-button>
                </div>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getRemark, addRemark, removeRemark } from "@/api/remark";

import { getUserList } from "@/api/admin";
export default {
  props: {
    project: {
      type: Object
    }
  },
  created() {
    if (optionInput == "") this.getRemarkList();
  },
  watch: {
    project: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getRemarkList();
        }
        if (newVal.id != oldVal.id) {
          this.getRemarkList();
        }
        this.getRemarkList();
      }
      //deep: true
    },
    optionInput:{
      handler:function(newVal, oldVal){
        if(newVal){
          const msg = {
          appid: this.project.id,
          apptype: 4,
          name: this.optionInput
        };
        getRemark(msg).then(({ data }) => {
          this.RemarksData = [...data.msg];
        });
        }else{
          this.getRemarkList();
        }
      }
    }
  },
  data() {
    return {
      all: false,
      showAll: null,
      show: false,
      active: null,
      comment: [],
      commentResult: {},
      remarks: "",
      remarksResult: {},
      pid: null,
      RemarksData: [],
      buttons: false,
      optionInput: "",
      options: [
        {
          value: "1",
          label: "最近30天"
        },
        {
          value: "2",
          label: "任何时间"
        },
        {
          value: "3",
          label: "昨天"
        },
        {
          value: "4",
          label: "上个星期"
        },
        {
          value: "5",
          label: "最近一个月"
        }
      ]
    };
  },
  name: "remarks",
  components: {},
  methods: {
    //筛选备注
    
    //获取备注列表
    getRemarkList() {
      const msg = {
        appid: this.project.id,
        apptype: 4
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    //添加备注
    addRemarks() {
      if (this.remarks) {
        this.remarksResult = {
          entity_id: this.project.id,
          entity_type: 4,
          pid: this.pid,
          content: this.remarks
        };
        addRemark(this.remarksResult)
          .then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.remarks = "";
              this.buttons = false;
              this.getRemarkList();
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch(() => {
            //console.log("添加失败");
          });
      }
    },
    //添加回复
    addComment(item) {
      if (this.comment[item.id]) {
        this.commentResult = {
          entity_id: this.project.id,
          entity_type: 4,
          pid: item.id,
          content: this.comment[item.id]
        };
        addRemark(this.commentResult)
          .then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.comment[item.id] = [];
              this.showAll = null;
              this.getRemarkList();
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch(() => {
            // console.log("添加失败");
          });
      }
    },
    delCommentTodo(todo) {
      //删除回复
      this.$confirm("确定要删除此条回复？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        removeRemark({
          method: "delete",

          id: todo.id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getRemarkList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    delComment(item) {
      //删除回复
      this.$confirm("确定要删除此条回复？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        removeRemark({
          method: "delete",

          id: item.subs[item.subs.length - 1].id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getRemarkList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    delRemark(item) {
      //删除备注
      this.$confirm("确定要删除此条备注？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        removeRemark({
          method: "delete",

          id: item.id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);

            this.getRemarkList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#remarks {
  input {
    width: 460px;
    height: 20px;
    border: none;
    font-size:14px;
    border-bottom: solid 2px #999999;
  }
  input:focus {
    outline: none;
    border-bottom: solid 2px orangered;
  }
  .input-remarks {
    width: 200px;
    height: 20px;
    font-size:12px;
    
    border: none;
    border-bottom: solid 2px #999999;
  }
  .input-remarks:focus {
    outline: none;
    border-bottom: solid 2px rgba(0, 119, 255, 0.884);
  }
  .remark-list {
    list-style: none;
    padding: 0;
    margin: 0;
    .remark-item {
      margin: 6px 0;
      overflow: hidden;
      .user-shot {
        float: left;
        width: 10%;
        span {
          display: block;
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-size: 24px;
          background: #3bacf8;
          color: #fff;
          border-radius: 40px;
        }
      }
      .desc {
        float: left;
        width: 90%;
        font-size: 12px;
        border: 1px solid #ddd;
        .user-text {
          padding: 10px;
          overflow: hidden;
          span:first-child {
            float: left;
            color: #999;
          }
          span:last-child {
            float: right;
            color: #666;
            font-size: 14px
          }
        }
        .desc-text {
          padding: 10px;
          font-size: 12px;
        }
        .pro-text {
          padding: 10px;
          span {
            vertical-align: middle;
            padding-left: 10px;
            color: #49a0f7;
            font-size: 12px;
            font-weight: 400;
            :hover{
              color:#1b5186; 
            }
          }
        }
      }
    }
  }
  .comment-list {
    list-style: none;
    padding: 0;
    margin: 0;
    .comment-item {
      margin: 6px 0;
      overflow: hidden;
      .user-shot {
        float: center;
        width: 10%;
        padding:5px;
        border-top: 1px solid #ddd;
        span {
          
          display: block;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 20px;
          background: #3bacf8;
          color: #fff;
          border-radius: 30px;
        }
      }
      .comment-desc {
        float: left;
        width: 90%;
        font-size: 12px;
        border-top: 1px solid #ddd;
        .user-text {
          padding: 10px;
          overflow: hidden;
          span:first-child {
            float: left;
            color: #999;
            font-weight: 300;
          }
          span:last-child {
            float: right;
            color: #666;
            font-size: 12px
          }
        }
        .desc-text {
          padding: 10px;
          font-size: 12px;
        }
      }
    }
    .reply-text {
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      border-top: 1px solid #ddd;
      input {
        display: block;
        width: 100%;
        background: #eee;
        border: 1px solid #ddd;
        line-height: 25px;
        padding: 0 5px;
      }
    }
  }
}
</style>
