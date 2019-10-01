<!-- 自定义属性绑定 -->
<template>
  <div id="attr_bind">
    <el-button type="primary" @click="showDialog()" style="margin-bottom:10px">自定义属性绑定</el-button>

    <el-table
      :data="customAttrs"
      ref="attrsList"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="{borderRight:0}"
      highlight-current-row
      :border="false"
    >
      <el-table-column label="属性名" prop="attr_name"></el-table-column>
      <el-table-column label="属性值" prop="attr_value"></el-table-column>
      <el-table-column label="默认值" prop="atr_default"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              icon="el-icon-delete"
              style="color:red"
              type="text"
              @click="removeBind(scope.row.id)"
            ></el-button>
          </el-tooltip>
          </template>
      </el-table-column>
    </el-table>
    <template v-if="isDialog">
      <div style="margin-top:20px;border:1px solid">
        <div style="padding-top:10px">
            <el-form :model="bindForm" label-width="90px" >
          <el-form-item label="属性类型" prop="attr_type">
            <el-select v-model="bindForm.attr_type" @change="entityNameChoose()">
              <el-option
                v-for="(item,index) of entityTpe"
                :key="index"
                :label="item.type"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="属性名称" prop="attr_name">
            <el-select v-model="bindForm.attr_name">
              <el-option
                v-for="(item,index) of EntityName"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveAttrs">立即绑定</el-button>
          </el-form-item>
        </el-form>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { attrsEntityBind, attrsEntityUnbind } from "@/api/attrs";
export default {
  name: "attr_bind",
  components: {},
  props: ["project","customAttrs","attrsList","attrsTypeNum"],
  data() {
    return {
      bindForm: {},
      entityTpe: [
        {
          type: "NUMBER（数字）",
          value: 1
        },
        {
          type: "CHARACTER（字符）",
          value: 2
        },
        {
          type: "DATE（日期）",
          value: 3
        },
        {
          type: "BOOLEAN（布尔值）",
          value: 4
        },
        {
          type: "ENUMERATE（枚举）",
          value: 5
        }
      ],
      EntityName: [],
      isDialog: false
    };
  },
  watch: {},
  methods: {
    showDialog() {
      this.isDialog = true;
    },
    saveAttrs() {
      let data = {
        attr_id: this.bindForm.attr_name,
        entity_id: this.project.id,
        entity_type: this.attrsTypeNum
      };

      //console.log(data);
      attrsEntityBind(data).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.$emit("refresh_customAttrs");
          this.isDialog = false
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    entityNameChoose() {
      this.EntityName = [];
      this.attrsList.forEach(item => {
        if (item.type === this.bindForm.attr_type) {
          this.EntityName.push(item);
        }
      });
    },
    removeBind(id){
        this.$confirm("此操作将永久解绑属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        attrsEntityUnbind({id,method:"delete"}).then(({data})=>{
            if(data.status === 0){
                this.$message.success(data.msg);
                this.$emit("refresh_customAttrs");
            }else{
                this.$message.error(data.msg)
            }
        });})
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>