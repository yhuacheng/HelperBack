<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input size="small" v-model="searchForm.name" placeholder="国家"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="searchData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="infor" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
      ref='tableData'>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
      <el-table-column prop="CounteyShorthand" label="简称" align="center"></el-table-column>
      <el-table-column prop="State" label="状态" align="center">
        <template v-slot="scope">
          <span class="success" v-if="scope.row.State===1">正常</span>
          <span class="danger" v-if="scope.row.State===0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template v-slot="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal" width="30%">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
        <el-form-item label="国家" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="simple">
          <el-input v-model="editForm.simple"></el-input>
        </el-form-item>
        <el-form-item v-if="doType==='edit'" label="状态" prop="state">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
    countryList,
    countryAdd,
    countryEdit
  } from '@/api/api'

  export default {
    name: 'country',
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
        searchForm: {
          name: ''
        },
        editForm: {
          name: '',
          simple: '',
          state: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入国家名称',
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
          CountryName: _this.searchForm.name,
          pageNum: _this.pageNum,
          pagesize: _this.pageSize
        }
        countryList(params).then(res => {
          _this.listLoading = false
          _this.tableData = res
        }).catch((e) => {})
      },

      //查询
      searchData() {
        let _this = this
        _this.pageNum = 1
        _this.getData()
      },

      // 显示新增框
      handleAdd() {
        let _this = this
        _this.title = '新增国家'
        _this.doType = 'add'
        _this.editModal = true
      },

      // 显示编辑框
      handleEdit(index, row) {
        let _this = this
        _this.title = '编辑国家'
        _this.doType = 'edit'
        _this.selectId = row.Id
        _this.editModal = true
        _this.editForm.name = row.CountryName
        _this.editForm.simple = row.CounteyShorthand
        _this.editForm.state = row.State
      },

      //新增提交
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.btnLoading = true
            let params = {
              CountryName: _this.editForm.name,
              CounteyShorthand: _this.editForm.simple
            }
            countryAdd(params).then(res => {
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
              CountryName: _this.editForm.name,
              CounteyShorthand: _this.editForm.simple,
              State: _this.editForm.state
            }
            countryEdit(params).then(res => {
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
          name: '',
          account: '',
          state: ''
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
