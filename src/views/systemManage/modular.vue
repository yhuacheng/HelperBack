<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button size="small" type="infor" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
		 ref='tableData'>
			<el-table-column type="index" label="#" align="center"></el-table-column>
			<el-table-column prop="ModularId" label="所属模块名称" align="center" :formatter="typeName"></el-table-column>
			<el-table-column prop="ModularId" label="所属模块ID" align="center"></el-table-column>
			<el-table-column prop="SubmenuName" label="服务名称" align="center"></el-table-column>
			<el-table-column prop="Price" label="价格" align="center"></el-table-column>
			<el-table-column prop="Remark" label="备注" align="center" :show-overflow-tooltip='true'></el-table-column>
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
				<el-form-item label="所属模块" prop="type">
					<el-select v-model="editForm.type" :disabled="doType==='edit'" placeholder="请选择" style="width: 100%;">
						<el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="服务名称" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="price">
					<el-input v-model="editForm.price"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="editForm.remark" rows="5"></el-input>
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
		modularList,
		modularAdd,
		modularEdit
	} from '@/api/api'

	export default {
		name: 'modular',
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
					type: '',
					name: '',
					price: '',
					remark: '',
					state: ''
				},
				rules: {
					type: [{
						required: true,
						message: '请选择所属模块',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入服务名称',
						trigger: 'blur'
					}],
					price: [{
							required: true,
							message: '请输入价格',
							trigger: 'blur'
						},
						{
							pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
							message: '价格格式不正确',
							trigger: 'blur'
						}
					],
				},
				typeData: [{
						value: 1,
						label: '删差评'
					}, {
						value: 2,
						label: '首页无差评'
					},
					{
						value: 3,
						label: '关键词上首页'
					},
					{
						value: 4,
						label: 'ASIN关键词报告'
					},
					{
						value: 5,
						label: '店铺体检报告'
					},
					{
						value: 6,
						label: '店铺CPC报告'
					},
					{
						value: 7,
						label: '死因查询顶级模块'
					},
					{
						value: 8,
						label: '死因查询子级（查店铺封禁原因）'
					},
					{
						value: 9,
						label: '死因查询子级（查店铺封禁申诉失败原因）'
					},
					{
						value: 10,
						label: '死因查询子级（查ASIN封禁原因）'
					},
					{
						value: 11,
						label: '死因查询子级（查ASIN封禁申诉失败原因）'
					},
					{
						value: 12,
						label: '链接查邮箱'
					},
					{
						value: 13,
						label: '订单查邮箱'
					},
					{
						value: 14,
						label: '加购'
					},
					{
						value: 15,
						label: '心愿单'
					},
					{
						value: 16,
						label: '点赞'
					},
					{
						value: 17,
						label: '点踩'
					},
					{
						value: 18,
						label: '评论'
					}
				]
			}
		},
		created() {
			this.getData()
		},
		methods: {
			// 所属模块数字转文字
			typeName(row) {
				let typeData = this.typeData
				for (let x in typeData) {
					if (typeData[x].value == row.ModularId) {
						return typeData[x].label
					}
				}
			},

			// 获取列表数据
			getData() {
				let _this = this
				_this.listLoading = true
				let params = {}
				modularList(params).then(res => {
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
				_this.title = '新增模块信息'
				_this.doType = 'add'
				_this.editModal = true
			},

			// 显示编辑框
			handleEdit(index, row) {
				let _this = this
				_this.title = '编辑模块信息'
				_this.doType = 'edit'
				_this.selectId = row.Id
				_this.editModal = true
				_this.editForm.type = row.ModularId
				_this.editForm.name = row.SubmenuName
				_this.editForm.price = row.Price
				_this.editForm.remark = row.Remark
				_this.editForm.state = row.State
			},

			//新增提交
			addSubmit() {
				let _this = this
				_this.$refs.editForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							ModularId: _this.editForm.type,
							SubmenuName: _this.editForm.name,
							Price: _this.editForm.price,
							Remark: _this.editForm.remark,
						}
						modularAdd(params).then(res => {
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
							SubmenuName: _this.editForm.name,
							Price: _this.editForm.price,
							Remark: _this.editForm.remark,
							State: _this.editForm.state
						}
						modularEdit(params).then(res => {
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
					type: '',
					name: '',
					price: '',
					remark: '',
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
