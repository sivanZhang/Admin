<template>
  <div id="layout_main">
    <div class="layout_main_top">
      <div class="layout_main_top_left">
        <div class="layout_task">
          <h2>2</h2>
          <span class="layout_top_span">任务</span>
        </div>
        <div class="layout_task">
          <h2>0</h2>
          <span class="layout_top_span">未开始</span>
        </div>
        <div class="layout_task">
          <h2>0</h2>
          <span class="layout_top_span">进行中</span>
        </div>
      </div>
      <div class="layout_main_top_right">
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期一</span>
        </div>
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期二</span>
        </div>
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期三</span>
        </div>
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期四</span>
        </div>
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期五</span>
        </div>
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期六</span>
        </div>
        <div class="layout_week">
          <h2>-</h2>
          <span class="layout_top_span">星期日</span>
        </div>
      </div>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="任务板">
        <div class="task-board">
          <div class="task-board-left" id="task-board-left">
            <div class="tasks-top">
              <div class="list">
                <!--              点击图标显示小型网格布局-->
                <span class="svg-container" title="显示小型网格布局">
                  <svg-icon icon-class="list_min"></svg-icon>
                </span>
                <!--              点击图标显示大型网格布局-->
                <span class="svg-container" title="大型网格布局">
                  <svg-icon icon-class="list_max"></svg-icon>
                </span>
                <!--              select选择器，选择项目，默认选择所有-->
                <el-select
                  v-model="value1"
                  multiple
                  placeholder="任何项目"
                  size="mini"
                  collapse-tags
                  style="margin-left: 20px;"
                >
                  <el-option
                    v-for="item in taskList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!--              select选择器，选择任务完成进度，默认选择所有-->
                <el-select
                  v-model="value2"
                  multiple
                  collapse-tags
                  style="margin-left: 20px;"
                  placeholder="任何备注"
                  size="mini"
                >
                  <el-option
                    v-for="item in taskProgress"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="fold-icon">
                <span class="svg-container">
                  <svg-icon icon-class="fold" @click="taskBoardRightShow"></svg-icon>
                </span>
              </div>
            </div>
            <div class="tasks-foot">
              <div class="content-box" v-show="taskAvailableUnFold">
                <div class="task-title">
                  <span class="task-title-justify">可用任务</span>
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye-open"
                      @click="taskAvailableUnFold=!taskAvailableUnFold;taskAvailableFold=!taskAvailableFold"
                    ></svg-icon>
                  </span>
                </div>
                <div class="sort-order">
                  <span class="sort">排序方式</span>
                  <el-select v-model="taskAvailableSel" placeholder="截止日期" size="mini">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="content">
                  <span class="task-show">无任何任务</span>
                </div>
              </div>
              <div class="fold-box" v-show="taskAvailableFold">
                <div style="height: 400px;">
                  <span class="task-vertical">可用任务</span>
                </div>
                <div style="height: 100px;">
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye"
                      @click="taskAvailableUnFold=!taskAvailableUnFold;taskAvailableFold=!taskAvailableFold"
                    ></svg-icon>
                  </span>
                </div>
              </div>
              <div class="content-box" v-show="notStartedUnFold">
                <div class="task-title">
                  <span class="task-title-justify">Not Started</span>
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye-open"
                      @click="notStartedUnFold=!notStartedUnFold;notStartedFold=!notStartedFold"
                    ></svg-icon>
                  </span>
                </div>
                <div class="sort-order">
                  <span class="sort">排序方式</span>
                  <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="content">
                  <span class="task-show">无任何任务</span>
                </div>
              </div>
              <div class="fold-box" v-show="notStartedFold">
                <div style="height: 400px;">
                  <span class="task-vertical">Not Started</span>
                </div>
                <div style="height: 100px;">
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye"
                      @click="notStartedUnFold=!notStartedUnFold;notStartedFold=!notStartedFold"
                    ></svg-icon>
                  </span>
                </div>
              </div>
              <div class="content-box" v-show="inProgressUnFold">
                <div class="task-title">
                  <span class="task-title-justify">In Progress</span>
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye-open"
                      @click="inProgressUnFold=!inProgressUnFold;inProgressFold=!inProgressFold"
                    ></svg-icon>
                  </span>
                </div>
                <div class="sort-order">
                  <span class="sort">排序方式</span>
                  <el-select v-model="inProgressSel" placeholder="截止日期" size="mini">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="content">
                  <span class="task-show">无任何任务</span>
                </div>
              </div>
              <div class="fold-box" v-show="inProgressFold">
                <div style="height: 400px;">
                  <span class="task-vertical">In Progress</span>
                </div>
                <div style="height: 100px;">
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye"
                      @click="inProgressUnFold=!inProgressUnFold;inProgressFold=!inProgressFold"
                    ></svg-icon>
                  </span>
                </div>
              </div>
              <div class="content-box" v-show="doneUnFold">
                <div class="task-title">
                  <span class="task-title-justify">Done</span>
                  <span class="svg-contain">
                    <svg-icon
                      icon-class="eye-open"
                      @click="doneUnFold=!doneUnFold;doneFold=!doneFold"
                    ></svg-icon>
                  </span>
                </div>
                <div class="sort-order">
                  <span class="sort">排序方式</span>
                  <el-select v-model="doneSel" placeholder="截止日期" size="mini">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="content">
                  <span class="task-show">无任何任务</span>
                </div>
              </div>
              <div class="fold-box" v-show="doneFold">
                <div style="height: 400px;">
                  <span class="task-vertical">Done</span>
                </div>
                <div style="height: 100px;">
                  <span class="svg-contain">
                    <svg-icon icon-class="eye" @click="doneUnFold=!doneUnFold;doneFold=!doneFold"></svg-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="task-board-right" id="task-board-right" v-show="flag">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="即将到来的日期" name="first">
                <div class="task-coming">
                  <span class="task-coming-show">无里程碑</span>
                </div>
              </el-tab-pane>
              <el-tab-pane label="动态" name="second">
                <div class="dynamic">
                  <!--              select选择器，选择类型，默认选择所有-->
                  <el-select
                    v-model="value3"
                    multiple
                    placeholder="任何类型"
                    size="mini"
                    collapse-tags
                    style="margin-left: 20px;"
                  >
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <!--              select选择器，选择时间，默认选择所有-->
                  <el-select
                    v-model="value4"
                    multiple
                    collapse-tags
                    style="margin-left: 20px;"
                    placeholder="任何时间"
                    size="mini"
                  >
                    <el-option
                      v-for="item in taskTime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务列表" style="height: 500px">
        <div class="task-list"></div>
        <div class="task-list-top">
          <span class="sort">排序方式</span>
          <!--             select选择器，任务列表中选择任务列表的排序方式 -->
          <el-select v-model="taskListSortSel" placeholder="截止日期" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--              select选择器，任务列表中选择项目，默认选择所有-->
          <el-select
            v-model="taskListProgramSel"
            multiple
            placeholder="任何项目"
            size="mini"
            collapse-tags
            style="margin-left: 20px;"
          >
            <el-option
              v-for="item in taskList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--              select选择器，任务列表中选择任务完成进度，默认选择所有-->
          <el-select
            v-model="taskListProgressSel"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="任何备注"
            size="mini"
          >
            <el-option
              v-for="item in taskProgress"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-checkbox v-model="checked">显示已完成/锁定的项目</el-checkbox>
        </div>
        <div class="task-list-body"></div>
      </el-tab-pane>
      <el-tab-pane label="时间表" style="height: 500px"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryMyTask } from "@/api/task";
