<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-form-item>
					<el-input size="small" v-model="searchForm.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="searchForm.state" placeholder="状态" size="small">
						<el-option value="0" label="全部"></el-option>
						<el-option value="1" label="正余额"></el-option>
						<el-option value="-1" label="负余额"></el-option>
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
			<el-table-column prop="Name" label="姓名" align="center"></el-table-column>
			<el-table-column prop="CustomerNumber" label="客户编码" align="center"></el-table-column>
			<el-table-column prop="AccountBalance" label="余额" align="center">
				<template v-slot="scope">
					<el-tag style="width: 100px;cursor: pointer;" type="danger" @click='handBalance(scope.$index,scope.row)'>{{Number(scope.row.AccountBalance)}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="Phone" label="手机" align="center"></el-table-column>
			<el-table-column prop="RegistrationTime" label="注册时间" align="center"></el-table-column>
			<el-table-column prop="Enable" label="状态" align="center">
				<template v-slot="scope">
					<span class="success" v-if="scope.row.Enable===1">正常</span>
					<span class="danger" v-if="scope.row.Enable===0">禁用</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="300">
				<template v-slot="scope">
					<el-button size="small" type="success" v-if="scope.row.Enable===0" @click="handleState(scope.$index, scope.row,1)">启用</el-button>
					<el-button size="small" type="danger" v-if="scope.row.Enable===1" @click="handleState(scope.$index, scope.row,0)">禁用</el-button>
					<el-button size="small" type="primary" @click="handleMod(scope.$index, scope.row,1)">充值</el-button>
					<el-button size="small" type="warning" @click="handleMod(scope.$index, scope.row,0)">扣款</el-button>
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

		<!-- 收支明细 -->
		<el-dialog :title="title" :visible.sync="balanceModal" :close-on-click-modal="false" :before-close="closeBalance"
		 width="80%">
			<!--收支明细工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="searchForm2">
					<el-form-item>
						<el-input size="small" v-model="searchForm2.keyword" placeholder="流水号/备注"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select size="small" v-model="searchForm2.state" placeholder="请选择类型">
							<el-option value="0" label="全部"></el-option>
							<el-option value="2" label="收入"></el-option>
							<el-option value="1" label="支出"></el-option>
							<el-option value="3" label="退款"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click="searchData2">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--收支明细列表-->
			<el-table :data="tableData2" v-loading="listLoading2" style="width: 100%" id="tableData2" ref='tableData2'>
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column prop="BusinessNumber" label="流水号" align="center"></el-table-column>
				<el-table-column prop="TransactionType" label="收支类型" align="center">
					<template v-slot="scope">
						<span class="success" v-if="scope.row.PaymentState===1">充值收入</span>
						<span class="danger" v-if="scope.row.PaymentState===2">扣款支出</span>
						<span class="danger" v-if="scope.row.PaymentState===3">提现支出</span>
						<span class="danger" v-if="scope.row.PaymentState===4">首页无差评支出</span>
						<span class="danger" v-if="scope.row.PaymentState===5">关键词上首页支出</span>
						<span class="danger" v-if="scope.row.PaymentState===6">ASIN关键词报告支出</span>
						<span class="danger" v-if="scope.row.PaymentState===7">店铺体验报告支出</span>
						<span class="danger" v-if="scope.row.PaymentState===8">店铺CPC报告支出</span>
						<span class="danger" v-if="scope.row.PaymentState===9">死因查询支出</span>
						<span class="danger" v-if="scope.row.PaymentState===10">删差评支出</span>
						<span class="warning" v-if="scope.row.PaymentState===11">首页无差评退款</span>
						<span class="warning" v-if="scope.row.PaymentState===12">关键词上首页退款</span>
						<span class="warning" v-if="scope.row.PaymentState===13">ASIN关键词退款</span>
						<span class="warning" v-if="scope.row.PaymentState===14">店铺体验报告退款</span>
						<span class="warning" v-if="scope.row.PaymentState===15">店铺CPC体验报告退款</span>
						<span class="warning" v-if="scope.row.PaymentState===16">死因查询退款</span>
						<span class="danger" v-if="scope.row.PaymentState===17">链接查邮箱支出</span>
						<span class="warning" v-if="scope.row.PaymentState===18">链接查邮箱退款</span>
						<span class="danger" v-if="scope.row.PaymentState===19">订单查邮箱支出</span>
						<span class="warning" v-if="scope.row.PaymentState===20">订单查邮箱退款</span>
						<span class="danger" v-if="scope.row.PaymentState===21">加购总额支出</span>
						<span class="danger" v-if="scope.row.PaymentState===22">心愿单总额支出</span>
						<span class="danger" v-if="scope.row.PaymentState===23">点赞支出</span>
						<span class="danger" v-if="scope.row.PaymentState===24">点踩支出</span>
						<span class="danger" v-if="scope.row.PaymentState===25">上评总额支出</span>
					</template>
				</el-table-column>
				<el-table-column prop="TransactionAmount" label="金额" align="center"></el-table-column>
				<el-table-column prop="TransactionTime" label="交易时间" align="center"></el-table-column>
				<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
			</el-table>

			<!--收支明细工具条-->
			<el-col :span="24" class="toolbar">
				<span style="position: relative;top: 5px;">
					<span>余额：{{balance}}</span>
					<span style="margin-left: 30px;">总收入：{{allIn}}</span>
					<span style="margin-left: 30px;">总支出：{{allOut}}</span>
				</span>
				<el-pagination style="float: right;" @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
				 :current-page="pageNum2" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
				 :total="total2">
				</el-pagination>
			</el-col>
		</el-dialog>

	</section>
</template>

<script>
	import {
		customerList,
		customerState,
		customerMod,
		customerBalance
	} from '@/api/api'

	export default {
		name: 'customer',
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
					state: '0'
				},
				balanceModal: false,
				listLoading2: false,
				tableData2: [],
				pageNum2: 1,
				pageSize2: 10,
				total2: 0,
				searchForm2: {
					keyword: '',
					state: '0'
				},
				balance: 0,
				allIn: 0,
				allOut: 0
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
					Name: _this.searchForm.name,
					Types: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				customerList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//用户启用禁用
			handleState(index, row, val) {
				let _this = this
				var id = row.Id
				let txt = ''
				if (val == 1) {
					txt = '启用'
				}
				if (val == 0) {
					txt = '禁用'
				}
				_this.$confirm('确认 ' + txt + '【' + row.Name + '】吗？', '信息提示', {
					type: 'warning'
				}).then(() => {
					let params = {
						Id: id,
						State: val
					}
					customerState(params).then((res) => {
						_this.getData()
					})
				}).catch(() => {})
			},

			//充值扣款弹窗
			handleMod(index, row, val) {
				let _this = this
				_this.selectId = row.Id
				let txt = ''
				if (val == 1) {
					txt = '充值'
				}
				if (val == 0) {
					txt = '扣款'
				}
				_this.$prompt('请输入' + txt + '金额', '信息提示 ', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
					inputErrorMessage: '金额格式不正确'
				}).then(({
					value
				}) => {
					_this.handModDo(val, value)
				}).catch(() => {})
			},

			//充值扣款
			handModDo(val, value) {
				let _this = this
				let params = {
					Id: _this.selectId,
					State: val,
					Accountbalance: value
				}
				customerMod(params).then(res => {
					_this.getData()
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
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
			},

			//打开收支明细弹窗
			handBalance(index, row) {
				let _this = this
				_this.selectId = row.Id
				_this.title = '客户【' + row.Name + '】收支明细'
				_this.getBalanceData()
			},

			//获取客户收支明细
			getBalanceData() {
				let _this = this
				_this.listLoading2 = true
				let params = {
					UserId: _this.selectId,
					KeyWord: _this.searchForm2.keyword,
					State: _this.searchForm2.state,
					pageNum: _this.pageNum2,
					pagesize: _this.pageSize2
				}
				customerBalance(params).then(res => {
					_this.listLoading2 = false
					_this.tableData2 = res.list
					_this.total2 = Number(res.total)
					_this.balance = res.list[0].AccountBalance
					_this.allIn = res.list[0].AccumulatedIncome
					_this.allOut = res.list[0].AccumulatedExpenditure
					_this.balanceModal = true
				}).catch((e) => {})
			},

			// 关闭收支明细弹窗
			closeBalance() {
				let _this = this
				_this.balanceModal = false
				_this.searchForm2 = {
					keyword: '',
					state: '0'
				}
			},

			//收支明细查询
			searchData2() {
				let _this = this
				_this.pageNum2 = 1
				_this.getBalanceData()
			},

			//翻页
			handleSizeChange2(val) {
				let _this = this
				_this.pageSize2 = val
				_this.getBalanceData()
			},
			//跳转
			handleCurrentChange2(val) {
				let _this = this
				_this.pageNum2 = val
				_this.getBalanceData()
			}

		}
	}
</script>
