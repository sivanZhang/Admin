<style lang="scss" scoped>
#my-production {
}
</style>
<template>
  <div id="my-production">
    <el-select v-model="currentAuthor" placeholder="请选择">
      <el-option v-for="item in Authors" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="currentType" placeholder="请选择">
      <el-option v-for="item in Types" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button type="primary" @click="getProductions()">查询</el-button>
    <el-table :data="ProductionList" style="width: 100%;margin-top:30px">
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
      <el-table-column prop="creator.username" label="创建者" header-align="center"></el-table-column>
      <el-table-column prop="path" label="作品路径" header-align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text">展示</el-button>
          <el-button type="text">评论</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getProduction } from "@/api/production";
export default {
  name: "my-production",
  data() {
    return {
      ProductionList: [],
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
    getProductions() {
      let params = {};
      this.currentType && (params[this.currentType]='')
      this.currentAuthor && (params[this.currentAuthor]='')
      getProduction(params).then(({ data }) => {
        this.ProductionList = [...data.msg];
      });
    }
  },
  created() {
    this.getProductions();
  }
};
</script>