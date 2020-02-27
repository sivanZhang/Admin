<template>
  <div id="sharefiles">
    <ElRow :gutter="24">
      <ElCol :span="6">
        <el-card>
          <h4 slot="header">
            上传文件
            <div slot="tip" class="el-upload__tip">上传文件的大小不可超过50M</div>
          </h4>
          <div>
            <el-form
              ref="saveForm"
              :label-position="labelPosition"
              label-width="100px"
              :model="saveForm"
              class="save-form"
            >
              <el-form-item label="选取文件" prop="file">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  accept="file"
                  :action="action"
                  :headers="headers"
                  :on-success="handleSuccess"
                  :before-remove="beforeRemove"
                  :file-list="fileList"
                  :clear-files="clearFiles"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </ElCol>
      <ElCol :span="18">
        <el-card>
          <h4 slot="header">文件列表</h4>
          <div>
            <el-row>
              <el-col :span="16">
                <el-button
                  v-show="auth"
                  type="danger"
                  icon="el-icon-delete"
                  :disabled="this.multipleSelection.length === 0"
                  @click="deletList"
                >批量删除</el-button>
              </el-col>
              <el-col :span="8">
                <el-row type="flex" align="middle">
                  <el-input
                      v-model="filterText"
                      placeholder="请输入文件名称"
                      @keyup.enter.native="searchFilesList(1)"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        type="primary"
                        @click="searchFilesList(1)"
                      />
                    </el-input>
                  <el-button
                      type="primary"
                      style="margin-left: 15px"
                      @click="searchFilesList()"
                    >重置</el-button>
                </el-row>
              </el-col>
            </el-row>
            <el-table
              ref="tableData"
              style="width: 100%;margin-top:15px"
              :row-key="row=>row.id"
              :data="tableData"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                :reserve-selection="true"
                width="60px"
                align="center"
              />
              <el-table-column type="index" align="center" />
              <el-table-column prop="filename" header-align="center" label="文件名称">
                <template slot-scope="scope">{{ scope.row.filename }}</template>
              </el-table-column>
              <el-table-column prop="filepath" align="center" label="文件路径">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">{{ scope.row.filepath }}</div>
                    <span
                      style="cursor:pointer;color:#2d8cf0"
                      @click="download(scope.row)"
                    >{{ "点击下载" }}</span>
                  </el-tooltip>
                </template>

                <!-- <template slot-scope="scope">{{scope.row.filepath}}</template> -->
              </el-table-column>

              <el-table-column prop="date" align="center" label="提交日期">
                <template slot-scope="scope">{{ scope.row.date|dateFormat }}</template>
              </el-table-column>

              <el-table-column prop="username" align="center" label="提交人">
                <template slot-scope="scope">{{ scope.row.username }}</template>
              </el-table-column>
              <el-table-column v-if="auth" label="操作" align="center">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <el-button
                      icon="el-icon-delete"
                      style="color:red"
                      type="text"
                      @click="deleteFile(scope.row.id)"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
import { uploadfile, searchfileList, deletefile } from '@/api/sharefiles'
import { getToken } from '@/utils/auth'
export default {
  name: 'Sharefiles',
  data() {
    const isPro = Object.is(process.env.NODE_ENV, 'production')
    return {
      action: isPro
        ? this.$store.state.BASE_URL + 'sharefiles/sharefiles/'
        : '/api/sharefiles/sharefiles/',
      fileList: [],
      labelPosition: 'right',
      saveForm: {},
      disabled: false,
      tableData: [],
      multipleSelection: [],
      filterText: '',
      loading: false,
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      auth: null
    }
  },
  created() {
    this.searchFilesList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击下载文件
    download(row) {
      const data = this.$store.state.BASE_URL + row.filepath
      window.location.href = data
    },
    // 批量删除
    deletList() {
      this.$confirm('此操作将永久删除文件,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection
          .map(item => item.id)
          .join(',')
        deletefile({
          method: 'delete',
          ids: ids
        }).then(({ data }) => {
          this.$message.success(data.msg)
          this.searchFilesList()
        })
      })
    },
    // 查询文件
    searchFilesList(Type) {
      if (Type === 1 && this.filterText) {
        searchfileList({ filename: this.filterText }).then(
          ({ data }) => {
            this.tableData = [...data.msg]
            this.auth = data.auth.can_manage_sharefile
          }
        )
      } else {
        searchfileList().then(({ data }) => {
          this.tableData = [...data.msg]
          this.auth = data.auth.can_manage_sharefile
        })
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 监听文件上传成功
    handleSuccess(response, file, fileList) {
      if (response.status === 0) {
        this.$message.success(response.msg)
        this.searchFilesList()
      } else {
        this.$message.error(response.msg)
      }
      this.loading = false
      this.clearFiles()
    },
    clearFiles() {
      this.fileList = []
    },
    // 单个删除文件
    deleteFile(id) {
      deletefile({ method: 'delete', ids: id }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg)
          this.searchFilesList()
        }
      })
    }
  }
}
</script>
