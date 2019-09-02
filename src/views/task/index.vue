<template>
  <div id="layout_main">
    <div class="layout_main_top">
    <div class="layout_main_top_left">
      <div class="layout_task" v-for="(item,index) of topArr" :key="index">
        <h3>{{item.num}}</h3>
        <span @click="task(item.status)" class="layout_top_span">{{item.title}}</span>
      </div>
    </div>
  </div>
    <el-divider></el-divider>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="任务板" name="first" class="tab-task">
        <div>
          <!-- <div>
            <span class="svg-container" title="显示小型网格布局">
              <svg-icon icon-class="list_min"></svg-icon>
            </span>
            <span class="svg-container" title="大型网格布局">
              <svg-icon icon-class="list_max"></svg-icon>
            </span>
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
          </div>-->
          <el-row type="flex" justify="space-between" :gutter="15">
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">未开始</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value+item.label"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  v-model="DraftArr"
                  :group="{name:'task'}"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="DraftArr"
                  class="board-column-content"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="item of DraftArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#808695',color:'#fff',padding:'15px'}"
                  >{{item.name}}</el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">进行中</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value+item.label"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  v-model="InProgressArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="InProgressArr"
                  class="board-column-content"
                >
                  <!-- ($event,1) -->

                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="item of InProgressArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#19be6b',color:'#fff',padding:'15px'}"
                  >{{item.name}}</el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">完成</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="FinishedArr"
                  group="task"
                  :sort="false"
                  :move="checkMove"
                  @end="handelChanged"
                  data-arr="FinishedArr"
                >
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of FinishedArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#2d8cf0',color:'#fff',padding:'15px'}"
                  >{{item.name}}</el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">超时</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="TimeOutArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="TimeOutArr"
                >
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of TimeOutArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#ed4014',color:'#fff',padding:'15px'}"
                  >{{item.name}}</el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">暂停</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="PauseArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="PauseArr"
                >
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of PauseArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#ff9900',color:'#fff',padding:'15px'}"
                  >{{item.name}}</el-card>
                </draggable>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务列表" name="second" class="tab-task">
        <Drawer scrollable
          v-model="isDrawerShow"
          width="512px"
          inner
          :mask-style="{backgroundColor: 'transparent'}"
          :transfer="false"
          draggable
        >
          <el-tabs>
            <el-tab-pane label="执行记录" lazy>
              <tabLog :loglist="LogList" :logsLoading="logsLoading" />
            </el-tab-pane>
            <el-tab-pane label="执行任务" lazy>
              <task-form
                :task-record.sync="TaskRecord"
                :createLoading="createLoading"
                @addRecord="addRecord"
                @cancel="cancel"
              />
            </el-tab-pane>
            <el-tab-pane label="任务详情" lazy>
              <tabTaskDtail :taskdetail="TaskDetail" :detailLoading="detailLoading" />
            </el-tab-pane>
            <el-tab-pane label="备注" lazy>222</el-tab-pane>
          </el-tabs>
        </Drawer>
        <!-- <div class="task-list"></div> -->
        <!-- <div class="task-list-top">
          <span class="sort">排序方式</span>
          <el-select v-model="taskListSortSel" placeholder="截止日期" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        </div>-->

        <el-table
          :data="MyTaskList1"
          highlight-current-row
          borders
          @row-click="taskBoardRightShow"
          border

        >
          <el-table-column type="index" label="序号" align="left" width="80"></el-table-column>
          <el-table-column prop="task.id" label="任务ID" header-align="left" width="80"></el-table-column>
          <el-table-column  label="项目" header-align="left">
             <template slot-scope="scope">
               <router-link :to="`/projects/project-detail/${scope.row.project.id}`">{{scope.row.project.name}}</router-link>
             </template> 
          </el-table-column>
          <el-table-column prop="asset.name" label="镜头" header-align="left"></el-table-column>
          <el-table-column prop="task.name" header-align="left" label="任务名称"></el-table-column>
          <el-table-column prop="task.content" header-align="left" label="任务内容"></el-table-column>
          <el-table-column label="任务状态" header-align="left">
            <template slot-scope="scope">
              <el-select
                :value="scope.row.task.status"
                placeholder="请选择"
                @change="statusChange($event,scope.row)"
                class="my-select"
              >
                <el-option
                  v-for="item in StatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="优先级" header-align="left">
            <template slot-scope="scope">{{scope.row.task.priority|Priority}}</template>
          </el-table-column>
          
          <el-table-column label="创建日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
          </el-table-column>
          <el-table-column label="开始日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column  label="截止日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hour" header-align="left" label="预设时间（小时）"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="任务执行" :visible.sync="isDialogShow" width="512px" center :modal="false">
      <task-form
        :task-record.sync="TaskRecord"
        :createLoading="createLoading"
        @addRecord="addRecord"
        @cancel="cancel"
      />
    </el-dialog>
  </div>
</template>

<script src="./task.js">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" src="./task.scss"></style>
