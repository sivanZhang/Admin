<template>
  <div id="task" ref="drawer-parent">
    <div>
      <el-row>
        <el-col :span="13">
          <template v-if="authTask">
            <el-button type="primary" icon="el-icon-plus" @click.native="mainTask">创建任务</el-button>
            <!-- <el-button icon="el-icon-download" type="primary">导入</el-button> -->
            <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
            <el-button
              type="success"
              @click="mulEditTasks(1)"
              icon="el-icon-edit"
              :disabled="this.multipleSelection.length === 0"
            >批量修改</el-button>
            <el-button
              type="danger"
              @click="deleteTask"
              icon="el-icon-delete"
              :disabled="this.multipleSelection.length === 0"
            >批量删除</el-button>
          </template>
          <el-popover placement="bottom" width="300" trigger="click" style="margin-left:15px">
            <el-col :span="12">
              <el-checkbox v-model="show_name">任务</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_link_dept_name">制作环节</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_content">制作内容</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_project_name">所属项目</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_project_image">缩略图</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_asset_name">镜头号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_priority">优先级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_grade">难度等级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_status">状态</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_name">创建者</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_executor">执行人</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_schedule">任务进度</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_create_time">创建日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_start_date">开始日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_end_date">截止日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_total_hour">预设时间（小时）</el-checkbox>
            </el-col>
            <el-button slot="reference" type="primary" icon="el-icon-setting" size="mini">展示列</el-button>
          </el-popover>
        </el-col>
        <el-col :span="11" style="text-align:right">
          <div style="display:flex;justify-content:flex-end;text-align:bottom">
            <el-select
              v-model="colSel"
              placeholder="请选择"
              style="width:130px"
              filterable
              size="mini"
            >
              <el-option
                v-for="item in columnSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-if="colShow"
              placeholder="输入关键字搜索"
              v-model="keyword"
              size="mini"
              @keyup.enter.native="getTasks()"
              style="width:300px"
            ></el-input>
            <el-select
              v-if="colSel === 'status' || colSel === 'grade'||colSel === 'priority'"
              v-model="colSel2"
              placeholder="请选择"
              style="width:300px;margin-top:1px"
              multiple
              filterable
              @keyup.enter.native="getTasks()"
              size="mini"
            >
              <el-option
                v-for="item in columnSelect2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div
              v-if="colSel === 'start_date' || colSel === 'end_date'"
              style="width:280px;display:flex;"
            >
              <el-date-picker v-model="timeSelection" type="date" placeholder="选择日期" size="mini"></el-date-picker>
              <span style="text-align:center;padding-top:3px">至</span>
              <el-date-picker v-model="timeSelection2" type="date" placeholder="选择日期" size="mini"></el-date-picker>
            </div>
            <el-button
              @click="getTasks()"
              size="mini"
              icon="el-icon-search"
              type="primary"
              style="height:27.99px"
            />
            <el-tooltip class="item" effect="dark" content="多条件筛选" placement="top">
              <el-popover v-model="visible2" placement="bottom" width="600" trigger="click">
                <el-form ref="sortSelForm" :model="sortSelForm" label-width="80px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="任务" prop="name">
                        <el-input v-model="sortSelForm.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="制作环节" prop="dept">
                        <el-input v-model="sortSelForm.dept"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="制作内容" prop="content">
                        <el-input v-model="sortSelForm.content"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="创建人" prop="user">
                        <el-input v-model="sortSelForm.user"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="优先级" prop="priority">
                        <el-select v-model="sortSelForm.priority" multiple placeholder="请选择">
                          <el-option label="低级" :value="0"></el-option>
                          <el-option label="中级" :value="1"></el-option>
                          <el-option label="高级" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="任务难度" prop="grade">
                        <el-select v-model="sortSelForm.grade" multiple placeholder="请选择">
                          <el-option label="简单" :value="0"></el-option>
                          <el-option label="标准" :value="1"></el-option>
                          <el-option label="困难" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="状态" prop="status">
                        <el-select v-model="sortSelForm.status" multiple placeholder="请选择">
                          <el-option label="暂停" :value="0"></el-option>
                          <el-option label="未开始" :value="1"></el-option>
                          <el-option label="进行中" :value="2"></el-option>
                          <el-option label="审核中" :value="3"></el-option>
                          <el-option label="完成" :value="4"></el-option>
                          <el-option label="超时" :value="5"></el-option>
                          <el-option label="审核通过" :value="6"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="总工时" prop="total_hour">
                        <el-input v-model="sortSelForm.total_hour"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="开始日期" prop="start">
                      <div style="display:flex">
                        <el-col :span="11">
                          <el-date-picker v-model="sortSelForm.start" type="date"></el-date-picker>
                        </el-col>
                        <el-col :span="2" align="center">
                          <span style="padding-top:3px">至</span>
                        </el-col>
                        <el-col :span="11" align="right">
                          <el-date-picker v-model="sortSelForm.start2" type="date"></el-date-picker>
                        </el-col>
                      </div>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="结束日期" prop="end">
                      <div style="display:flex">
                        <el-col :span="11">
                          <el-date-picker v-model="sortSelForm.end" type="date"></el-date-picker>
                        </el-col>
                        <el-col :span="2" align="center">
                          <span style="padding-top:3px">至</span>
                        </el-col>
                        <el-col :span="11" align="right">
                          <el-date-picker v-model="sortSelForm.end2" type="date"></el-date-picker>
                        </el-col>
                      </div>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col align="right">
                      <el-button type="primary" @click="MulSel()">筛选</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <el-button
                  slot="reference"
                  type="primary"
                  style="margin-left: 15px"
                  size="mini"
                  @click="showMul()"
                >筛选</el-button>
              </el-popover>
            </el-tooltip>
            <el-button @click="getTasks(1)" style="margin-left: 15px" type="primary" size="mini">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="mulChoose">
        <div
          style="display:flex;padding-top:10px;overflow-x:auto;height:45px"
          class="tags-view-container"
        >
          <label for style="width:80px">筛选条件：</label>
          <scroll-pane class="tags-view-wrapper">
            <div
              class="tags-view-item"
              :class="showMulChoose.name?'active':''"
              v-if="showMulChoose.name&&selShowName"
            >
              任务：{{showMulChoose.name}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('name')"
              />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.dept&&selShowDept"
              :class="showMulChoose.dept?'active':''"
            >
              制作环节：{{showMulChoose.dept}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('dept')"
              />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.content&&selShowContent"
              :class="showMulChoose.content?'active':''"
            >
              制作内容：{{showMulChoose.content}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('content')"
              />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.user&&selShowUser"
              :class="showMulChoose.user?'active':''"
            >
              创建人：{{showMulChoose.user}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('user')"
              />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.priority&&selShowPriority"
              :class="showMulChoose.priority?'active':''"
            >
              优先级：
              <span v-for="(item,index) of showMulChoose.priority" :key="index">
                <span style="margin-left:5px">{{item|taskPriority}}</span>
              </span>
              <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('priority')" />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.grade&&selShowGrade"
              :class="showMulChoose.grade?'active':''"
            >
              任务难度：
              <span v-for="(item,index) of showMulChoose.grade" :key="index">
                <span style="padding-left:5px">{{item|taskgrade}}</span>
              </span>
              <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('grade')" />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.status&&selShowStatus"
              :class="showMulChoose.status?'active':''"
            >
              状态：
              <span v-for="(item,index) of showMulChoose.status" :key="index">
                <span style="padding-left:5px">{{item|taskStatus}}</span>
              </span>
              <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('status')" />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.total_hour&&selTolHour"
              :class="showMulChoose.user?'active':''"
            >
              总工时：{{showMulChoose.total_hour}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('total_hour')"
              />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.start&&selStart"
              :class="showMulChoose.user?'active':''"
            >
              开始日期：{{showMulChoose.start}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('start')"
              />
            </div>
            <div
              class="tags-view-item"
              v-if="showMulChoose.end&&selEnd"
              :class="showMulChoose.end?'active':''"
            >
              结束日期：{{showMulChoose.end}}
              <span
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag('end')"
              />
            </div>
          </scroll-pane>
          <el-tag v-if="showMulChoose.start" style="margin-left:10px"></el-tag>
          <el-tag v-if="showMulChoose.end" style="margin-left:10px"></el-tag>
        </div>
      </el-row>
      <el-table
        :data="TaskList"
        style="margin-top:15px;width:100%"
        highlight-current-row
        :tree-props="{ children: 'sub_task' }"
        @current-change="rowSelected"
        @selection-change="handleSelectionChange"
        :stripe="true"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        :cell-style="cellStyle"
        border
        :row-key="row=>row.id"
        v-loading="tableLoading"
        @filter-change="filterHandler"
        @sort-change="sortFilter"
      >
        <!-- default-expand-all -->
        <el-table-column type="selection" :reserve-selection="true" width="55px"></el-table-column>
        <el-table-column label="任务ID" class-name="links" prop="id" width="100px" sortable="custom">
          <template slot-scope="scope">
            <span @click="showDrawer(scope.row)">{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" v-if="show_project_image">
          <template slot-scope="scope" v-if="!scope.row.pid">
            <el-image
              :src="$store.state.BASE_URL+scope.row.asset.image"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
              style="width: 48px;height: 27px;"
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
        <el-table-column
          prop="name"
          label="任务"
          show-overflow-tooltip
          v-if="show_name"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="制作环节"
          prop="dept"
          sortable="custom"
          show-overflow-tooltip
          v-if="show_link_dept_name"
          width="100px"
        >
          <template slot-scope="scope">{{scope.row.link_dept_name}}</template>
        </el-table-column>
        <el-table-column label="制作内容" prop="content" show-overflow-tooltip v-if="show_content"></el-table-column>

        <el-table-column
          label="镜头号"
          show-overflow-tooltip
          v-if="show_asset_name"
          prop="asset"
          sortable="custom"
          width="90pxs"
        >
          <template slot-scope="scope">{{scope.row.asset.name}}</template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          :formatter="Priority"
          v-if="show_priority"
          width="120px"
          sortable="custom"
          align="center"
          column-key="priority"
          :filters="[{text: '低级', value: '0'}, {text: '中级', value: '1'}, {text: '高级', value: '2'}]"
        >
          <template slot-scope="scope">
            <div
              style="backgroundColor:#C64b2b;color:#FFF"
              v-if="scope.row.priority === 2"
            >{{scope.row.priority|taskPriority}}</div>
            <div style="backgroundColor:'transparent'" v-else>{{scope.row.priority|taskPriority}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="grade"
          label="难度等级"
          :formatter="Grade"
          v-if="show_grade"
          width="120px"
          sortable="custom"
          align="center"
          column-key="grade"
          :filters="[{text: '简单', value: '0'}, {text: '标准', value: '1'}, {text: '困难', value: '2'}]"
        >
          <template slot-scope="scope">
            <div
              style="backgroundColor:#C64b2b;color:#FFF"
              v-if="scope.row.grade === 2"
            >{{scope.row.grade|taskgrade}}</div>
            <div style="backgroundColor:'transparent'" v-else>{{scope.row.grade|taskgrade}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          v-if="show_status"
          width="90px"
          align="left"
          sortable="custom"
          column-key="status"
          :filters="[{text: '暂停', value: '0'}, {text: '未开始', value: '1'}, {text: '进行中', value: '2'}, {text: '审核中', value: '3'}, {text: '完成', value: '4'}, {text: '超时', value: '5'}, {text: '审核通过', value: '6'}]"
        >
          <template slot-scope="scope">{{scope.row.status|taskStatus}}</template>
        </el-table-column>
        <el-table-column label="创建者" v-if="show_creator_name" prop="user" link_dept_name>
          <template slot-scope="scope">{{scope.row.creator.name}}</template>
        </el-table-column>
        <el-table-column label="执行人" show-overflow-tooltip v-if="show_executor">
          <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
        </el-table-column>
        <el-table-column
          label="任务进度"
          width="100px"
          align="center"
          v-if="show_schedule"
          prop="schedule"
        >
          <template slot-scope="scope">{{scope.row.schedule}}%</template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          width="100px"
          v-if="show_create_time"
          prop="date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="开始日期"
          width="100px"
          v-if="show_start_date"
          prop="start_date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="截止日期"
          width="100px"
          v-if="show_end_date"
          prop="end_date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          prop="total_hour"
          align="center"
          label="预设时间（小时）"
          width="130px"
          v-if="show_total_hour"
        ></el-table-column>
        <el-table-column label="操作" align="center" v-if="authTask">
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
          style="margin-top:10px"
        ></el-pagination>
      </div>
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
            <el-select
              v-model="TaskForm.asset"
              filterable
              placeholder="请选择所属资产"
              @change="changeAsset()"
            >
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
          <template v-if="$route.query.type == 0">
            <el-form-item label="执行小组" prop="group_id">
              <el-select v-model="TaskForm.group_id" filterable placeholder="请选择分组">
                <el-option
                  v-for="(item,index) of trainingMenber"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
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
          </template>
          <el-form-item label="环节时间">
            <el-row style="padding-left:10px;font-size: 12px;">
              <el-col :span="5">{{linkstart|dateFormat}}</el-col>
              <el-col :span="2">
                <span>至</span>
              </el-col>
              <el-col :span="17">{{linkend|dateFormat}}</el-col>
            </el-row>
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
        :disabled="(active==1&&LinkList.length===0)||active==0&&!this.TaskForm.asset||active==1&&!this.TaskForm.link_id"
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
              v-for="item of StatusList2"
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

        <el-form-item label="所属资产" prop="asset">
          <el-select v-model="TaskForm.asset" filterable placeholder="请选择所属资产">
            <el-option
              v-for="item of AssetList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              :disabled="DialogType===2||!TaskForm.asset"
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
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="editTask"
          >{{DialogType===3?'立即修改':'立即创建'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建任务时，所选资产无环节时，创建环节 -->
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
              <el-input
                type="textarea"
                v-model="item.content"
                style="width:100%"
                @input="change($event)"
              ></el-input>
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
    <!-- 任务导出 -->
    <el-dialog title="Excel文件导出" :visible.sync="uploadVisible" width="400px" hieght="300px">
      <el-row>
        <el-col :span="6">
          <span>excel文件</span>
        </el-col>
        <el-col :span="18">
          <span @click="download" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
    <!-- 批量修改任务 -->
    <el-dialog title="批量修改任务" :visible.sync="mulEditDialog" width="620px" center :modal="false">
      <el-form :model="updateMulTask" label-width="90px">
        <el-row>
          <el-col :span="6" align="center">
            <h4 style="padding-bottom:10px">是否修改</h4>
          </el-col>
          <el-col :span="18" align="center"></el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value1"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="updateMulTask.name" placeholder="请填写任务名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value2"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务内容" prop="content">
              <el-input v-model="updateMulTask.content" type="textarea" placeholder="请填写任务内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value3"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="优先级" prop="priority">
              <el-radio v-model="updateMulTask.priority" :label="0">低级</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="1">中级</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="2">高级</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value4"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务难度" prop="grade">
              <el-radio v-model="updateMulTask.grade" :label="0">简单</el-radio>
              <el-radio v-model="updateMulTask.grade" :label="1">标准</el-radio>
              <el-radio v-model="updateMulTask.grade" :label="2">困难</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value5"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="updateMulTask.status" filterable placeholder="请选择任务状态">
                <el-option
                  v-for="item of StatusList2"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value6"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务执行人" prop="executorlist">
              <el-select
                v-model="updateMulTask.executorlist"
                filterable
                multiple
                placeholder="请选择任务执行人"
              >
                <el-option
                  v-for="item of UserList"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value7"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务时间" prop="datetime">
              <el-date-picker
                v-model="updateMulTask.datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                @change="changeTime2()"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value8"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="总工时" prop="total_hour">
              <el-input
                v-model="updateMulTask.total_hour"
                oninput="value=value.replace(/[^\d.]/g,'')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="right">
            <el-button type="primary" @click="mulEditTasks(2)">立即修改</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <Drawer
      title="任务"
      scrollable
      closable
      v-model="showdrawer"
      width="526"
      :inner="isInner"
      :transfer="false"
      :mask="false"
      draggable
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="审批记录" name="first">
          <approve-log ref="approvelogs" />
        </el-tab-pane>
        <el-tab-pane label="自定义属性" name="second">
          <attrsBind
            :project="project"
            :customAttrs="customAttrs"
            :attrsList="attrsList"
            @refresh_customAttrs="NewcustomAttrs"
            :attrsTypeNum="attrsTypeNum"
          />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>
<script>
import * as HTTP from "@/api/task";
import { Transform } from "stream";
import myMixin from "./mixins";
import { mapState } from "vuex";
import { getDeptUsers } from "@/api/admin";
import { queryAssets } from "@/api/assets";
import { getLinks, getLink, addLinks } from "@/api/links";
import approveLog from "@/views/components/approve-log";
import attrsBind from "@/components/projectDrawer/components/attrsBind";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { searchBind, getAttrsEntityList } from "@/api/attrs";
import { getProjectJoinMeb } from "@/api/training";
import dayjs from "dayjs";
import ScrollPane from "@/layout/components/TagsView/ScrollPane";
export default {
  mixins: [myMixin, thumbtackMixin],
  name: "tab-task",
  data() {
    return {
      selShowName: true,
      selShowDept: true,
      selShowContent: true,
      selShowUser: true,
      selShowPriority: true,
      selShowGrade: true,
      selShowStatus: true,
      selTolHour: true,
      selStart: true,
      selEnd: true,
      authTask: null,
      uploadVisible: false,
      activeTab: "first",
      tableLoading: false, //表格加载状态
      total: 0,
      pageCount: 0,
      TaskList: [],
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
      path: null,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 50, 100],
      showdrawer: false,
      show_name: true,
      show_link_dept_name: true,
      show_content: true,
      show_project_name: true,
      show_project_image: true,
      show_asset_name: true,
      show_priority: true,
      show_grade: true,
      show_status: true,
      show_executor: true,
      show_creator_name: false,
      show_create_time: true,
      show_start_date: true,
      show_end_date: true,
      show_total_hour: true,
      show_schedule: true,
      filterStatus: [],
      filterPriority: [],
      filterGrade: [],
      sort: null,
      propName: null,
      sortFunction: null,
      Assetcontent: null,
      datacontent: null,
      columnSelect: [
        {
          value: "name",
          label: "任务"
        },
        {
          value: "dept",
          label: "制作环节"
        },
        {
          value: "content",
          label: "制作内容"
        },
        {
          value: "priority",
          label: "优先级"
        },
        {
          value: "grade",
          label: "任务难度"
        },
        {
          value: "user",
          label: "创建人"
        },
        {
          value: "status",
          label: "状态"
        },
        {
          value: "start_date",
          label: "开始日期"
        },
        {
          value: "end_date",
          label: "结束日期"
        },
        {
          value: "total_hour",
          label: "总工时"
        }
      ],
      colSel: "name",
      colShow: true,
      chooseSel: false,
      multiSelect: [],
      name: "",
      columnSelect2: [],
      colSel2: [],
      timeSel: false,
      timeSelection: "",
      timeSelection2: "",
      visible2: false,
      sortSelForm: {},
      linkstart: null,
      linkend: null,
      activeName: "first",
      project: null,
      attrsList: [],
      customAttrs: [],
      attrsTypeNum: null,
      trainingMenber: [],
      mulEditDialog: false,
      updateMulTask: {},
      value1: "否",
      value2: "否",
      value3: "否",
      value4: "否",
      value5: "否",
      value6: "否",
      value7: "否",
      value8: "否",
      showMulChoose: [],
      mulChoose: false
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
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  components: {
    approveLog,
    attrsBind,
    ScrollPane
  },
  props: {
    AssetList: {
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
            const linktime = this.LinkList[0].date_and_user;
            this.linkstart = linktime.date_start;
            this.linkend = linktime.date_end;
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
          });
        } else {
          return;
        }
      }
    },
    colSel: {
      handler: function(newVal, oldVal) {
        //console.log(newVal);
        switch (newVal) {
          case "status":
            this.colShow = false;
            // console.log(this.colShow, this.chooseSel);
            this.colSel2 = [1];
            this.columnSelect2 = [
              {
                value: 0,
                label: "暂停"
              },
              {
                value: 1,
                label: "未开始"
              },
              {
                value: 2,
                label: "进行中"
              },
              {
                value: 3,
                label: "审核中"
              },
              {
                value: 4,
                label: "完成"
              },
              {
                value: 5,
                label: "超时"
              },
              {
                value: 6,
                label: "审核通过"
              }
            ];
            break;
          case "grade":
            this.colShow = false;
            this.colSel2 = [1];
            this.columnSelect2 = [
              {
                value: 0,
                label: "简单"
              },
              {
                value: 1,
                label: "标准"
              },
              {
                value: 2,
                label: "困难"
              }
            ];
            break;
          case "priority":
            this.colShow = false;
            this.colSel2 = [0];
            this.columnSelect2 = [
              {
                value: 0,
                label: "低级"
              },
              {
                value: 1,
                label: "中级"
              },
              {
                value: 2,
                label: "高级"
              },
              {
                value: 3,
                label: "高难度"
              }
            ];
            break;
          case "start_date" || "end_date":
            this.colShow = false;
            this.timeSelection = "";
            this.timeSelection2 = "";
            break;
          case "end_date":
            this.colShow = false;
            this.timeSelection = "";
            this.timeSelection2 = "";
            break;
          default:
            this.colShow = true;
            this.colSel2 = [];
            this.columnSelect2 = [];
        }
      }
    }
  },
  methods: {
    //删除筛选条件，剩余条件再搜索
    closeSelectedTag(tag) {
      switch (tag) {
        case "name":
          delete this.sortSelForm.name;
          this.selShowName = false;
          break;
        case "dept":
          delete this.sortSelForm.dept;
          this.selShowDept = false;
          break;
        case "content":
          delete this.sortSelForm.content;
          this.selShowContent = false;
          break;
        case "user":
          delete this.sortSelForm.user;
          this.selShowUser = false;
          break;
        case "priority":
          delete this.sortSelForm.priority;
          this.selShowPriority = false;
          break;
        case "grade":
          delete this.sortSelForm.grade;
          this.selShowGrade = false;
          break;
        case "status":
          delete this.sortSelForm.status;
          this.selShowStatus = false;
          break;
        case "total_hour":
          delete this.sortSelForm.total_hour;
          this.selTolHour = false;
          break;
        case "start":
          delete this.sortSelForm.start;
          this.selStart = false;
          break;
        case "end":
          delete this.sortSelForm.end;
          this.selEnd = false;
          break;
      }

      let data = {
        ...this.sortSelForm,
        project: this.$route.params.id,
        pagenum: 20,
        page: 1
      };
      this.multiSelect = this.sortSelForm;
      this.tableLoading = true;

      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
            this.visible2 = false;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
          this.visible2 = false;
        });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "grade") {
        switch (row.grade) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return { borderRight: 0 };
    },
    //批量修改任务
    mulEditTasks(Type) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      if (Type === 1) {
        this.mulEditDialog = true;
      } else {
        let keys = [{}];
        if (this.value1 == "是") {
          keys = [...keys, { key: "name", value: this.updateMulTask.name }];
        }
        if (this.value2 == "是") {
          keys = [
            ...keys,
            { key: "content", value: this.updateMulTask.content }
          ];
        }
        if (this.value3 == "是") {
          keys = [
            ...keys,
            { key: "priority", value: this.updateMulTask.priority }
          ];
        }
        if (this.value4 == "是") {
          keys = [...keys, { key: "grade", value: this.updateMulTask.grade }];
        }
        if (this.value5 == "是") {
          keys = [...keys, { key: "status", value: this.updateMulTask.status }];
        }
        if (this.value6 == "是") {
          keys = [
            ...keys,
            {
              key: "executorlist",
              value: this.updateMulTask.executorlist.join()
            }
          ];
        }
        if (this.value7 == "是") {
          keys = [
            ...keys,
            {
              key: "start_date",
              value: dataFormat(this.updateMulTask.datetime[0])
            },
            {
              key: "end_date",
              value: dataFormat(this.updateMulTask.datetime[1])
            }
          ];
        }
        if (this.value8 == "是") {
          keys = [
            ...keys,
            { key: "total_hour", value: this.updateMulTask.total_hour }
          ];
        }
        let data = {
          method: "put",
          ids: this.multipleSelection.map(item => item.id).join(","),
          keys:
            "{" +
            keys.map((t, i) => {
              return `"${t.key}":"${t.value}"`;
            }) +
            "}"
        };
        HTTP.mulPutTasks(data).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.mulEditDialog = false;
            this.getTasks();
          } else {
            this.$message.error(data.msg);
          }
        });
        // console.log(data);
        // console.log(keys);
      }
    },
    //获取实训分组
    getTeam() {
      getProjectJoinMeb({ id: this.$route.params.id, users: "users" }).then(
        ({ data }) => {
          this.trainingMenber = [...data.msg];
          // console.log(this.trainingMenber);
        }
      );
    },
    //任务导出dialog
    targetUpload() {
      let data = {
        ...this.name,
        ...this.multiSelect,
        project: this.$route.params.id,
        print: "null"
      };
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.uploadVisible = true;
            this.path = data.path;
            this.multiSelect = [];
            this.name = [];
          }
        })
        .catch(err => {
          this.$message.error(data.msg);
          // this.uploadVisible = true;
          this.multiSelect = [];
          this.name = [];
        });
    },
    //导出Excel
    download() {
      let data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      //  this.download();
      this.uploadVisible = false;
    },
    showMul() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
      this.selShowName = true;
      this.selShowDept = true;
      this.selShowContent = true;
      this.selShowUser = true;
      this.selShowPriority = true;
      this.selShowGrade = true;
      this.selShowStatus = true;
      this.selTolHour = true;
      this.selStart = true;
      this.selEnd = true;
    },
    //多条件筛选
    MulSel() {
      this.mulChoose = true;
      this.visible2 = false;
      function dateFormat(dateVal) {
        return new dayjs(dateVal).format("YYYY/MM/DD");
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.sortSelForm.name) {
        this.showMulChoose.name = this.sortSelForm.name;
      }
      if (this.sortSelForm.dept) {
        this.showMulChoose.dept = this.sortSelForm.dept;
      }
      if (this.sortSelForm.content) {
        this.showMulChoose.content = this.sortSelForm.content;
      }
      if (this.sortSelForm.user) {
        this.showMulChoose.user = this.sortSelForm.user;
      }
      if (this.sortSelForm.total_hour) {
        this.showMulChoose.total_hour = this.sortSelForm.total_hour;
      }
      if (this.sortSelForm.grade) {
        if (this.sortSelForm.grade.length === 0) {
          delete this.sortSelForm.grade;
        } else {
          this.showMulChoose.grade = this.sortSelForm.grade;
          this.sortSelForm.grade = "[" + String(this.sortSelForm.grade) + "]";
        }
      }
      if (this.sortSelForm.priority) {
        if (this.sortSelForm.priority.length === 0) {
          delete this.sortSelForm.priority;
        } else {
          this.showMulChoose.priority = this.sortSelForm.priority;
          this.sortSelForm.priority =
            "[" + String(this.sortSelForm.priority) + "]";
        }
      }
      if (this.sortSelForm.status) {
        if (this.sortSelForm.status.length === 0) {
          delete this.sortSelForm.status;
        } else {
          this.showMulChoose.status = this.sortSelForm.status;
          this.sortSelForm.status = "[" + String(this.sortSelForm.status) + "]";
        }
      }
      if (this.sortSelForm.start || this.sortSelForm.start2) {
        if (this.sortSelForm.start && !this.sortSelForm.start2) {
          this.showMulChoose.start = dateFormat(this.sortSelForm.start);
          this.sortSelForm.start =
            dateFormat(this.sortSelForm.start) + "," + "";
        } else if (!this.sortSelForm.start && this.sortSelForm.start2) {
          this.showMulChoose.start = dateFormat(this.sortSelForm.start2);
          this.sortSelForm.start =
            "" + "," + dateFormat(this.sortSelForm.start2);
        } else {
          this.showMulChoose.start =
            dateFormat(this.sortSelForm.start) +
            "至" +
            dateFormat(this.sortSelForm.start2);
          this.sortSelForm.start =
            dateFormat(this.sortSelForm.start) +
            "," +
            dateFormat(this.sortSelForm.start2);
        }
        delete this.sortSelForm.start2;
      }
      if (this.sortSelForm.end || this.sortSelForm.end2) {
        if (this.sortSelForm.end && !this.sortSelForm.end2) {
          this.showMulChoose.end = dateFormat(this.sortSelForm.end);
          this.sortSelForm.end = dateFormat(this.sortSelForm.end) + "," + "";
        } else if (!this.sortSelForm.end && this.sortSelForm.end2) {
          this.showMulChoose.end = dateFormat(this.sortSelForm.end2);
          this.sortSelForm.end = "" + "," + dateFormat(this.sortSelForm.end2);
        } else {
          this.showMulChoose.end =
            dateFormat(this.sortSelForm.end) +
            "至" +
            dateFormat(this.sortSelForm.end2);
          this.sortSelForm.end =
            dateFormat(this.sortSelForm.end) +
            "," +
            dateFormat(this.sortSelForm.end2);
        }
        delete this.sortSelForm.end2;
      }
      let data = {
        ...this.sortSelForm,
        project: this.$route.params.id,
        pagenum: 20,
        page: 1
      };
      this.multiSelect = this.sortSelForm;
      this.tableLoading = true;

      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
            this.visible2 = false;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
          this.visible2 = false;
        });
    },
    changeAsset(val) {
      const data = this.AssetListTask.filter(item => {
        return item.id === this.TaskForm.asset;
      });
      this.TaskForm.name = data[0].name;
    },
    sortFilter({ column, prop, order }) {
      let data = {
        project: this.$route.params.id,
        pagenum: this.pageSize,
        page: this.currentPage,
        sort: order === "descending" ? "-" + prop : prop
      };
      //order === "descending" ? "-" + prop : prop
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    changeTime(val) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24);

      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour + 8
      };
    },
    changeTime2(val) {
      if (this.radio7 == "是") {
        this.radio8 = "是";
        const totalHour2 =
          (this.updateMulTask.datetime[1] - this.updateMulTask.datetime[0]) /
          (1000 * 3600 * 24);
        this.updateMulTask = {
          ...this.updateMulTask,
          total_hour: 8 * totalHour2
        };
      }
    },
    handleTabClick(tab, event) {
      //this.getRemarkList();
      //  console.log(tab, event);
    },
    showDrawer(item) {
      this.showdrawer = true;
      this.project = item;
      searchBind({ entity_type: 1 }).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: item.id, entity_type: 1 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 1;
        }
      );
      // console.log(item);
      this.$refs["approvelogs"].getApproveLog(item.id);
    },
    NewcustomAttrs() {
      getAttrsEntityList({ entity_id: this.project.id, entity_type: 1 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 1;
        }
      );
    },
    change() {
      this.$forceUpdate();
    },
    //创建环节时，前置
    before(ind) {
      this.FormList.splice(ind, 0, {});
      //  this.FormList[ind - 1].content=this.datacontent[0].content;
    },
    //创建环节时，后置
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
      this.FormList[ind + 1].content = this.datacontent[0].content;
    },
    //创建环节时，删除
    deleteLink(index) {
      if (index !== 0) this.FormList.splice(index, 1);
    },
    //资产环节为空时，可创建
    addLink(asset) {
      this.asset = asset;
      this.isLinkDialogShow = true;
      this.mainTaskShow = false;
      this.datacontent = this.AssetListTask.filter(item => {
        return item.id === this.asset;
      });
      this.FormList[0].content = this.datacontent[0].content;
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

      addLinks({ links: [...this.FormList] })
        .then(({ data }) => {
          this.createLoading = false;

          if (data.status === 0) {
            this.$message.success(data.msg);
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
          } else {
            this.$message.error(data.msg);
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
      // console.log(this.ActiveRow);
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
        // console.log(this.DeptUsers);
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
          this.$emit("getAssetList");
          if (!Object.keys(this.ActiveRow).length) {
            // console.log(this.ActiveRow);
            this.$message.error("请选择父任务");
            return false;
          }
          this.dialogTitle = `创建 ${this.ActiveRow.name} 的子任务`;

          this.TaskForm = {
            priority: 0,
            grade: 1,
            pid: this.ActiveRow.id,
            asset: this.ActiveRow.asset.id,
            datetime: [
              new Date(dateFormat(this.ActiveRow.start_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.start_date))
                : "",
              new Date(dateFormat(this.ActiveRow.end_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.end_date))
                : ""
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
          this.$emit("getAssetList");
          this.dialogTitle = "修改任务";
          this.TaskForm = {
            ...this.ActiveRow,
            datetime: [
              new Date(dateFormat(this.ActiveRow.start_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.start_date))
                : "",
              new Date(dateFormat(this.ActiveRow.end_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.end_date))
                : ""
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
            // console.log(data);
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
          if (this.$route.query.type == 0) {
            //console.log(this.TaskForm);
            let dataMulTask = {
              group_id: this.TaskForm.group_id,

              link_id: this.TaskForm.link_id,

              asset_id: this.TaskForm.asset,

              name: this.TaskForm.name,

              content: this.TaskForm.content,

              start_date: changeDateFormat(this.TaskForm.datetime[0]),
              end_date: changeDateFormat(this.TaskForm.datetime[1]),

              total_hour: this.TaskForm.total_hour,

              project_id: this.$route.params.id,

              status: this.TaskForm.status,

              priority: this.TaskForm.priority,

              grade: this.TaskForm.grade
            };
            //console.log(dataMulTask);
            HTTP.mulCreateTasks(dataMulTask)
              .then(({ data }) => {
                this.$message.success(data.msg);
                if (data.status === 0) {
                  this.mainTaskShow = false;
                  this.active = 0;
                  this.getTasks();
                  t;
                }
              })
              .catch(err => {});
          } else {
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
              } else {
                this.$message.error(data.msg);
              }
            });
          }
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
          HTTP.deleteTask({
            ids: ids,
            method: "delete"
          }).then(({ data }) => {
            this.$message.success(data.msg);
            if (data.status === 0) {
              this.getTasks();
            }
          });
        })
        .catch(() => {});
    },
    filterHandler(val) {
      if (val.status) {
        this.filterStatus = [];
        this.filterStatus = [...val.status];
        this.filterStatus.forEach((item, index) => {
          item = Number(item);
          this.filterStatus[index] = item;
        });
      }
      if (val.grade) {
        this.filterGrade = [];
        this.filterGrade = [...val.grade];
        this.filterGrade.forEach((item, index) => {
          item = Number(item);
          this.filterGrade[index] = item;
        });
      }
      if (val.priority) {
        this.filterPriority = [];
        this.filterPriority = [...val.priority];
        this.filterPriority.forEach((item, index) => {
          item = Number(item);
          this.filterPriority[index] = item;
        });
      }
      let data = {
        project: this.$route.params.id,
        pagenum: this.pageSize,
        page: this.currentPage
      };
      if (this.filterStatus.length) {
        data = { ...data, status: "[" + String(this.filterStatus) + "]" };
      }
      if (this.filterGrade.length) {
        data = { ...data, grade: "[" + String(this.filterGrade) + "]" };
      }
      if (this.filterPriority.length) {
        data = { ...data, priority: "[" + String(this.filterPriority) + "]" };
      }
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //获取任务列表
    getTasks(type) {
      function DateFormat(dateVal) {
        return dayjs(dateVal).format("YYYY/MM/DD");
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (type === 1) {
        this.keyword = "";
        this.colSel = "name";
        this.colSel2 = [];
        this.timeSelection = "";
        this.showMulChoose = {};
        this.mulChoose = false;
      }
      let data = {
        project: this.$route.params.id,
        pagenum: this.pageSize,
        page: this.currentPage
      };
      switch (this.colSel) {
        case "name":
          this.keyword &&
            (data = { ...data, name: this.keyword, page: 1, pagenum: 20 });
          this.name = { name: this.keyword };
          break;
        case "dept":
          this.keyword &&
            (data = { ...data, dept: this.keyword, page: 1, pagenum: 20 });
          this.name = { dept: this.keyword };
          break;
        case "content":
          this.keyword &&
            (data = { ...data, content: this.keyword, page: 1, pagenum: 20 });
          this.name = { content: this.keyword };
          break;
        case "user":
          this.keyword &&
            (data = { ...data, user: this.keyword, page: 1, pagenum: 20 });
          this.name = { user: this.keyword };
          break;
        case "total_hour":
          this.keyword &&
            (data = { ...data, content: this.keyword, page: 1, pagenum: 20 });
          this.name = { total_hour: this.keyword };
          break;
        case "start_date":
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              start: "" + "," + DateFormat(this.timeSelection2),
              page: 1,
              pagenum: 20
            };
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) + "," + "",
              page: 1,
              pagenum: 20
            };
          } else {
            data = {
              ...data,
              start:
                DateFormat(this.timeSelection) +
                "," +
                DateFormat(this.timeSelection2),
              page: 1,
              pagenum: 20
            };
          }

          this.name = {
            start_date: DateFormat(this.timeSelection)
          };
          break;
        case "end_date":
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              end: "" + "," + DateFormat(this.timeSelection2),
              page: 1,
              pagenum: 20
            };
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) + "," + "",
              page: 1,
              pagenum: 20
            };
          } else {
            data = {
              ...data,
              end:
                DateFormat(this.timeSelection) +
                "," +
                DateFormat(this.timeSelection2),
              page: 1,
              pagenum: 20
            };
          }
          this.name = { end_date: DateFormat(this.timeSelection) };
          break;
        case "priority":
          if (this.colSel2.length) {
            data = {
              ...data,
              priority: "[" + String(this.colSel2) + "]",
              page: 1,
              pagenum: 20
            };
            this.name = { priority: "[" + String(this.colSel2) + "]" };
          }
          break;
        case "status":
          if (this.colSel2.length) {
            data = {
              ...data,
              status: "[" + String(this.colSel2) + "]",
              page: 1,
              pagenum: 20
            };
            this.name = { status: "[" + String(this.colSel2) + "]" };
          }
          break;
        case "grade":
          if (this.colSel2.length) {
            data = {
              ...data,
              grade: "[" + String(this.colSel2) + "]",
              page: 1,
              pagenum: 20
            };
            this.name = { grade: "[" + String(this.colSel2) + "]" };
          }
          break;
      }

      this.tableLoading = true;
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            // console.log(this.authTask);
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTasks();
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
      this.getTasks();
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
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
    if (this.$route.query.type == 0) {
      this.getTeam();
      //console.log("train")
    }
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
<style lang="scss" scope>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<style lang="scss">
#task {
  min-height: calc(100vh - 199px);
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}

.el-switch__core {
  height: 15px;
  width: 33px !important;
}
.el-switch__core:after {
  top: -1px;
  left: -1px;
  margin-right: -10px;
  width: 14px;
  height: 14px;
  box-shadow: 1px 1px 1px black;
  background-color: white;
}
.el-switch__label * {
  line-height: 1;
  font-size: 10px;
  display: inline-block;
}
.el-switch.is-checked .el-switch__core::after {
  margin-left: -14px;
  box-shadow: 1px 1px 1px black;
  background-color: white;
}
</style>

