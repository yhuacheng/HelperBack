<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button size="small" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
      ref='tableData'>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column prop="Title" label="公告标题" align="center"></el-table-column>
			<el-table-column prop="AddTime" label="添加时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template v-slot="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal" width="70%">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor v-model="editForm.content" ref="myQuillEditor" class="editor-box" :options="editorOption"></quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" v-if="doType==='add'" @click="addSubmit" :loading="btnLoading">提交</el-button>
        <el-button type="primary" v-if="doType==='edit'" @click="editSubmit" :loading="btnLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {
    noticeList,
    noticeAdd,
    noticeEdit
  } from '@/api/api'

  import {
    quillEditor
  } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import * as Quill from 'quill'
  let fontSizeStyle = Quill.import('attributors/style/size')
  fontSizeStyle.whitelist = ['12px', '14px', '16px', '20px', '24px', '36px']
  Quill.register(fontSizeStyle, true)

  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    [{
      color: []
    }, {
      background: []
    }], // 字体颜色、字体背景颜色
    // ['blockquote', 'code-block'], // 引用  代码块
    [{
      header: 1
    }, {
      header: 2
    }], // 1、2 级标题
    [{
      list: 'ordered'
    }, {
      list: 'bullet'
    }], // 有序、无序列表
    // [{ script: 'sub' }, { script: 'super' }], // 上标/下标
    [{
      indent: '-1'
    }, {
      indent: '+1'
    }], // 缩进
    // [{'direction': 'rtl'}], // 文本方向
    [{
      size: ['12px', '14px', '16px', '20px', '24px', '36px']
    }], // 字体大小
    [{
      header: [1, 2, 3, 4, 5, 6, false]
    }], // 标题
    [{
      font: []
    }], // 字体种类
    [{
      align: []
    }], // 对齐方式
    ['clean'], // 清除文本格式
    ['image'] // 链接、图片、视频-----['link', 'image', 'video']
  ]
  export default {
    name: 'notice',
    components: {
      quillEditor
    },
    data() {
      return {
        title: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        doType: '',
        editModal: false,
        listLoading: false,
        btnLoading: false,
        tableData: [],
        selsData: [],
        selectId: '',
        editForm: {
          title: '',
          content: ''
        },
        editorOption: {
          placeholder: '请输入公告内容...',
          theme: 'snow',
          modules: {
            toolbar: {
              container: toolbarOptions
            }
          }
        },
        rules: {
          title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 获取列表数据
      getData() {
        let _this = this
        _this.listLoading = true
        let params = {
          pageNum: _this.pageNum,
          pagesize: _this.pageSize
        }
        noticeList(params).then(res => {
          _this.listLoading = false
          _this.tableData = res.list
          _this.total = Number(res.total)
        }).catch((e) => {})
      },

      // 显示新增框
      handleAdd() {
        let _this = this
        _this.title = '新增公告'
        _this.doType = 'add'
        _this.editModal = true
      },

      // 显示编辑框
      handleEdit(index, row) {
        let _this = this
        _this.title = '编辑公告'
        _this.doType = 'edit'
        _this.selectId = row.Id
        _this.editModal = true
        _this.editForm.title = row.Title
        _this.editForm.content = row.Contenting
      },

      //新增提交
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.btnLoading = true
            let params = {
              Titles: _this.editForm.title,
              Contenting: _this.editForm.content,
            }
            noticeAdd(params).then(res => {
              _this.btnLoading = false
              _this.closeModal()
              _this.getData()
            }).catch((e) => {
              _this.btnLoading = false
            })
          }
        })
      },

      //编辑提交
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.btnLoading = true
            let params = {
              Id: _this.selectId,
              Titles: _this.editForm.title,
              Contenting: _this.editForm.content,
            }
            noticeEdit(params).then(res => {
              _this.btnLoading = false
              _this.closeModal()
              _this.getData()
            }).catch((e) => {
              _this.btnLoading = false
            })
          }
        })
      },

      //关闭新增编辑弹窗
      closeModal() {
        let _this = this
        _this.editModal = false
        _this.btnLoading = false
        _this.$refs['editForm'].resetFields()
        _this.editForm = {
          title: '',
          content: '',
        }
      },

      //选中数据
      selsChange(selsData) {
        this.selsData = selsData
      },

      //翻页
      handleSizeChange(val) {
        let _this = this
        _this.pageSize = val
        _this.getData()
      },
      //跳转
      handleCurrentChange(val) {
        let _this = this
        _this.pageNum = val
        _this.getData()
      }

    }
  }
</script>

<style lang="scss">
  .editor-box {
    height: 360px;
    padding-bottom: 20px;

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: '14px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
      content: '12px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
      content: '16px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
      content: '20px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
      content: '24px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
      content: '36px';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: '文本';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: '标题1';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: '标题2';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: '标题3';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: '标题4';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: '标题5';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: '标题6';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
      content: '标准字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
      content: '衬线字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
      content: '等宽字体';
    }

  }
</style>