export default {
  data() {
    return {
      myTaskList:[],
      //任务是循环出来的
      taskList: [
        {
          value: "1",
          label: "任何项目"
        }
      ],
      //任务是否完成是固定的选项
      taskProgress: [
        {
          value: "1",
          label: "任何备注"
        },
        {
          value: "2",
          label: "已完成"
        },
        {
          value: "3",
          label: "未完成"
        }
      ],
      //选择类型的固定选项
      typeList: [
        {
          value: "1",
          label: "任何类型"
        },
        {
          value: "2",
          label: "备注"
        },
        {
          value: "3",
          label: "资产上传"
        },
        {
          value: "4",
          label: "状态更改"
        },
        {
          value: "5",
          label: "任务分配"
        }
      ],
      //任务时间的固定选项
      taskTime: [
        {
          value: "1",
          label: "昨天"
        },
        {
          value: "2",
          label: "上星期"
        },
        {
          value: "3",
          label: "最近一个月"
        }
      ],
      //排序方式选择
      options: [
        {
          value: "1",
          label: "截止时间"
        },
        {
          value: "2",
          label: "项目"
        },
        {
          value: "3",
          label: "状态"
        },
        {
          value: "4",
          label: "父级"
        },
        {
          value: "5",
          label: "优先级"
        }
      ],
      //选择项目的返回值，根据这个值筛选展示出的任务
      value1: [],
      //选择是否完成的返回值，根据这个值筛选展示出的任务
      value2: [],
      //选择任务类型的返回值
      value3: [],
      //选择任务时间的返回值
      value4: [],
      //可用任务排序方式的选择返回
      taskAvailableSel: [],
      //not started 排序方式的选择返回
      notStartedSel: [],
      //in progress 排序方式的选择返回
      inProgressSel: [],
      //done 排序方式的选择返回
      doneSel: [],
      //任务显示展开
      taskAvailableFold: false,
      notStartedFold: false,
      inProgressFold: false,
      doneFold: false,
      //任务显示未展开
      taskAvailableUnFold: true,
      notStartedUnFold: true,
      inProgressUnFold: true,
      doneUnFold: true,
      //右侧标签页默认选项,动态
      activeName: "second",
      //右侧标签页是否显示的标志
      flag: true,
      //任务列表的排序方式的返回
      taskListSortSel: [],
      //任务列表中选择项目的返回
      taskListProgramSel: [],
      //任务列表中选择完成进度的返回
      taskListProgressSel: [],
      //复选框，显示已完成/锁定的项目
      checked: false
    };
  },
  methods: {
    //任务板右侧标签页事件
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //是否显示任务板右侧
    taskBoardRightShow() {
      if (this.flag) {
        this.flag = !this.flag;
        document.getElementById("task-board-left").style.width = 100 + "%";
        document.getElementById("task-board-right").style.width = 0 + "%";
      } else {
        this.flag = !this.flag;
        document.getElementById("task-board-left").style.width = 70 + "%";
        document.getElementById("task-board-right").style.width = 30 + "%";
      }
    },
    getMyTasks(){
      console.log({
        user:this.$store.state.login.userInfo
      });
      
      queryMyTask({
        user:this.$store.state.login.userInfo.id
      }).then(({data})=>{
        this.myTaskList = [...data.msg]
      })
    }
  },
  computed: {},
  created(){
    this.getMyTasks()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped src="./task.scss"></style>
