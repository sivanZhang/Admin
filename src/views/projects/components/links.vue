<template>
  <div id="links" style="display:flex;overflow:auto;">
    <div>
      <div style="padding-bottom:10px">
        <el-button icon="el-icon-plus" type="primary" @click="showLinksForm">添加环节</el-button>
      </div>
      <div style="display:flex;">
        <el-steps
          direction="vertical"
          :active="1"
          style="width:250px;display:flex；justify-content:flex-start"
          v-for="(todo,Index) of LinkList"
          :key="Index"
        >
          <el-step
            v-for="(item,index) of todo"
            :key="item.link_id"
            status="process"
            style="width:250px"
          >
            <div slot="title" style="font-size:14px;display:flex;justify-content:flex-start">
              {{item.dept.name}}
              <el-tooltip effect="dark" content="添加任务" placement="top">
                <span style="padding-left:5px">
                  <i
                    class="el-icon-plus"
                    style="color:blue"
                    @click="showTaskForm(item.link_id,item.dept.id,item.content)"
                  ></i>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="修改环节" placement="top">
                <span style="padding-left:5px">
                  <i class="el-icon-edit" style="color:green" @click="showLinkForm(item)"></i>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="上移" placement="top">
                <span style="padding-left:5px">
                  <i class="el-icon-top" @click="upmove(Index,index,item)" v-if="item.pid"></i>
                </span>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="下移"
                placement="top"
                v-if="!(index === (LinkList[Index].length - 1))"
              >
                <span style="padding-left:5px">
                  <i class="el-icon-bottom" @click="downmove(Index,index,item)"></i>
                </span>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="向前合并"
                placement="top"
                v-if="item.pid === 0&&Index -1>-1"
              >
                <span style="padding-left:5px">
                  <i class="el-icon-caret-left" @click="leftmove(Index)"></i>
                </span>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                content="向后合并"
                placement="top"
                v-if="item.pid === 0&&Index+1<LinkList.length"
              >
                <span style="padding-left:5px">
                  <i class="el-icon-caret-right" @click="rightmove(Index)"></i>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="拆分" placement="top" v-if="item.pid >0">
                <span style="padding-left:5px">
                  <svg-icon icon-class="unpack" @click="unpack(item)"></svg-icon>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除环节" placement="top">
                <span style="padding-left:5px">
                  <i class="el-icon-delete" style="color:red" @click="removeLink(item,Index,index)"></i>
                </span>
              </el-tooltip>
            </div>
            <ul slot="description" style="width:250px;">
              <li>制作要求: {{item.content}}</li>
              <template>
                <li>开始日期: {{item.date_and_user.date_start|dateFormat}}</li>
                <li>截止日期: {{item.date_and_user.date_end|dateFormat}}</li>
              </template>
            </ul>
          </el-step>
        </el-steps>
      </div>
    </div>

    <el-dialog title="添加环节" :visible.sync="isDialogShow" width="512px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :model="item" label-width="90px">
            <el-form-item
              label="环节内容"
              prop="content"
              :rules="[{ required: true, message: '请输入环节内容', trigger: 'blur' }]"
            >
              <el-input type="textarea" v-model="item.content" style="width:100%"></el-input>
            </el-form-item>
            <el-form-item
              label="当前工种"
              prop="dept"
              :rules="[{ required: true, message: '请输入当前工种', trigger: 'blur' }]"
            >
              <el-cascader
                v-model="item.dept"
                placeholder="输入搜索工种"
                :options="selectList"
                :props="{ checkStrictly: true}"
                filterable
                style="width:100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="时间" prop="datetime">
              <el-date-picker
                v-model="item.datetime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
                format="yyyy/MM/dd"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <el-divider />
        </el-col>
        <el-col :span="4" align="center">
          <el-tooltip effect="dark" content="删除" placement="top">
            <span>
              <i class="el-icon-delete" style="color:red" @click="deleteLink(index)"></i>
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="addLinks()">立即创建</el-button>
      </el-row>
    </el-dialog>
    <!-- 添加任务 -->
    <el-dialog title="添加任务" :visible.sync="isCreateTaskShow" width="490px" :modal="false">
      <el-form :model="TaskForm" :rules="rules" ref="TaskForm" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="TaskForm.status" filterable  placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" filterable  multiple placeholder="请选择执行人">
            <el-option
              v-for="item of DeptUsers"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="TaskForm.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            @change="changeTime()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour">
          <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelTask">取消</el-button>
          <el-button :loading="createTaskLoading" type="primary" @click="addTasks">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 环节修改 -->
    <el-dialog title="修改环节" :visible.sync="isLinkDialogShow" width="490px" center :modal="false">
      <el-form :model="updateLinkForm" label-width="100px">
        <el-form-item
          label="当前工种"
          prop="dept"
          :rules="[{ required: true, message: '请输入当前工种', trigger: 'blur' }]"
        >
          <el-cascader
            v-model="updateLinkForm.dept"
            placeholder="输入搜索工种"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="制作内容"
          prop="content"
          :rules="[{ required: true, message: '请输入环节内容', trigger: 'blur' }]"
        >
          <el-input v-model="updateLinkForm.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="updateLinkForm.datetime"
            type="daterange"
            range-separator="至"
            format="yyyy/MM/dd" 
          ></el-date-picker>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="updateLink">立即修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addTask } from "@/api/task";
