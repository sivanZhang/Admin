 <template>
  <el-table
    :cell-style="cellStyle"
    :data="outTaskLiist"
    highlight-current-row
    style="width: 100%;"
    :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
    :row-style="{height:50}"
  >
    <el-table-column type="index" label="序号" align="center"></el-table-column>
    <el-table-column label="项目">
      <template slot-scope="scope">
        <router-link
          style="cursor: pointer;"
          :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
        >{{scope.row.project.name}}</router-link>
      </template>
    </el-table-column>
    <el-table-column label="缩略图" width="180px">
      <template slot-scope="scope">
        <el-image
          :src="$store.state.BASE_URL+scope.row.asset.image"
          style="width: 180px;height: 100px;cursor: pointer; display:block;"
          :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
        >
          <div slot="placeholder" class="image-slot">
            加载中
            <span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <el-image :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"></el-image>
          </div>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="asset.name" label="镜头号"></el-table-column>
    <el-table-column prop="asset.episode" label="集数" width="60px"></el-table-column>
    <el-table-column prop="asset.session" label="场次" width="60px"></el-table-column>
    <el-table-column width="30px">
      <template slot-scope="scope">
        <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
          <el-card
            v-if="scope.row.status === 0"
            :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px',padding: '25px 5px'}"
          ></el-card>
        </el-tooltip>
        <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
          <el-card
            v-if="scope.row.status === 1"
            :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px',padding: '25px 5px'}"
          ></el-card>
        </el-tooltip>
        <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
          <el-card
            v-if="scope.row.status === 2"
            :style="{width:'10px',backgroundColor:'#589BAD',border:'0px',padding: '25px 5px'}"
          ></el-card>
        </el-tooltip>
        <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
          <el-card
            v-if="scope.row.status === 3"
            :style="{width:'10px',backgroundColor:'#2D5637',border:'0px',padding: '25px 5px'}"
          ></el-card>
        </el-tooltip>
        <el-tooltip effect="dark" content="任务状态：完成" placement="top">
          <el-card
            v-if="scope.row.status === 4"
            :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px',padding: '25px 5px'}"
          ></el-card>
        </el-tooltip>
        <el-tooltip effect="dark" content="任务状态：超时" placement="top">
          <el-card
            v-if="scope.row.status === 5"
            :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px',padding: '25px 5px'}"
          ></el-card>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      label="任务状态/进度"
      prop="status"
      width="140px"
      align="left"
      column-key="status"
      :filters="[{text: '暂停', value: '0'}, {text: '未开始', value: '1'}, {text: '进行中', value: '2'}, {text: '审核中', value: '3'}, {text: '完成', value: '4'}, {text: '超时', value: '5'}, {text: '审核通过', value: '6'}]"
    >
      <template slot-scope="scope">
        {{scope.row.status|taskStatus}}
        <el-progress
          :stroke-width="12"
          :percentage="scope.row.schedule"
          v-if="scope.row.status != 3 && scope.row.status != 4"
        ></el-progress>
        <div v-if="scope.row.status == 3">{{scope.row.statements}}</div>
      </template>
    </el-table-column>
    <el-table-column label="开始日期">
      <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
    </el-table-column>
    <el-table-column prop="total_hour" header-align="left" label="预设时间（小时）" width="80px;">
      <template slot-scope="scope">{{scope.row.total_hour}}</template>
    </el-table-column>
    <el-table-column label="提交次数" prop="submit_num"></el-table-column>
    <el-table-column label="难度" header-align="left" align="center" prop="grade">
      <template slot-scope="scope">{{scope.row.grade|taskgrade}}</template>
    </el-table-column>
    <el-table-column label="优先级" header-align="left" prop="priority">
      <template slot-scope="scope">{{scope.row.priority|taskPriority}}</template>
    </el-table-column>
    <!-- <el-table-column prop="link_dept" label="工种id"></el-table-column> -->
    <el-table-column prop="link_dept_name" label="工种名称"></el-table-column>
    <el-table-column prop="link_content" label="环节内容" width="50px;"></el-table-column>
  </el-table>
</template>

<script>
import { getOutTask } from "@/api/task";
export default {
  data() {
    return {
      outTaskLiist: [],
      StatusList: [
        {
          label: "暂停",
          value: 0
        },
        {
          label: "未开始",
          value: 1
        },
        {
          label: "进行中",
          value: 2
        },
        {
          label: "超时",
          value: 5
        }
      ]
    };
  },
  methods: {
    // 表内单元格样式（状态、优先级改变背景色）
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === "task.priority") {
        switch (row.task.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property === "grade") {
        switch (row.grade) {
          case 0:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return {
        borderRight: 0
      };
    },
    //获取待提交外包任务列表
    getOutTaskList() {
      getOutTask().then(({ data }) => {
        this.outTaskLiist = [...data.msg];
        console.log("111111111");
        console.log(this.outTaskLiist);
      });
    }
  },
  created() {
    this.getOutTaskList();
  }
};
</script>

<style>
</style>