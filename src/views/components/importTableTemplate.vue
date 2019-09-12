<template>
  <div class="import-table-template">
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
        <el-table-column v-if="tableData.length" type="selection" width="60" fixed align="center"></el-table-column>
        <!-- <el-table-column v-if="isShowOptionBar" fixed label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="danger"
              size="small"
            >移除</el-button>
          </template>
        </el-table-column>-->
        <template v-for="(col ,index) in tableCols">
          <el-table-column
            v-if="col.type==='normal'"
            :index="index"
            v-bind:key="index"
            :prop="col.prop"
            :label="col.label"
            :render-header="renderHeader"
            align="center"
            min-width="130"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.isEdit  && index!=0"
                size="small"
                v-model="scope.row[col.prop]"
                placeholder="请输入内容"
                v-on:blur="inputblur"
              ></el-input>
              <span v-if="!scope.row.isEdit && index!=0">{{scope.row[col.prop]}}</span>
              <el-image
                v-if="index==0"
                :src="$store.state.BASE_URL+scope.row[col.prop]"
                fit="cover"
                style="width:80px;height:45px"
              ></el-image>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="text-right">共{{tableData.length}}条数据</div>
      <!-- <el-row style="margin-top:15px">
        <el-button type="primary">添加到环节</el-button>
        <el-button type="success" @click="mergeCell()">合并单元格</el-button>
        <el-button type="danger" @click="cancelCell()">取消合并</el-button>
      </el-row>-->
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
                  v-for="(item,index) in linkDetails"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-col>
      </el-row>
      <div style="text-align:center;margin-top:20px">
        <el-button type="danger" @click="cancelMapping">清空字段</el-button>
        <el-button type="primary">绑定字段</el-button>
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
      isShowOptionBar: false,
      dialogVisible: false,
      assemblingData: {},
      tableLoading: false,
      tableLoadingText: "",
      dealDatas: {}, //原始数据
      keysMap: [], //绑定字段,
      allKeysMap: [],
      dealKeys: [], //原始keys
      tableCols: [], //表格头
      tableData: [], //表格数据
      selectKey: null,
      selectCurrentCol: { label: "" }, //选中的当前列
      hasBindKey: [], //已经绑定key
      LinkList: [[]], //提交时绑定links字段的数组
      SelectDept: [], //工种数组
      tempDept: null, //选中的dept
      radio: 1,
      linkDetails: [
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
    selected(e, index) {
      this.selection = [...e];
    },
    deleteRow() {
      if(!this.selection.length){
        this.$message.warning('请勾选行')
      }
      this.tableData=this.tableData.filter((t, i) => {
        return !this.selection.includes(t)
      });
      this.selection = []
    },
    //绑定工种字段
    linkChanged(value) {
      let _self = this;
      let lastLabel;
      this.linkDetails.forEach(item => {
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
      //this.selectCurrentCol点击的列的信息   label是选中列的lable为了截取ABCD.....
      let label = this.tableCols[this.selectCurrentCol.index].label;
      this.tableCols[this.selectCurrentCol.index].label =
        //大写英文字母 + 传过来的中文字段
        label.split(",")[0] + "," + "[" + deptLabel + "]" + lastLabel;
      this.tableCols[this.selectCurrentCol.index].name = value;
      //缓存已选择的 keys
      this.hasBindLinkKey[this.selectCurrentCol.index] = value;
      //添加到将要提交的links数组

      /* let tempKeyIndexs = [];
        for (let i = 0; i < this.hasBindKey.length; i++) {
          if (this.hasBindLinkKey[i]) {
            tempKeyIndexs.push(i);
          }
        } */
      let tempKeyIndexs = [];
      _self.hasBindLinkKey.forEach((t, i) => {
        t && tempKeyIndexs.push(i);
        console.log("tempKeyIndexs", tempKeyIndexs);
      });
      _self.tableData.forEach((t, i) => {
        if (!_self.LinkList[i]) {
          _self.LinkList[i] = [];
        }
        tempKeyIndexs.forEach((e, j) => {
          let linkIndex;
          let bl;
          _self.LinkList[i].forEach((lt, li) => {
            if (lt.dept === _self.tempDept[_self.tempDept.length - 1]) {
              linkIndex = li;
              bl = true;
            } else {
              bl = false;
            }
          });

          if (bl) {
            _self.LinkList[i][linkIndex] = Object.assign(
              {},
              _self.LinkList[i][linkIndex],
              {
                [value]: t["node" + e]
              }
            );
          } else {
            _self.LinkList[i].push({
              dept: _self.tempDept[_self.tempDept.length - 1],
              [value]: t["node" + e]
            });
          }
        });
      });
      if (this.tempDept) {
        this.dialogVisible = false;
      }
      /* if (this.hasBindLinkKey.indexOf(value) < 0) {
        
      } else {
        this.$message.error("该字段已有绑定过");
      } */
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
      this.tableData = [];
      this.tableLoading = true;
      this.tableLoadingText = "数据组装中";
      //原始数据= [[],[],[],[]]
      this.dealDatas = data.datas;
      //绑定字段= {}
      //this.keysMap = data.keysMap;
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
      for (let i = 0; i < this.tableData.length; i++) {
        let value = [];
        let tableRowData = this.tableData[i];
        for (let j = 0; j < tempKeyIndexs.length; j++) {
          value.push(tableRowData["node" + tempKeyIndexs[j]]);
        }
        values.push(value);
      }
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
        if (!this.assemblingData.keys.includes(t)) {
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
      //表格头
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
            name: "",
            type: "normal" //表示添加进来的列（不包含操作项）
          };
          //表头数据添加
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
      for (let i = 0; i < this.dealDatas.length; i++) {
        let data = {};
        //普通数据
        for (let j = 0; j < this.dealDatas[i].length; j++) {
          data["node" + j] = this.dealDatas[i][j];
        }
        data.isEdit = false;
        this.tableData.push(data);
      }
      console.log("this.tableData", this.tableData);

      this.tableLoading = false;
    },
    /**
     * 单击单元格选中事件
     */
    changeHandlerRadio(value) {
      if (this.hasBindKey.indexOf(value) < 0) {
        //this.selectCurrentCol点击的列的信息   label是选中列的lable为了截取ABCD.....
        let label = this.tableCols[this.selectCurrentCol.index].label;
        this.tableCols[this.selectCurrentCol.index].label =
          //大写英文字母 + 传过来的中文字段
          label.split(",")[0] + "," + this.allKeysMap[value];
        this.tableCols[this.selectCurrentCol.index].name = value;
        //缓存已选择的 keys
        this.hasBindKey[this.selectCurrentCol.index] = value;

        this.dialogVisible = false;
      } else {
        this.$message.error("改字段已有绑定过");
      }
    },
    //取消绑定
    cancelMapping() {
      let label = this.tableCols[this.selectCurrentCol.index].label;
      this.tableCols[this.selectCurrentCol.index].label =
        label.split(",")[0] + ",未绑定字段";
      this.tableCols[this.selectCurrentCol.index].name = "";
      this.hasBindKey[this.selectCurrentCol.index] = "";
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
    },
    /**
     * 格式化表头
     */
    renderHeader(h, { column, $index }) {
      let _self = this;
      let a = column.label.split(",")[0];
      let b = column.label.split(",")[1];
      return h(
        "div",
        {
          style: "cursor:pointer;"
        },
        [
          /* h("el-checkbox", {
            style: "display:inline-flex;margin-left:5px;",
            class: "1111",
            on: {
              change: $event => {
                console.log("选中：", _self.tableCols[column.index]);
              }
            }
          }), */
          h("div", {}, [
            h(
              "p",
              {
                style: "height:17px;",
                on: {
                  click: function() {
                    console.log(_self.tableCols[column.index]);
                    if (_self.tableCols[column.index]) {
                      _self.selectCurrentCol = column;
                      _self.dialogVisible = true;
                      (_self.selectLinkDetail = null), (_self.selectKey = "");
                    }
                  }
                }
              },
              a
            ),
            h(
              "p",
              {
                style: "height:30px;",
                on: {
                  click: function() {
                    console.log(_self.tableCols[column.index]);
                    if (_self.tableCols[column.index]) {
                      _self.selectCurrentCol = column;
                      _self.dialogVisible = true;
                      (_self.selectLinkDetail = null), (_self.selectKey = "");
                    }
                  }
                }
              },
              b
            )
          ])
        ]
      );
    },
    mergeCell() {
      this.$message.error("开发中");
      var inputs = document.getElementsByTagName("input");
      var boxs = [];
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox") {
          console.log(inputs[i].id);
          boxs.push(inputs[i]);
        }
      }
      console.log(boxs);
    },
    cancelCell() {
      this.$message.error("开发中");
    }
  },
  created() {
    this.formatList();
  }
};
</script>
<style lang="scss" scoped>
.text-right {
  color: #2d8cf0;
  text-align: right;
  font-size: 16px;
}
</style>