import { addLinks, getLink, updateLink, delLink } from "@/api/links";
import { getDeptUsers } from "@/api/admin";
import { getDept } from "@/api/admin";
import { mapState } from "vuex";
import myMixin from "./mixins";
import { type } from "os";
export default {
  mixins: [myMixin],
  name: "links",
  data() {
    return {
      DeptUsers: [],
      isCreateTaskShow: false,
      TaskForm: {},
      isDialogShow: false,
      LinkForm: {},
      createLoading: false,
      createTaskLoading: false,
      selectList: [],
      FormList: [{}],
      show: null,
      isLinkDialogShow: false,
      updateLinkForm: {},
      oneLinkForm: {},
      dept: {},
      content: null,
      datetime: null,
    };
  },
  props: ["LinkList", "project"],
 
  computed: {
    ...mapState("admin", ["DeptList"]) //DeptUsers是根据登录账号得来的
  },
  methods: {
    //总工时默认值
    changeTime(val){
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24);
      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour
      };
    },
    //创建环节时，前置
    before(ind) {
      this.FormList.splice(ind, 0, {});
    },
    //创建环节时，后置
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
    },
    //创建环节时，删除
    deleteLink(index) {
      if (index !== 0) this.FormList.splice(index, 1);
    },
    //串行环节调整顺序（上移）
    upmove(Index, index, item) {
      //console.log(item);
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      const data = [
        {
          id: item.link_id,
          content: item.content,
          date_start:
            dateFormat(item.date_and_user.date_start) ,
          date_end:
            dateFormat(item.date_and_user.date_end) ,
          asset: this.project.id,
          pid: this.LinkList[Index][index - 1].pid,
          dept: item.dept.id
        },
        {
          id: this.LinkList[Index][index - 1].link_id,
          content: this.LinkList[Index][index - 1].content,
          date_start:
            dateFormat(
              this.LinkList[Index][index - 1].date_and_user.date_start
            ) ,
          date_end:
            dateFormat(this.LinkList[Index][index - 1].date_and_user.date_end),
          asset: this.project.id,
          pid: item.link_id,
          dept: this.LinkList[Index][index - 1].dept.id
        }
      ];
      //console.log(data);
      updateLink({
        method: "put",
        links: data
      }).then(({ data }) => {
        this.createTaskLoading = false;
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$emit("refresh_assetList");
          this.isLinkDialogShow = false;
        }
      });
    },
    //串行环节顺序调整（下移）
    downmove(Index, index, item) {
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      const data = [
        {
          id: item.link_id,
          content: item.content,
          date_start:
            dateFormat(item.date_and_user.date_start),
          date_end:
            dateFormat(item.date_and_user.date_end) 
              ,
          asset: this.project.id,
          pid: this.LinkList[Index][index + 1].link_id,
          dept: item.dept.id
        },
        {
          id: this.LinkList[Index][index + 1].link_id,
          content: this.LinkList[Index][index + 1].content,
          date_start:
            dateFormat(
              this.LinkList[Index][index + 1].date_and_user.date_start
            ) ,
          date_end:
            dateFormat(this.LinkList[Index][index + 1].date_and_user.date_end ),
          asset: this.project.id,
          pid: item.pid,
          dept: this.LinkList[Index][index + 1].dept.id
        }
      ];
      // console.log(data);
      updateLink({
        method: "put",
        links: data
      }).then(({ data }) => {
        this.createTaskLoading = false;
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$emit("refresh_assetList");
          this.isLinkDialogShow = false;
        }
      });
    },
    //并行环节合并（向前合并）
    leftmove(Index) {
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      const data = [
        {
          id: this.LinkList[Index][0].link_id,
          content: this.LinkList[Index][0].content,
          date_start:
            dateFormat(this.LinkList[Index][0].date_and_user.date_start) ,
          date_end:
            dateFormat(this.LinkList[Index][0].date_and_user.date_end) ,
          asset: this.project.id,
          pid: this.LinkList[Index - 1][this.LinkList[Index - 1].length - 1]
            .link_id,
          dept: this.LinkList[Index][0].dept.id
        }
      ];
      updateLink({
        method: "put",
        links: data
      }).then(({ data }) => {
        this.createTaskLoading = false;
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$emit("refresh_assetList");
          //this.isLinkDialogShow = false;
        }
      });
      // console.log(this.LinkList[Index][0]);
    },
    //并行环节合并（向后合并）
    rightmove(Index) {
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      const data = [
        {
          id: this.LinkList[Index][0].link_id,
          content: this.LinkList[Index][0].content,
          date_start:
            dateFormat(this.LinkList[Index][0].date_and_user.date_start) ,
          date_end:
            dateFormat(this.LinkList[Index][0].date_and_user.date_end) ,
          asset: this.project.id,
          pid: this.LinkList[Index + 1][this.LinkList[Index + 1].length - 1]
            .link_id,
          dept: this.LinkList[Index][0].dept.id
        }
      ];
      console.log(data);
      updateLink({
        method: "put",
        links: data
      }).then(({ data }) => {
        this.createTaskLoading = false;
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$emit("refresh_assetList");
          //this.isLinkDialogShow = false;
        }
      });
    },
    //串行环节拆分
    unpack(item) {
      console.log(item);
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      const data = [
        {
          id: item.link_id,
          content: item.content,
          date_start:
            dateFormat(item.date_and_user.date_start) ,
          date_end:
            dateFormat(item.date_and_user.date_end) ,
          asset: this.project.id,
          pid: 0,
          dept: item.dept.id
        }
      ];
      console.log(data);
      updateLink({
        method: "put",
        links: data
      }).then(({ data }) => {
        this.createTaskLoading = false;
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$emit("refresh_assetList");
          //this.isLinkDialogShow = false;
        }
      });
    },
    showLinksForm() {
      this.isDialogShow = true;
    },
    cancel() {
      this.isDialogShow = false;
      this.FormList = [{}];
    },
    //取消对话框
    cancelTask() {
      this.isCreateTaskShow = false;
      this.TaskForm = {};
    },
    //展示添加任务表单
    showTaskForm(link_id, dept_id, content) {
      getDept({
        id: dept_id
      }).then(res => {
        this.DeptUsers = [...res.data.users];
        console.log(this.DeptUsers);
      });
      this.isCreateTaskShow = true;
      this.TaskForm = Object.assign(
        {},
        {
          priority: 0,
          grade: 0,
          asset: this.project.id,
          project: this.$route.params.id,
          link_id,
          content
        }
      );
    },
    //展示要修改的环节信息
    showLinkForm(item) {
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      getLink({ link: item.link_id }).then(({ data }) => {
        if (data.status === 0) {
          this.oneLinkForm = data.msg;
          //console.log(this.oneLinkForm);
          this.content = data.msg.content;
          this.dept = data.msg.dept;
          this.datetime = [
            new Date(dateFormat(data.msg.date_and_user.date_start))>0?new Date(dateFormat(data.msg.date_and_user.date_start)):"",
            new Date(dateFormat(data.msg.date_and_user.date_end))>0?new Date(dateFormat(data.msg.date_and_user.date_end)):""
          ];
          this.isLinkDialogShow = true;
          this.updateLinkForm = {
            dept: this.dept.id,
            content: this.content,
            datetime: this.datetime
          };
          //console.log(this.updateLinkForm);
        }
      });
    },
    //更新修改的环节信息
    updateLink() {
      //console.log(this.updateLinkForm);
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      if (this.updateLinkForm.dept.length) {
        this.updateLinkForm.dept = this.updateLinkForm.dept[
          this.updateLinkForm.dept.length - 1
        ];
      }
      const updateData = {
        id: this.oneLinkForm.link_id,
        content: this.updateLinkForm.content,
        date_start: dataFormat(this.updateLinkForm.datetime[0]),
        date_end: dataFormat(this.updateLinkForm.datetime[1]),
        asset: this.project.id,
        pid: this.oneLinkForm.pid,
        dept: this.updateLinkForm.dept
      };
      updateLink({
        method: "put",
        links: [updateData]
      }).then(({ data }) => {
        this.createTaskLoading = false;
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$emit("refresh_assetList");
          this.isLinkDialogShow = false;
        }
      });
    },
    //给某一环节添加任务
    addTasks() {
      this.$refs["TaskForm"].validate(valid => {
        if (valid) {
          this.createTaskLoading = true;
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          addTask(data)
            .then(({ data }) => {
              this.createTaskLoading = false;
              this.$message.success(data.msg);
              if (data.status === 0) {
                this.cancelTask();
                this.isDialogShow = false;
              }
            })
            .catch(err => {
              this.createTaskLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    //给某一资产添加环节
    addLinks() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.FormList.forEach((item, index) => {
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          dept: this.FormList[index].dept[this.FormList[index].dept.length - 1],
          asset: this.project.id
        });

        if (
          "datetime" in this.FormList[index] &&
          this.FormList[index].datetime.length
        ) {
          this.FormList[index] = {
            ...this.FormList[index],
            date_start: dataFormat(this.FormList[index].datetime[0]),
            date_end: dataFormat(this.FormList[index].datetime[1])
          };
          delete this.FormList[index].datetime;
        }
        if (index === 0) {
          this.FormList[index].pid = 0;
        } else {
          this.FormList[index].pid = this.FormList[index - 1].dept;
        }
      });
      this.createLoading = true;
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      addLinks({ links: [...this.FormList] })
        .then(({ data }) => {
          this.createLoading = false;
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
            this.$emit("refresh_assetList");
            this.isDialogShow = false;
            this.FormList = [{}];
          }
        })
        .catch(err => {
          this.isDialogShow = false;
          this.createLoading = false;
        });
    },
    //环节删除
    removeLink(item, Index, index) {
      this.$confirm("删除环节后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (
          this.LinkList[Index].length === 1 ||
          (this.LinkList[Index].length > 0 && item.pid !== 0)
        ) {
          delLink({
            id: item.link_id,
            method: "delete"
          }).then(({ data }) => {
            this.$message.success(data.msg);
            if (data.status === 0) {
              this.$emit("refresh");
              this.$emit("refresh_assetList");
            }
          });
        } else if (this.LinkList[Index].length > 0 && item.pid === 0) {
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          const data = {
            id: this.LinkList[Index][1].link_id,
            content: this.LinkList[Index][1].content,
            date_start: dataFormat(
              this.LinkList[Index][1].date_and_user.date_start
            ),
            date_end: dataFormat(
              this.LinkList[Index][1].date_and_user.date_end
            ),
            asset: this.project.id,
            pid: 0,
            dept: this.LinkList[Index][1].dept.id
          };
          updateLink({
            method: "put",
            links: [data]
          }).then(({ data }) => {
            this.createTaskLoading = false;
            this.$emit("refresh");
            this.$emit("refresh_assetList");
          });
          delLink({
            id: item.link_id,
            method: "delete"
          }).then(({ data }) => {
            this.$message.success(data.msg);
            if (data.status === 0) {
              this.$emit("refresh");
              this.$emit("refresh_assetList");
            }
          });
        }
      });
    },
    formatList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.selectList);
    }
  },
  async created() {
    if (!this.DeptList) {
     await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      
      this.formatList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

