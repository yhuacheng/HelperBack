<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-form-item>
					<el-input size="small" v-model="searchForm.name" placeholder="姓名/手机"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="searchForm.state" placeholder="状态" size="small">
						<el-option value="" label="全部"></el-option>
						<el-option value="1" label="待处理"></el-option>
						<el-option value="2" label="提现成功"></el-option>
						<el-option value="3" label="提现失败"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="searchData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
		 ref='tableData'>
			<el-table-column type="index" label="#" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyNumber" label="流水号" align="center"></el-table-column>
			<el-table-column prop="Name" label="客户名称" align="center"></el-table-column>
			<el-table-column prop="CustomerNumber" label="客户编码" align="center"></el-table-column>
			<el-table-column prop="Phone" label="客户手机" align="center"></el-table-column>
			<el-table-column prop="RemoveMoeny" label="提现金额" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyTime" label="申请时间" align="center"></el-table-column>
			<el-table-column prop="BankAccount" label="银行账号" align="center"></el-table-column>
			<el-table-column prop="Bank" label="开户银行" align="center"></el-table-column>
			<el-table-column prop="BankName" label="开户名" align="center"></el-table-column>
			<el-table-column prop="RemoveMoneyState" label="状态" align="center">
				<template v-slot="scope">
					<span v-if="scope.row.RemoveMoneyState===1">待处理</span>
					<span class="success" v-if="scope.row.RemoveMoneyState===2">提现成功</span>
					<span class="danger" v-if="scope.row.RemoveMoneyState===3">提现失败</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="150">
				<template v-slot="scope">
					<el-button size="small" type="success" v-if="scope.row.RemoveMoneyState===1" @click="handleState(scope.$index, scope.row,2)">成功</el-button>
					<el-button size="small" type="danger" v-if="scope.row.RemoveMoneyState===1" @click="handleState(scope.$index, scope.row,3)">失败</el-button>
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

	</section>
</template>

<script>
	import {
		takeMoneyList,
		takeMoneyState
	} from '@/api/api'

	export default {
		name: 'takeMoney',
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
					name: '',
					state: ''
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
					KeyWord: _this.searchForm.name,
					State: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				takeMoneyList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
			},

			//提现成功失败
			handleState(index, row, val) {
				let _this = this
				var id = row.Id
				let txt = ''
				if (val == 2) {
					txt = '成功'
				}
				if (val == 3) {
					txt = '失败'
				}
				_this.$confirm('确认【' + row.Name + '】提现 ' + txt + ' 吗？', '信息提示', {
					type: 'warning'
				}).then(() => {
					let params = {
						Id: id,
						State: val
					}
					takeMoneyState(params).then((res) => {
						_this.getData()
					})
				}).catch(() => {})
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
