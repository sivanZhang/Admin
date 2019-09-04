<template>
  <div id="task">
    <div>
      <el-row>
        <el-col :span="15">
          <el-button type="primary" icon="el-icon-plus" @click.native="mainTask">创建主任务</el-button>

          <!-- <el-dropdown>
        <el-button type="primary"  @click.native="openDialog(2)">
          创建
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="openDialog(1)">主任务</el-dropdown-item>
          <el-dropdown-item @click.native="openDialog(2)">子任务</el-dropdown-item>
        </el-dropdown-menu>
          </el-dropdown>-->
          <el-button icon="el-icon-download" type="primary">导入</el-button>

          <el-button
            type="danger"
            @click="deleteTask"
            icon="el-icon-delete"
            :disabled="this.multipleSelection.length === 0"
          >批量删除</el-button>
        </el-col>
        <el-col :span="9" style="text-align:right">
          <el-input
            placeholder="输入关键字搜索"
            style="width:200px;"
            v-model="keyword"
            class="input-with-select"
          >
            <el-button @click="getTasks(1)" slot="append" icon="el-icon-search" type="primary" />
          </el-input>
          <el-button @click="getTasks()" icon="el-icon-refresh-left" type="primary">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="TaskList"
        style="margin-top:20px"
        highlight-current-row
        :tree-props="{ children: 'sub_task' }"
        @current-change="rowSelected"
        @selection-change="handleSelectionChange"
        border
        :row-key="(row)=>{ return row.id}"
      >
        <!-- default-expand-all -->
        <el-table-column type="selection" :reserve-selection="true"></el-table-column>
        <el-table-column label="任务ID" prop="id"></el-table-column>
        <el-table-column prop="name" label="任务" show-overflow-tooltip></el-table-column>
        <el-table-column label="制作环节" prop="link_dept_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="镜头号">
          <template slot-scope="scope">{{scope.row.asset.name}}</template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" :formatter="Priority"></el-table-column>
        <el-table-column prop="grade" label="难度等级" :formatter="Grade"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status|projectStatus}}</template>
        </el-table-column>
        <el-table-column label="创建者">
          <template slot-scope="scope">{{scope.row.creator.name}}</template>
        </el-table-column>
        <el-table-column label="执行人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
        </el-table-column>
        <el-table-column prop="content" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建日期" width="95px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="开始日期" width="95px">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="截止日期" width="95px">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hour" label="预设时间（小时）" width="125px"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="添加子任务" placement="top">
              <span>
                <i
                  type="primary"
                  class="el-icon-plus"
                  style="color:red"
                  @click="openDialog(2,scope.row)"
                ></i>
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改任务" placement="top">
              <span style="margin-left:15px">
                <i
                  class="el-icon-edit"
                  type="primary"
                  style="color:green"
                  @click="openDialog(3,scope.row)"
                ></i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 主任务创建 -->
    <el-dialog title="主任务创建" :visible.sync="mainTaskShow" width="490px" ref="mainTask">
      <el-steps :active="active" finish-status="success">
        <el-step title="所属资产"></el-step>
        <el-step title="所属环节"></el-step>
        <el-step title="任务详情"></el-step>
      </el-steps>
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <div v-if="active == 0" style="padding-top:10px">
          <el-form-item label="所属资产">
            <el-select v-model="TaskForm.asset" filterable placeholder="请选择所属资产">
              <el-option
                v-for="item of AssetListTask"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="active==1&&LinkList.length" style="padding-top:10px">
          <el-form-item label="所属环节">
            <el-select v-model="TaskForm.link_id" filterable placeholder="请选择所属环节">
              <el-option
                v-for="item of LinkList"
                :label="item.dept.name"
                :value="item.link_id"
                :key="item.link_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="active==1&&LinkList.length===0" style="padding-top:10px">
          <el-row style="display:flex;justify-content:center">
            <svg-icon icon-class="warn" style="width:40px;height:40px;"></svg-icon>
          </el-row>
          <el-row style="display:flex;justify-content:center;padding-top:10px">
            <span>当前资产没有环节，请创建</span>
          </el-row>
          <el-row style="display:flex;justify-content:center;padding-top:10px">
            <el-button type="primary" @click="addLink(TaskForm.asset)">创建环节</el-button>
          </el-row>
        </div>
        <div v-if="active==2" style="padding-top:10px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="TaskForm.name" placeholder="请填写任务名称" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="任务内容" prop="content">
            <el-input type="textarea" v-model="TaskForm.content" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <!-- <el-input v-model="TaskForm.code"></el-input> -->
            <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
            <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
            <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
          </el-form-item>
          <el-form-item label="任务难度" prop="grade">
            <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
            <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
            <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
          </el-form-item>
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
              <el-option
                v-for="item of StatusList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务执行人" prop="executorlist">
            <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择任务执行人">
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
              :picker-options="picker"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="总工时" prop="total_hour">
            <el-input v-model="TaskForm['total_hour']"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel2">取消</el-button>
            <el-button type="primary" @click="editMainTask">立即创建</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-button style="margin-top: 12px;" @click="before" v-if="active !=0">上一步</el-button>
      <el-button
        style="margin-top: 12px;"
        @click="next"
        v-if="active !=2"
        :disabled="active==1&&LinkList.length===0"
      >下一步</el-button>
    </el-dialog>
    <!-- 子任务创建，任务修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" width="490px">
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" placeholder="请填写任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content" placeholder="请填写任务内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择任务执行人">
            <el-option
              v-for="item of DeptUsers"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属资产">
          <el-select v-model="TaskForm.asset" filterable placeholder="请选择所属资产">
            <el-option v-for="item of AssetList" :label="item.name" :value="item.id" :key="item.id"></el-option>
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
            :picker-options="picker2"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour" oninput = "value=value.replace(/[^\d.]/g,'')">
          <el-input v-model="TaskForm['total_hour']"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="editTask"
          >{{DialogType===3?'立即修改':'立即创建'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建主任务时，所选资产无环节时，创建环节 -->
    <el-dialog title="添加环节" :visible.sync="isLinkDialogShow" width="512px" center :modal="false">
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
                :picker-options="picker"
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
  </div>
</template>
<script>
import * as HTTP from "@/api/task";
import { log } from "util";
import { Transform } from "stream";
import myMixin from "./mixins";
import { mapState } from "vuex";
import { getDeptUsers } from "@/api/admin";
import { queryAssets } from "@/api/assets";
import { getLinks, getLink, addLinks } from "@/api/links";
import { type } from "os";
export default {
  mixins: [myMixin],
  name: "tab-task",
  data() {
    return {
      DeptUsers: [],
      keyword: "",
      isDialogShow: false,
      isLinkDialogShow: false,
      buttonStates: {
        createLoading: false
      },
      ActiveRow: {},
      DialogType: null,
      dialogTitle: "",
      mainTaskShow: false,
      active: 0,
      asset: null,
      asset_type: null,
      AssetListTask: null,
      optionAssetType: null,
      LinkList: [],
      FormList: [{}],
      selectList: [],
      createLoading: false,
      multipleSelection: [],
      picker: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      picker2: {
        disabledDate: time => {
          let beginDate = this.TaskForm.datetime[0];
          let endDate = this.TaskForm.datetime[1];
          if (beginDate || endDate) {
            return time.getTime() < beginDate || time.getTime() > endDate;
          }
        }
      }
    };
  },
  filters: {
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    },
    categoryFilter(obj) {
      if ("name" in obj) {
        return obj["name"];
      } else {
        return "";
      }
    }
  },
  computed: {
    ...mapState("admin", ["DeptList"]) //DeptUsers是根据登录账号得来的
  },
  props: {
    AssetList: {
      type: Array
    },
    TaskList: {
      type: Array
    }
  },
  watch: {
    active: {
      handler: function(newVal, oldVal) {
        if (newVal === 1 && this.TaskForm.asset) {
          //console.log(this.TaskForm.asset);
          
          getLinks({ asset: this.TaskForm.asset }).then(({ data }) => {
            const linkData = [...data.msg];
            this.LinkList = [];
              linkData.forEach(item => {
                item.forEach(ct => {
                  this.LinkList.push(ct);
                });
              });
          });
        }
        if (oldVal === 1 && this.TaskForm.link_id) {
          getLink({ link: this.TaskForm.link_id }).then(({ data }) => {
            this.TaskForm.content = data.msg.content;
            getDeptUsers({
              id: data.msg.dept.id
            }).then(res => {
              this.DeptUsers = [...res.data.users];
            });
            // console.log(this.TaskForm.content)
          });
        }
      }
    }
  },
  methods: {
    change(){
      this.$forceUpdate()
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
    //资产环节为空时，可创建
    addLink(asset) {
      console.log(asset);
      this.asset = asset;
      this.isLinkDialogShow = true;
      this.mainTaskShow = false;
    },
    //给某一资产添加环节
    addLinks() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.FormList.forEach((item, index) => {
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          dept: this.FormList[index].dept[this.FormList[index].dept.length - 1],
          asset: this.asset
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
            this.isLinkDialogShow = false;
            this.FormList = [{}];
            this.mainTaskShow = true;
            this.TaskForm.asset = this.asset;
            getLinks({ asset: this.TaskForm.asset }).then(({ data }) => {
              const linkData = [...data.msg];
                this.LinkList = [];
                linkData.forEach(item => {
                  item.forEach(ct => {
                    this.LinkList.push(ct);
                  });
                });  
            });
            this.active = 1;
          }
        })
        .catch(err => {
          this.isDialogShow = false;
          this.createLoading = false;
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
    },
    mainTask() {
      this.mainTaskShow = true;
      this.active = 0;
      queryAssets({
        project: this.$route.params.id,
        asset_type: this.asset_type
      }).then(({ data }) => {
        this.AssetListTask = [...data.msg];
      });
      this.TaskForm = {
        priority: 0,
        grade: 1
      };
    },
    before() {
      if (this.active-- < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log("多选");
      // console.log(this.multipleSelection)
    },

    //行被点击后出发
    rowSelected(row) {
      this.ActiveRow = { ...row };
      console.log(this.ActiveRow);
    },
    //打开对话框
    openDialog(Type, row) {
      this.ActiveRow = { ...row };
      // console.log(this.ActiveRow);

      this.DialogType = Type;
      getDeptUsers({
        id: this.ActiveRow.link_dept
      }).then(res => {
        this.DeptUsers = [...res.data.users];
        console.log(this.DeptUsers);
      });
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      switch (Type) {
        case 1:
          this.dialogTitle = "创建任务";
          this.TaskForm = {
            priority: 0,
            grade: 1
          };
          break;
        case 2:
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error("请选择父任务");
            return false;
          }
          this.dialogTitle = `创建 ${this.ActiveRow.name} 的子任务`;
          this.TaskForm = {
            priority: 0,
            grade: 1,
            pid: this.ActiveRow.id,
            asset: this.ActiveRow.asset,

            datetime: [
              new Date(dateFormat(this.ActiveRow.start_date)),
              new Date(dateFormat(this.ActiveRow.end_date))
            ]
          };
          break;
        case 3:
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error("请选择要修改的任务");
            return false;
          }
          let executorlist;
          if (this.ActiveRow.executor.length) {
            executorlist = this.ActiveRow.executor.map(item => +item.id);
          }
          this.dialogTitle = "修改任务";
          this.TaskForm = {
            ...this.ActiveRow,
            priority: 0,
            grade: 1,
            datetime: [
              new Date(this.ActiveRow.start_date * 1000),
              new Date(this.ActiveRow.end_date * 1000)
            ],
            executorlist,
            manager: this.ActiveRow.manager ? this.ActiveRow.manager.id : null,
            asset: this.ActiveRow.asset.id,
            method: "put"
          };
          // console.log(this.TaskForm, "~~~~~~~~~~~~");

          delete this.TaskForm.executor;
          delete this.TaskForm.creator;
          delete this.TaskForm.create_time;
          delete this.TaskForm.category;
          delete this.TaskForm.project;
          delete this.TaskForm["sub_task"];

          break;
      }
      this.isDialogShow = true;
    },
    //添加或者修改任务
    editTask() {
      this.$refs["TaskRef"].validate(valid => {
        if (valid) {
          this.buttonStates.createLoading = true;
          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString();
            //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          let data = {
            ...this.TaskForm,
            start_date: changeDateFormat(this.TaskForm.datetime[0]),
            end_date: changeDateFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          // console.log(data);
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          //若果是修改
          if (this.DialogType === 3) {
            HTTP.putTask(data)
              .then(({ data }) => {
                this.buttonStates.createLoading = false;

                if (data.status === 0) {
                  this.getTasks();
                  this.$message.success("已修改");
                  this.isDialogShow = false;
                } else {
                  this.$message.error(data.msg);
                  this.buttonStates.createLoading = false;
                }
              })
              .catch(err => {
                this.buttonStates.createLoading = false;
              });
          } else {
            console.log(data);
            HTTP.addTask(data).then(({ data }) => {
              this.buttonStates.createLoading = false;
              if (data.status === 0) {
                this.getTasks();
                this.isDialogShow = false;
                this.$message.success("已完成");
              } else {
                this.$message.error(data.msg);
                this.buttonStates.createLoading = false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //添加主任务
    editMainTask() {
      this.$refs["TaskRef"].validate(valid => {
        if (valid) {
          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString();
            //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          let data = {
            ...this.TaskForm,
            start_date: changeDateFormat(this.TaskForm.datetime[0]),
            end_date: changeDateFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          //若果是修改
          HTTP.addTask(data).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.mainTaskShow = false;
              this.active = 0;
              this.getTasks();

              // console.log(this.mainTaskShow);
            }
          });
        }
      });
    },

    //取消对话框
    cancel() {
      this.isDialogShow = false;
      this.$refs["TaskRef"].resetFields();
    },
    cancel2() {
      this.mainTaskShow = false;
      this.$refs["TaskRef"].resetFields();
      this.active = 0;
    },
    //删除任务http请求
    deleteTask() {
      this.$confirm("删除任务后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const ids = this.multipleSelection.map(item => item.id).join(",");
          HTTP.deleteTask(ids).then(({ data }) => {
            this.$message.success(data.msg);
            if (data.status === 0) {
              this.getTasks();
            }
          });
        })
        .catch(() => {});
    },
    //获取任务列表
    getTasks(type) {
      if (type) {
        this.$emit("get-tasks", this.keyword);
      } else {
        this.$emit("get-tasks");
      }
    },
    //优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "低级";
          break;
        case 1:
          return "中级";
          break;
        case 2:
          return "高级";
          break;
      }
    },
    //难度等级格式化显示
    Grade: function(row, column) {
      switch (row.grade) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "困难";
          break;
      }
    }
  },
  async created() {
    this.getTasks();
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

