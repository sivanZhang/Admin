<template>
  <div class="import-table-template">
    <div class="text-right">
      共
      <span>{{tableData.length}}</span> 条数据
    </div>
    {{hasBindKey}}
    <template>
      <div v-for="i in dealDatas">{{i}}</div>
    </template>
    <div
      v-loading="tableLoading"
      :element-loading-text="tableLoadingText"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="height:calc(100vh - 168px)"
    >
      <el-table
        :data="tableData"
        border
        @cell-dblclick="dblhandleCurrentChange"
        style="width: 100%;"
        height="100%"
        @selection-change="selected"
      >
        <el-table-column v-if="tableData.length" type="selection" fixed width="50" align="center"></el-table-column>
        <template v-for="(col ,index) in tableCols">
          <el-table-column
            :index="index"
            v-bind:key="index"
            :prop="col.prop"
            :label="col.label"
            align="center"
            min-width="130"
          >
            <template slot="header" slot-scope="scope">
              <div @click="handelClickHeader(scope)" style="cursor:pointer;">
                <p style="height:15px;">{{scope.column.label.split(",")[0]}}</p>
                <p style="height:30px">{{scope.column.label.split(",")[1]}}</p>
              </div>
            </template>
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.isEdit  && index!=0"
                size="small"
                v-model="scope.row[col.prop]"
                placeholder="请输入内容"
                v-on:blur="inputblur"
              ></el-input>
              <span
                v-if="!scope.row.isEdit && !isImage(scope.row[col.prop])"
              >{{scope.row[col.prop]}}</span>
              <el-image
                v-if="isImage(scope.row[col.prop])"
                :src="$store.state.BASE_URL+scope.row[col.prop]"
                fit="cover"
                style="width:80px;height:45px"
              ></el-image>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-dialog
      :title="'字段绑定['+selectCurrentCol.label+']'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-radio v-model="radio" :label="1">绑定资产</el-radio>
          <el-radio v-model="radio" :label="2">绑定环节</el-radio>
        </el-col>
        <el-col>
          <template v-if="radio===1">
            <el-select
              v-model="selectKey"
              placeholder="请选择"
              filterable
              @change="changeHandlerRadio"
            >
              <el-option-group v-for="group in keysMap" :key="group.label" :label="group.label">
                <el-option
                  v-for="(item,index) in group.options"
                  :key="index"
                  :label="allKeysMap[item]"
                  :value="item"
                ></el-option>
              </el-option-group>
            </el-select>
          </template>
          <template v-else>
            <el-cascader
              style="margin-bottom:5px;"
              v-model="tempDept"
              placeholder="输入搜索工种"
              :options="SelectDept"
              :props="{ checkStrictly: true}"
              filterable
            ></el-cascader>
            <div>
              <el-select
                v-model="selectLinkDetail"
                placeholder="请选择"
                filterable
                @change="linkChanged"
              >
                <el-option
                  v-for="(item,index) in LinkKeys"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-col>
      </el-row>
      <div style="margin-top:20px">
        <el-button type="danger" @click="deleteCol" :loading="isDeleteCol">删除本列</el-button>
        <el-button type="warning" @click="cancelMapping">清空字段</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "ImportTableTemplate",
  data() {
    return {
      isDeleteCol: false, //删除列的加载状态
      isShowOptionBar: false,
      dialogVisible: false, //弹出框控制
      assemblingData: {},
      tableLoading: false,
      tableLoadingText: "",
      dealDatas: [], //原始数据
      keysMap: [], //绑定字段所需要的数据
      allKeysMap: [], //用来缓存的字段
      dealKeys: [], //原始keys
      tableCols: [], //列[{...}]
      tableData: [], //表格数据 [{},{},{}]
      selectKey: null,
      selectCurrentCol: { label: "" }, //选中的当前列
      hasBindKey: [], //已经绑定key
      LinkList: [[]], //提交时绑定links字段的数组 一个数组代表一列数据的link
      SelectDept: [], //工种数组
      tempDept: null, //选中的dept
      radio: 1,
      LinkKeys: [
        {
          label: "制作内容",
          value: "content"
        },
        {
          label: "开始时间",
          value: "date_start"
        },
        {
          label: "结束时间",
          value: "date_end"
        },
        {
          label: "执行人",
          value: "executors"
        }
      ],
      selectLinkDetail: null,
      hasBindLinkKey: [],
      selection: []
    };
  },
  computed: {
    ...mapState("admin", ["DeptList"])
  },
  methods: {
    //点击表格头
    isImage(str) {
      return /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(str);
    },
    handelClickHeader({ column, $index }) {
      if (this.tableCols[column.index]) {
        this.selectCurrentCol = column;
        this.dialogVisible = true;
        this.selectLinkDetail = null;
        this.selectKey = "";
      }
    },
    //删除列
    deleteCol() {
      this.isDeleteCol = true;
      this.dealDatas.forEach(t => {
        t.splice(this.selectCurrentCol.index, 1);
      });
      this.tableCols.splice(this.selectCurrentCol.index, 1);
      this.hasBindLinkKey.splice(this.selectCurrentCol.index, 1);
      this.hasBindKey.splice(this.selectCurrentCol.index, 1);
      this.isDeleteCol = false;
      this.dialogVisible = false;
    },
    //缓存勾选中的行
    selected(e) {
      this.selection = [...e];
    },
    //删除勾选的行
    deleteRow() {
      if (!this.selection.length) {
        this.$message.warning("请勾选行");
      }
      this.tableData = this.tableData.filter((t, i) => {
        return !this.selection.includes(t);
      });
      this.selection = [];
    },
    //绑定工种字段
    linkChanged(value) {
      let _self = this;
      let lastLabel;
      this.LinkKeys.forEach(item => {
        if (item.value === value) {
          lastLabel = item.label;
        }
      });
      let deptLabel;
      function changeList(arr) {
        for (const item of arr) {
          if (item.value == _self.tempDept[_self.tempDept.length - 1]) {
            deptLabel = item.label;
          } else if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          }
        }
      }
      changeList(this.SelectDept);
      //this.selectCurrentCol点击的列的信息
      let label = this.tableCols[this.selectCurrentCol.index].label; //label是选中列的lable为了截取ABCD.....
      this.tableCols[this.selectCurrentCol.index].label =
        //大写英文字母 + 传过来的中文字段
        label.split(",")[0] + "," + "[" + deptLabel + "]" + lastLabel;
      this.tableCols[this.selectCurrentCol.index].name = value;
      //缓存已选择的 keys
      this.hasBindLinkKey[this.selectCurrentCol.index] = value;
      this.hasBindKey[this.selectCurrentCol.index] = null;
      if (this.tempDept) {
        //如果已经选择过工种
        this.dialogVisible = false;
      }
    },
    //获取工种列表
    async formatList() {
      if (!this.DeptList) {
        await this.$store.dispatch("admin/get_DeptList");
      }
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.SelectDept = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.SelectDept);
    },
    openLoading(msg) {
      this.tableLoading = true;
      this.tableLoadingText = msg;
    },
    closeLoading() {
      this.tableLoading = false;
    },
    //导入后初始化
    initData(data) {
      //表格数据 = 空
      this.hasBindKey = [];
      this.hasBindLinkKey = [];
      this.tableData = [];
      this.tableLoading = true;
      this.tableLoadingText = "数据组装中";
      //原始数据= [[],[],[],[]]
      this.dealDatas = data.datas;
      //绑定字段= {}
      this.allKeysMap = { ...data.requiredKeysMap, ...data.keysMap };
      this.keysMap = [
        {
          label: "必填字段",
          options: Object.keys(data.requiredKeysMap),
          obj: { ...data.requiredKeysMap }
        },
        {
          label: "非必填字段",
          options: Object.keys(data.keysMap)
        }
      ];

      //原始keys
      this.dealKeys = [];
      //绑定字段 的 key组成一个数组 push到 原始keys中
      for (let key in this.allKeysMap) {
        this.dealKeys.push(key);
      }
      this.getTableHeader(data.reset);
    },
    //获取传递的数据
    getAssemblingData() {
      this.assemblingData.values = [];
      /**
       * 已经绑定列的下下标
       */
      let tempKeyIndexs = [];
      let bindKeys = [];
      for (let i = 0; i < this.hasBindKey.length; i++) {
        if (this.hasBindKey[i]) {
          bindKeys.push(this.hasBindKey[i]);
          tempKeyIndexs.push(i);
        }
      }
      let values = [];
      for (let i = 0; i < this.dealDatas.length; i++) {
        let value = [];
        let tableRowData = this.dealDatas[i];
        for (let j = 0; j < tempKeyIndexs.length; j++) {
          value.push(tableRowData[tempKeyIndexs[j]]);
        }
        values.push(value);
      }
      let tempLinkKeyIndexs = []; // 每一项是绑定了link字段的index
      this.hasBindLinkKey.forEach((t, i) => {
        t && tempLinkKeyIndexs.push(i);
      });
      this.dealDatas.forEach((t, i) => {
        if (!this.LinkList[i]) {
          this.LinkList.splice(i, 0, []);
        } //如果没有数组创建数组
        tempLinkKeyIndexs.forEach((e, j) => {
          let linkIndex;
          let bl;
          this.LinkList[i].forEach((lt, k) => {
            if (lt.dept === this.tempDept[this.tempDept.length - 1]) {
              // this.tempDept[this.tempDept.length - 1 当前选中的dept
              linkIndex = k;
              bl = true;
            } else {
              bl = false;
            }
          });

          if (bl) {
            //如果已经创建了该环节的数据
            this.LinkList[i][linkIndex] = {
              ...this.LinkList[i][linkIndex],
              [this.hasBindLinkKey[e]]: t[e]
            };
          } else {
            this.LinkList[i].push({
              dept: this.tempDept[this.tempDept.length - 1],
              [this.hasBindLinkKey[e]]: t[e]
            });
          }
        });
      });
      //如果有绑定环节     把传递的数据加Link字段  并且把环节数组对象放到每一列中
      if (this.LinkList[0].length) {
        bindKeys.push("links");
        values.forEach((item, index) => {
          item.push(this.LinkList[index]);
        });
      }

      this.assemblingData.keys = bindKeys;
      this.assemblingData.values = values;
      //必填字段验证
      for (const t of this.keysMap[0].options) {
        if (!bindKeys.includes(t)) {
          this.$message.warning(this.keysMap[0].obj[t] + "是必填字段");
          return false;
        }
      }
      this.$emit("returnAssemblingData", this.assemblingData);
    },
    /**
     * 组装表格头  bl = 是否重置表格
     */
    getTableHeader(bl) {
      this.tableCols = [];
      //加载中文字
      this.tableLoadingText = "数据组装表头中";
      //
      if (this.dealDatas.length > 0) {
        this.tableLoading = true;
        let firstData = this.dealDatas[0];
        //用第一列原始data进行循环
        for (let i = 0; i < firstData.length; i++) {
          this.letterIndex = 65 + i;
          let label = {
            label: String.fromCharCode(65 + i) + ",未绑定字段",
            prop: "node" + i,
            name: ""
          };
          //列数据
          this.tableCols.push(label);
        }
        this.isShowOptionBar = true;
        //开始组装数据
        this.getTableData();
      } else {
        this.tableLoading = false;
        this.isShowOptionBar = false;
        if (bl) return;
        this.$message.error("导入的数据是空数据");
      }
    },
    //转化成el tabale用的数据格式
    getTableData() {
      this.tableLoadingText = "数据组装数据中";
      this.dealDatas.forEach((t, i) => {
        let data = {};
        t.forEach((ct, ci) => {
          data["node" + ci] = t[ci];
        });
        data["isEdit"] = false;
        this.tableData.push(data);
      });
      this.tableLoading = false;
    },
    /**
     * 单击单元格选中事件
     */
    changeHandlerRadio(value) {
      if (this.hasBindKey.indexOf(value) < 0) {
        //this.selectCurrentCol点击的列的信息
        let label = this.tableCols[this.selectCurrentCol.index].label; //label是选中列的lable为了截取ABCD.....
        this.tableCols[this.selectCurrentCol.index].label =
          //大写英文字母 + 传过来的中文字段
          label.split(",")[0] + "," + this.allKeysMap[value];
        this.tableCols[this.selectCurrentCol.index].name = value;
        //缓存已选择的 keys
        this.hasBindKey[this.selectCurrentCol.index] = value;
        this.hasBindLinkKey[this.selectCurrentCol.index] = null;
        this.dialogVisible = false;
      } else {
        this.$message.error("该字段已有绑定过");
      }
    },
    //取消绑定
    cancelMapping() {
      let label = this.tableCols[this.selectCurrentCol.index].label;
      this.tableCols[this.selectCurrentCol.index].label =
        label.split(",")[0] + ",未绑定字段";
      this.tableCols[this.selectCurrentCol.index].name = "";
      this.hasBindKey[this.selectCurrentCol.index] = null;
      this.hasBindLinkKey[this.selectCurrentCol.index] = null;
      this.dialogVisible = false;
    },
    dblhandleCurrentChange(row, column, cell, event) {
      row.isEdit = true;
    },
    inputblur(row, event, column) {
      let tableD = this.tableData;
      tableD.forEach(function(item) {
        item.isEdit = false;
      });
    }
  },
  created() {
    this.formatList();
  }
};
</script>
<style lang="scss" scoped>
.import-table-template {
  position: relative;
}
.text-right {
  span {
    color: #ed4014;
    font-size: 18px;
  }
  width: 100%;
  position: absolute;
  right: 0;
  top: -40px;
  text-align: right;
  font-size: 16px;
  font-weight: 600;
  z-index: -1;
}
</style>
