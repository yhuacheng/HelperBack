<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-form-item>
					<el-input size="small" v-model="searchForm.keyword" placeholder="客户姓名 / 手机"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker size="small" v-model="searchForm.time" :unlink-panels='true' type="datetimerange" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="searchForm.state" placeholder="状态" size="small">
						<el-option value="0" label="全部状态"></el-option>
						<el-option value="1" label="待确认"></el-option>
						<el-option value="2" label="处理中"></el-option>
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
			<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="ShopId" label="店铺" align="center"></el-table-column>
			<el-table-column prop="ASIN" label="ASIN" align="center"></el-table-column>
			<el-table-column prop="KeyWord" label="关键词" align="center"></el-table-column>
			<el-table-column prop="Title" label="评论标题" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="Message" label="评论内容" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="Productlocation" label="产品位置" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="Remarks" label="备注" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="Price" label="单价" align="center"></el-table-column>
			<el-table-column prop="AddTimes" label="提交时间" align="center"></el-table-column>
			<el-table-column prop="State" label="状态" align="center">
				<template v-slot="scope">
					<span v-if="scope.row.State===1">待确认</span>
					<span class="primary" v-if="scope.row.State===2">处理中</span>
					<span class="success" v-if="scope.row.State===3">成功</span>
					<span class="danger" v-if="scope.row.State===4">失败</span>
					<span class="warning" v-if="scope.row.State===5">已取消</span>
				</template>
			</el-table-column>
			<el-table-column label="截图" align="center">
				<template slot-scope="scope">
					<img style="width: 40px;height: 40px;" v-show="scope.row.Images" :src="scope.row.Images" @click.stop="showImage(scope.$index,scope.row)" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template v-slot="scope">
					<el-button size="small" type="primary" @click.stop="handleUploadImg(scope.$index, scope.row)" v-if="scope.row.State===3">上传截图</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--需要导出的列表-->
		<el-table v-show="false" :data="tableData" style="width: 100%" id="out-table">
			<el-table-column prop="Id" label="编号" align="center"></el-table-column>
			<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="ShopId" label="店铺" align="center"></el-table-column>
			<el-table-column prop="ASIN" label="ASIN" align="center"></el-table-column>
			<el-table-column prop="KeyWord" label="关键词" align="center"></el-table-column>
			<el-table-column prop="Title" label="评论标题" align="center"></el-table-column>
			<el-table-column prop="Message" label="评论内容" align="center"></el-table-column>
			<el-table-column prop="Productlocation" label="产品位置" align="center"></el-table-column>
			<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" type="success" @click="handleMod(1)" :disabled="disabled">确认</el-button>
			<el-button size="small" type="danger" @click="handleMod(2)" :disabled="disabled">取消</el-button>
			<el-button size="small" type="primary" @click="handleMod(3)" :disabled="disabled">改价</el-button>
			<el-button size="small" type="success" @click="handleDone(1)" :disabled="disabled2">成功</el-button>
			<el-button size="small" type="danger" @click="handleDone(0)" :disabled="disabled2">失败</el-button>
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageNum" :page-sizes="[10, 20, 50, 100,10000]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-col>

		<!-- 上传图片 -->
		<el-dialog title="【评论】上传截图" :visible.sync="drImgModal" :close-on-click-modal="false" :before-close="closeDrImgModal"
		 width="30%">
			<div class="txt-c">
				<el-upload class="avatar-uploader" name="Image" action="/api/Upload/PictureUpload" :show-file-list="false"
				 :on-success="handleAvatarSuccessImg" :on-error="handleErrorImg" :before-upload="beforeAvatarUploadImg" accept="image/jpeg,image/png,image/gif,image/bmp">
					<img v-if="imageUrl" :src="imageUrl" class="avatar" />
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
		</el-dialog>

		<!--查看图片大图-->
		<el-dialog title="查看大图" :visible.sync='imageModal' :before-close="closeImageModal">
			<div class="txt-c">
				<img :src='bigImageUrl' style="max-width: 100%;" />
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

	import {
		commentList,
		commentState,
		commentDone,
		commentImage
	} from '@/api/api'

	export default {
		name: 'comment',
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
					time: [],
					state: '0'
				},
				disabled: true,
				disabled2: true,
				drImgModal: false,
				imageUrl: '',
				bigImageUrl: '',
				imageModal: false
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
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					keyWord: _this.searchForm.keyword,
					Statetime: time1,
					Endtime: time2,
					State: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				commentList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
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
					commentState(params).then(res => {
						_this.getData()
					}).catch((e) => {})
				}
				if (val == 2) {
					let params = {
						Id: ids,
						State: 2,
						Price: 0
					}
					commentState(params).then(res => {
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
						commentState(params).then(res => {
							_this.getData()
						}).catch((e) => {})
					}).catch(() => {})
				}
			},

			//处理成功失败
			handleDone(val) {
				let _this = this
				let ids = _this.selsData.map(item => item.Id)
				let params = {
					Id: ids,
					State: val
				}
				commentDone(params).then(res => {
					_this.getData()
				}).catch((e) => {})
			},

			//打开图片上传窗口
			handleUploadImg(index, row) {
				let _this = this
				_this.drImgModal = true
				_this.selectId = row.Id
			},

			// 图片上传
			handleAvatarSuccessImg(res, file) {
				let _this = this
				if (res.Data != '') {
					let image = res.Data
					let params = {
						Id: _this.selectId,
						Images: image
					}
					commentImage(params).then(res => {
						_this.imageUrl = URL.createObjectURL(file.raw);
						_this.getData()
					}).catch((e) => {})
				}
			},
			handleErrorImg(res) {
				this.$message.error('图片上传失败！')
			},
			beforeAvatarUploadImg(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isGIF = file.type === 'image/gif';
				const isBMP = file.type === 'image/bmp';
				const isLt5M = file.size / 1024 / 1024 < 5;
				if (!isJPG && !isPNG && !isGIF && !isBMP) {
					this.$message.error('上传图片必须是JPG/PNG/GIF/BMP 格式!');
				} else if (!isLt5M) {
					this.$message.error('上传图片大小不能超过 5MB!');
				}
				return (isJPG || isPNG || isGIF || isBMP) && isLt5M;
			},

			//关闭图片上传
			closeDrImgModal() {
				let _this = this
				_this.drImgModal = false
				_this.imageUrl = ''
			},

			//查看大图
			showImage(index, row) {
				let _this = this
				_this.imageModal = true
				_this.bigImageUrl = row.Images
			},

			//关闭大图窗口
			closeImageModal() {
				let _this = this
				_this.imageModal = false
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
					_this.disabled2 = true
				} else {
					let dis = false
					let dis2 = false
					for (let x in _this.selsData) {
						if (_this.selsData[x].State != 1) {
							dis = true
						}
						if (_this.selsData[x].State != 2) {
							dis2 = true
						}
					}
					if (dis == true) {
						_this.disabled = true
					} else {
						_this.disabled = false
					}
					if (dis2 == true) {
						_this.disabled2 = true
					} else {
						_this.disabled2 = false
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
					}), '评论.xlsx')
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
