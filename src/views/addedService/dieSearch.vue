<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-form-item>
					<el-input size="small" v-model="searchForm.keyword" placeholder="客户姓名 / 手机"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select size="small" v-model="searchForm.country" placeholder="国家">
						<el-option key="0" label="全部国家" value="0"></el-option>
						<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker size="small" v-model="searchForm.time" :unlink-panels='true' type="datetimerange" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="searchForm.state" placeholder="状态" size="small">
						<el-option value="0" label="全部状态"></el-option>
						<el-option value="1" label="待确认"></el-option>
						<el-option value="2" label="待处理"></el-option>
						<el-option value="3" label="成功"></el-option>
						<el-option value="4" label="失败"></el-option>
						<el-option value="5" label="已取消"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="searchData">查询</el-button>
				</el-form-item>
				<el-form-item class="ml20">
					<el-button type="primary" size="small" @click="exportExcel">导出</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" size="small" @click="drModal=true">导入</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" @selection-change="selsChange" @row-click="rowClick" v-loading="listLoading" style="width: 100%"
		 id="tableData" ref='tableData'>
			<el-table-column type="selection"></el-table-column>
			<el-table-column type="index" label="#" align="center"></el-table-column>
			<el-table-column prop="Name" label="姓名" align="center"></el-table-column>
			<el-table-column prop="CustomerNumber" label="客户编码" align="center"></el-table-column>
			<el-table-column prop="Phone" label="手机" align="center"></el-table-column>
			<el-table-column prop="ServiceName" label="服务名称" align="center"></el-table-column>
			<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="RegisteredEmail" label="注册邮箱" align="center"></el-table-column>
			<el-table-column prop="SellerIdOrAsin" label="SellerIDASIN" align="center"></el-table-column>
			<el-table-column prop="Price" label="价格" align="center"></el-table-column>
			<el-table-column prop="SubTime" label="提交时间" align="center"></el-table-column>
			<el-table-column prop="State" label="状态" align="center">
				<template v-slot="scope">
					<span v-if="scope.row.State===1">待确认</span>
					<span class="primary" v-if="scope.row.State===2">处理中</span>
					<span class="success" v-if="scope.row.State===3">成功</span>
					<span class="danger" v-if="scope.row.State===4">失败</span>
					<span class="warning" v-if="scope.row.State===5">已取消</span>
				</template>
			</el-table-column>
		</el-table>

		<!--需要导出的列表-->
		<el-table v-show="false" :data="tableData" style="width: 100%" id="out-table">
			<el-table-column prop="Id" label="编号" align="center"></el-table-column>
			<el-table-column prop="ServiceName" label="服务名称" align="center"></el-table-column>
			<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="RegisteredEmail" label="注册邮箱" align="center"></el-table-column>
			<el-table-column prop="SellerIdOrAsin" label="SellerIDASIN" align="center"></el-table-column>
			<el-table-column label="状态" align="center"></el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" type="success" @click="handleMod(1)" :disabled="disabled">确认</el-button>
			<el-button size="small" type="danger" @click="handleMod(2)" :disabled="disabled">取消</el-button>
			<el-button size="small" type="primary" @click="handleMod(3)" :disabled="disabled">改价</el-button>
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageNum" :page-sizes="[10, 20, 50, 100,10000]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-col>

		<!-- 导入 -->
		<el-dialog title="【死因查询】文件导入" :visible.sync="drModal" :close-on-click-modal="false" :before-close="closeDrModal"
		 width="30%">
			<el-form ref="drForm" class="txt-c">
				<el-upload ref="upload" :limit="1" drag action="/api/BackBugQuery/ExcelBugQuery" multiple :on-success="handleAvatarSuccess"
				 :on-error="handleError" :before-upload="beforeAvatarUpload" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
						<p class="danger">只能上传规范的Excel文件</p><br>
					</div>
				</el-upload>
			</el-form>
		</el-dialog>

	</section>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

	import {
		dieSearchList,
		dieSearchState,
		countryList
	} from '@/api/api'

	export default {
		name: 'dieSearch',
		data() {
			return {
				title: '',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				listLoading: false,
				btnLoading: false,
				tableData: [],
				selsData: [],
				selectId: '',
				searchForm: {
					keyword: '',
					country: '0',
					time: [],
					state: '0'
				},
				disabled: true,
				drModal: false,
				countryData: []
			}
		},
		created() {
			this.getData()
			this.getCountryData()
		},
		methods: {
			// 获取列表数据
			getData() {
				let _this = this
				_this.listLoading = true
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					KeyWord: _this.searchForm.keyword,
					CountryId: _this.searchForm.country,
					Statetime: time1,
					Endtime: time2,
					State: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				dieSearchList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			// 获取国家数据
			getCountryData() {
				let _this = this
				let params = {
					CountryName: '',
					pageNum: 1,
					pagesize: 100000000
				}
				countryList(params).then(res => {
					_this.countryData = res
				}).catch((e) => {})
			},

			//确认、取消、改价
			handleMod(val) {
				let _this = this
				let ids = _this.selsData.map(item => item.Id)
				if (val == 1) {
					let params = {
						Id: ids,
						State: 1,
						Price: 0
					}
					dieSearchState(params).then(res => {
						_this.getData()
					}).catch((e) => {})
				}
				if (val == 2) {
					let params = {
						Id: ids,
						State: 2,
						Price: 0
					}
					dieSearchState(params).then(res => {
						_this.getData()
					}).catch((e) => {})
				}
				if (val == 3) {
					_this.$prompt('请输入新价格', '信息提示 ', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						inputPattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
						inputErrorMessage: '金额格式不正确'
					}).then(({
						value
					}) => {
						let params = {
							Id: ids,
							State: 3,
							Price: value
						}
						dieSearchState(params).then(res => {
							_this.getData()
						}).catch((e) => {})
					}).catch(() => {})
				}
			},

			// 文件上传
			handleAvatarSuccess(res, file) {
				if (res.Code == 'ok') {
					this.$message.success('文件导入成功！')
					this.getData()
				} else {
					this.$message.error('文件导入失败！')
				}
			},
			handleError(res) {
				this.$message.error('文件导入失败！')
			},
			beforeAvatarUpload(file) {
				const isXLS = file.type === 'application/vnd.ms-excel';
				const isSLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
				if (!isXLS && !isSLSX) {
					this.$message.error('上传的文件必须为Excel');
				}
				return (isXLS || isSLSX)
			},

			//关闭文件上传框
			closeDrModal() {
				let _this = this
				_this.drModal = false
				_this.$refs.upload.clearFiles()
			},


			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
			},

			//选中行
			rowClick(row) {
				let _this = this
				let findResult = _this.selsData.findIndex((value, index) => {
					return value == row
				})
				if (findResult != -1) {
					_this.$refs.tableData.toggleRowSelection(row, false);
				} else {
					_this.$refs.tableData.toggleRowSelection(row, true);
				}
			},

			//选中数据 和 按钮禁用
			selsChange(selsData) {
				let _this = this
				_this.selsData = selsData
				if (_this.selsData.length === 0) {
					_this.disabled = true
				} else {
					let dis = false
					for (let x in _this.selsData) {
						if (_this.selsData[x].State != 1) {
							dis = true
						}
					}
					if (dis == true) {
						_this.disabled = true
					} else {
						_this.disabled = false
					}
				}
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

			// 导出
			exportExcel() {
				var xlsxParam = {
					raw: true
				}
				var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'), xlsxParam)
				var wbout = XLSX.write(wb, {
					bookType: 'xlsx',
					bookSST: true,
					type: 'array'
				})
				try {
					FileSaver.saveAs(new Blob([wbout], {
						type: 'application/octet-stream'
					}), '死因查询.xlsx')
				} catch (e) {
					if (typeof console !== 'undefined') {
						console.log(e, wbout)
					}
				}
				return wbout
			}
		}
	}
</script>
