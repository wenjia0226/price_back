<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>产品设置</el-breadcrumb-item>
			<el-breadcrumb-item>具体类型</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card style="margin: 20px 0">
			<el-row :gutter="20">
				<el-col :span="2">
					<div  class ="name">标签选择</div>
				</el-col>
				<el-col :span="4">
					<el-select v-model="searchLabel" clearable placeholder="请选择" @change="handleLabelChange">
						<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="2">
					<div class="name">产品选择</div>
				</el-col>
				<el-col :span="4">
					<el-select v-model="searchSeries" clearable placeholder="请选择" @change="handleSeriesChange">
						<el-option v-for="item in searchSeriesOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span='2'>
					<el-button type="primary" @click="search">搜索</el-button>
				</el-col>
				<el-col :span="6" :offset="4">
					<el-button type="success" @click="addSeriesProduct">新增类型</el-button>
				</el-col>
			</el-row>
			<el-table :data="this.productSeriesList" border stripe style="width: 100%;margin: 20px 0">
				<el-table-column label="所属标签" prop="labelName"></el-table-column>
				<el-table-column label="所属系列" prop="seriesName"></el-table-column>
				<el-table-column label="类型名称" prop="name"></el-table-column>
				<el-table-column label="折射率" prop="refractive"></el-table-column>
				<el-table-column label="阿贝数" prop="abbe"></el-table-column>
				<el-table-column label="膜层" prop="film"></el-table-column>
				<el-table-column label="隐形标记" prop="covert"></el-table-column>
				<el-table-column label="下加光" prop="addLightBelow"></el-table-column>
				<el-table-column label="现片价" prop="presentPrice"></el-table-column>
				<el-table-column label="定制价" prop="customPrice"></el-table-column>
				<el-table-column label="基准线" prop="benchmark"></el-table-column>
				<el-table-column label="光度范围"  prop="picture">
				   <!-- 图片的显示 -->
				   <template   slot-scope="scope">
				    <el-image style="min-height: 70;height: 70" :src="scope.row.picture" fit="contain"></el-image>
				   </template>
				</el-table-column>
				<el-table-column label="定制片光度范围"  prop="customFile">
				   <!-- 图片的显示 -->
				   <template   slot-scope="scope">
				    <el-image style="min-height: 70;height: 70" :src="scope.row.customFile" fit="contain"></el-image>
				   </template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="middle" icon="el-icon-edit" @click="editById(scope.row.id)"></el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="danger" size="middle" icon="el-icon-delete" @click="removeById(scope.row.id)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页功能 -->
			<el-pagination v-show="!searchResult" background :current-page="this.number" @current-change="handleCurrentChange"
			 layout="prev, pager, next" :page-size="this.size" :total="this.totalElements">
			</el-pagination>
			<!-- 添加对话框 -->
			<el-dialog title="添加类型" :visible.sync="addDialogVisible" width="50%" :before-close="handleClose">
				<el-form :model="addClassForm" :rules="addRules" ref="addClassFormRef" label-width="120px">
					<el-form-item label="所属标签">
						<el-select v-model="labelId" placeholder="请选择" @change="handleChange">
							<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属系列">
						<el-select v-model="seriesId" placeholder="请选择" @change="handleSeriousChange">
							<el-option v-for="item in seriesOptions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="类型名称" prop="name">
						<el-input v-model="addClassForm.name"></el-input>
					</el-form-item>
					<el-form-item label="折射率" prop="refractive">
						<el-input v-model="addClassForm.refractive"></el-input>
					</el-form-item>
					<el-form-item label="阿贝数" prop="abbe">
						<el-input v-model="addClassForm.abbe"></el-input>
					</el-form-item>
					<el-form-item label="膜层" >
						<el-input v-model="addClassForm.film"></el-input>
					</el-form-item>
					<el-form-item label="隐形标记" >
						<el-input v-model="addClassForm.covert"></el-input>
					</el-form-item>
					<el-form-item label="下加光">
						<el-input v-model="addClassForm.addLightBelow"></el-input>
					</el-form-item>
					<el-form-item label="现片价">
						<el-input v-model="addClassForm.presentPrice"></el-input>
					</el-form-item>
					<el-form-item label="定制价" >
						<el-input v-model="addClassForm.customPrice"></el-input>
					</el-form-item>
					<el-form-item label="基准线" >
						<el-input v-model="addClassForm.benchmark"></el-input>
					</el-form-item>
					<el-form-item label="球镜">
						<el-input v-model="addClassForm.sphericalMirror"></el-input>
					</el-form-item>
					<el-form-item label="柱镜">
						<el-input v-model="addClassForm.colonoscope"></el-input>
					</el-form-item>
					<el-form-item label="现片">
						<el-input v-model="addClassForm.onTheSpot"></el-input>
					</el-form-item>
					<el-form-item label="偏光价">
						<el-input v-model="addClassForm.polarizing"></el-input>
					</el-form-item>
					<el-form-item label="通道">
						<el-input v-model="addClassForm.passageway"></el-input>
					</el-form-item>
					<el-form-item label="偏光定制价">
						<el-input v-model="addClassForm.pricepol"></el-input>
					</el-form-item>
					<el-form-item label="蓝光片价">
						<el-input v-model="addClassForm.bluray"></el-input>
					</el-form-item>
					<el-form-item label="光度范围">
						<el-upload
							ref="upload"
				 　　  class="upload-demo"
					　　 action="/as"
					　　 :limit= "1"
							:http-request="handleDetailUpload"
					　　:auto-upload="false"
					　　list-type="picture">
					　　<el-button size="small" type="primary">点击上传</el-button>
					　  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				　		</el-upload>
					</el-form-item>
					<el-form-item label="定制片光度范围">
							<el-upload
								ref="custompload"
					 　　  class="upload-demo"
								action="/as"
						　　 :limit= "1"
								:http-request="handleCustomUpload"
						　　:auto-upload="false"
						　　list-type="picture">
						　　<el-button size="small" type="primary">点击上传</el-button>
						　  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					　		</el-upload>
						</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitCoparation">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 修改对话框 -->
			<el-dialog title="修改类型" :visible.sync="editDialogVisible" width="50%" :before-close="handleEditClose">
				<el-form :model="editClassForm" :rules="editRules" ref="editClassFormRef" label-width="120px">
					<el-form-item label="所属标签" prop='label'>
						<el-select v-model="editClassForm.labelId" placeholder="请选择" @change="handleEditLbelChange">
							<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属系列">
						<el-select v-model="editClassForm.seriesId" placeholder="请选择" @change="handleEditSeriesChange">
							<el-option v-for="item in seriesOptions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="类型名称" prop="name">
						<el-input v-model="editClassForm.name"></el-input>
					</el-form-item>
					<el-form-item label="折射率" prop="refractive">
						<el-input v-model="editClassForm.refractive"></el-input>
					</el-form-item>
					<el-form-item label="阿贝数" prop="abbe">
						<el-input v-model="editClassForm.abbe"></el-input>
					</el-form-item>
					<el-form-item label="膜层" >
						<el-input v-model="editClassForm.film"></el-input>
					</el-form-item>
					<el-form-item label="隐形标记" >
						<el-input v-model="editClassForm.covert"></el-input>
					</el-form-item>
					<el-form-item label="下加光" >
						<el-input v-model="editClassForm.addLightBelow"></el-input>
					</el-form-item>
					<el-form-item label="现片价">
						<el-input v-model="editClassForm.presentPrice"></el-input>
					</el-form-item>
					<el-form-item label="定制价" >
						<el-input v-model="editClassForm.customPrice"></el-input>
					</el-form-item>
					<el-form-item label="基准线" >
						<el-input v-model="editClassForm.benchmark"></el-input>
					</el-form-item>
					<el-form-item label="光度范围">
							<el-upload
								ref="editUpload"
					 　　  class="upload-demo"
						　　 action="/as"
						　　 :limit= "1"
								:http-request="handleEditUpload"
						　　:auto-upload="false"
								:file-list = "fileList"
						　　list-type="picture">
						　　<el-button size="small" type="primary">点击上传</el-button>
						　  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					　		</el-upload>
					</el-form-item>
					<el-form-item label="定制片光度范围">
							<el-upload
								ref="customEeditUpload"
					 　　  class="upload-demo"
						　　 action="/as"
						　　 :limit= "1"
								:http-request="handleCumstomEditUpload"
						　　:auto-upload="false"
								:file-list = "customfileList"
						　　list-type="picture">
						　　<el-button size="small" type="primary">点击上传</el-button>
						　  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					　		</el-upload>
					</el-form-item>
					<el-form-item label="球镜">
						<el-input v-model="editClassForm.sphericalMirror"></el-input>
					</el-form-item>
					<el-form-item label="柱镜">
						<el-input v-model="editClassForm.colonoscope"></el-input>
					</el-form-item>
					<el-form-item label="现片">
						<el-input v-model="editClassForm.onTheSpot"></el-input>
					</el-form-item>
					<el-form-item label="偏光价">
						<el-input v-model="editClassForm.polarizing"></el-input>
					</el-form-item>
					<el-form-item label="通道">
						<el-input v-model="editClassForm.passageway"></el-input>
					</el-form-item>
					<el-form-item label="偏光定制价">
						<el-input v-model="editClassForm.pricepol"></el-input>
					</el-form-item>
					<el-form-item label="蓝光片价">
						<el-input v-model="editClassForm.bluray"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitEdit">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>
<script>
	import axios from 'axios'
	export default {
		created() {
			this.getproductSeriesList();
			this.getOPtions();
		},
		data() {
			return {
				searchResult: false,
				searchLabel: '',
				searchSeries: '',
				searchSeriesOptions: [],
				token: '',
				editId: '',
				editDialogVisible: false,
				seriesId: '',
				editSeriesId: '',
				editlabelId: '',
				radio: '1',
				label: '',
				productSeriesList: [],
				totalElements: 0,
				number: 1,
				size: 10,
				labelId: '',
				productId: '',
				options: '',
				addDialogVisible: false, //控制对话框的显示隐藏
				file: '',
				fileList: [{url: ''}],
				customfileList: [{url: ''}],
				page: 1,
				seriesOptions: [],
				addClassForm: {
					seriesId: '',
					name: '',
					refractive: '',
					abbe: '',
					film: '',
					comtomFile: '',
					covert: '',
					addLightBelow: '',
					presentPrice: '',
					customPrice: '',
					picture: '',
					benchmark: '',
					sphericalMirror: '',
					colonoscope: '',
					onTheSpot: '',
					polarizing: '',
					passageway: '',
					pricepol: '',
					bluray: ''
				},
				addRules: {
					benchmark: [{
						required: true,
						message: '请输入基准线',
						trigger: 'blur'
					}],
					seriesId: [{
						required: true,
						message: '请选择所属类型',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入类型名称',
						trigger: 'blur'
					}],
					refractive: [{
						required: true,
						message: '请输入折射率',
						trigger: 'blur'
					}],
					abbe: [{
						required: true,
						message: '请输入阿贝数',
						trigger: 'blur'
					}],
					film: [{
						required: true,
						message: '请输入膜层',
						trigger: 'blur'
					}],
					covert: [{
						required: true,
						message: '请输入隐形标记',
						trigger: 'blur'
					}],
					addLightBelow: [{
						required: true,
						message: '请输入下加光',
						trigger: 'blur'
					}],
					presentPrice: [{
						required: true,
						message: '请输入现片价',
						trigger: 'blur'
					}],
					customPrice: [{
						required: true,
						message: '请输入定制价',
						trigger: 'blur'
					}]
				},
				editClassForm: {
					seriesId: '',
					name: '',
					refractive: '',
					abbe: '',
					film: '',
					editComtomFile: '',
					file: '',
					customFile: '',
					covert: '',
					addLightBelow: '',
					presentPrice: '',
					customPrice: '',
					benchmark: '',
					sphericalMirror: '',
					colonoscope: '',
					onTheSpot: '',
					polarizing: '',
					passageway: '',
					pricepol: '',
					bluray: ''
				},
				editRules: {
					benchmark: [{
						required: true,
						message: '请输入基准线',
						trigger: 'blur'
					}],
					seriesId: [{
						required: true,
						message: '请选择所属类型',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入类型名称',
						trigger: 'blur'
					}],
					refractive: [{
						required: true,
						message: '请输入折射率',
						trigger: 'blur'
					}],
					abbe: [{
						required: true,
						message: '请输入阿贝数',
						trigger: 'blur'
					}],
					film: [{
						required: true,
						message: '请输入膜层',
						trigger: 'blur'
					}],
					covert: [{
						required: true,
						message: '请输入隐形标记',
						trigger: 'blur'
					}],
					addLightBelow: [{
						required: true,
						message: '请输入下加光',
						trigger: 'blur'
					}],
					presentPrice: [{
						required: true,
						message: '请输入现片价',
						trigger: 'blur'
					}],
					customPrice: [{
						required: true,
						message: '请输入定制价',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			handleDetailUpload(raw) {
			   this.addClassForm.file = raw.file;
			},
			handleCustomUpload(raw) {
				this.addClassForm.customFile = raw.file;
			},
			handleEditUpload(raw) {
				this.editClassForm.file = raw.file;
			},
			handleCumstomEditUpload(raw) {
				this.editClassForm.customFile = raw.file;
			},
			handleLabelChange(val) {
				this.getSearchSeriesProduct(val);
				//this.getSeriousProduct(val);
			},
			handleSeriesChange(val) {
				this.searchSeries = val;
			},
			search() {
				let param = new FormData();
				param.append('seriesId', this.searchSeries);
				axios({
					method: 'post',
					data: param,
					url: '/price/findGlassesBySeries'
				}).then((res) => {
					// console.log(res)
					if (this.seriesId) {
						this.searchResult = true;
					} else {
						this.searchResult = false;
					}
					if (res.data.status == 200) {
						res ? res = res.data.data : '';
						this.productSeriesList = res.content;
						this.totalElements = res.totalElements;
						this.size = res.size;
						this.number = res.number + 1;
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getproductSeriesList();
			},
			editById(id) {
				this.editDialogVisible = true;
				this.editId = id;
				let param = new FormData();
				param.append('id', id);
				axios({
					method: 'post',
					data: param,
					url: '/price/editGlasses'
				}).then((this.handleEditById.bind(this))).catch((err) => {
					console.log(err)
				})
			},
			handleEditById(res) {
				if (res.data.data) {
					this.editClassForm = res.data.data;
					this.editSeriesId = res.data.data.seriesId;
					this.editlabelId = res.data.data.labelId;
					if(res.data.data.picture) {
						this.fileList[0].url = res.data.data.picture;
					}else if(res.data.data.picture == 'https://www.guangliangkongjian.com/images/null') {
						this.fileList[0].url = '';
					}
					this.customfileList[0].url = res.data.data.customFile;
					this.getSeriousProduct(this.editClassForm.labelId);
				}
			},
			submitEdit() {
				this.$refs.editClassFormRef.validate((valid) => {
					if (!valid) return;
					if (!this.editSeriesId) {
						this.$message.error('请先添加系列');
						return;
					} else {
						this.$refs.editUpload.submit();
						this.$refs.customEeditUpload.submit();
						let param = new FormData();
						param.append('id', this.editId);
						param.append('seriesId', this.editSeriesId);
						param.append('labelId', this.editlabelId);
						param.append('name', this.editClassForm.name);
						param.append('refractive', this.editClassForm.refractive);
						param.append('abbe', this.editClassForm.abbe);
						param.append('file', this.editClassForm.file);
						param.append('file1', this.editClassForm.customFile);
						param.append('covert', this.editClassForm.covert);
						param.append('addLightBelow', this.editClassForm.addLightBelow);
						param.append('presentPrice', this.editClassForm.presentPrice);
						param.append('customPrice', this.editClassForm.customPrice);
						param.append('benchmark', this.editClassForm.benchmark);
						param.append('sphericalMirror', this.editClassForm.sphericalMirror);
						param.append('colonoscope', this.editClassForm.colonoscope);
						param.append('onTheSpot', this.editClassForm.onTheSpot);
						param.append('polarizing', this.editClassForm.polarizing);
						param.append('passageway', this.editClassForm.passageway);
						param.append('pricepol', this.editClassForm.pricepol);
						param.append('bluray', this.editClassForm.bluray);
						axios({
								method: 'post',
								url: '/price/saveGlasses',
								data: param
							}).then(this.handleEditSucc.bind(this))
							.catch(this.handleAddErr.bind(this))
					}
				})
			},
			handleEditSucc(res) {
				if (res.data.status == 200) {
					this.editDialogVisible = false;
					this.$message.success('修改成功');
					this.$refs.editClassFormRef.resetFields();
					this.editClassForm.presentPrice = '';
					this.seriesId = '';
					this.getproductSeriesList();
				}
			},
			handleEditLbelChange(val) {
				this.editlabelId = val;
				this.editClassForm.seriesName = '';
				this.getSeriousProduct(val);
			},
			handleEditSeriesChange(val) {
				this.editSeriesId = val;
			},
			handleSeriousChange(val) {
				this.seriesId = val;
			},
			handleChange(val) {
				this.labelId = val;
				this.getSeriousProduct(val);
			},
			getSeriousProduct(val) {
				let param = new FormData();
				param.append('id', val);
				axios({
					method: 'post',
					data: param,
					url: '/price/findSeriesBylabel'
				}).then((this.handleGetProByLabelId.bind(this))).catch((err) => {
					console.log(err)
				})
			},
			handleGetProByLabelId(res) {
				if (res.data.data) {
					this.seriesOptions = res.data.data;
				}
			},
			getSearchSeriesProduct(val) {
				let param = new FormData();
				param.append('id', val);
				axios({
					method: 'post',
					data: param,
					url: '/price/findSeriesBylabel'
				}).then((this.handleGetProductByLabelId.bind(this))).catch((err) => {
					console.log(err)
				})
			},
			handleGetProductByLabelId(res) {
				//console.log(res)
				if (res.data.data) {
					this.searchSeriesOptions = res.data.data;
				}
			},
			//添加产品
			submitCoparation() {
				 this.$refs.upload.submit();
				 this.$refs.custompload.submit();
				 this.$refs.addClassFormRef.validate((valid) => {
					if (!valid) return;
					if (!this.seriesId || !this.labelId) {
						this.$message.error('请先添加系列和标签');
						return;
					} else {
						let param = new FormData();
						param.append('labelId', this.labelId);
						param.append('seriesId', this.seriesId);
						param.append('name', this.addClassForm.name);
						param.append('refractive', this.addClassForm.refractive);
						param.append('abbe', this.addClassForm.abbe);
						param.append('film', this.addClassForm.film);
						param.append('file', this.addClassForm.file);
						param.append('file1', this.addClassForm.customFile);
						param.append('covert', this.addClassForm.covert);
						param.append('addLightBelow', this.addClassForm.addLightBelow);
						param.append('presentPrice', this.addClassForm.presentPrice);
						param.append('customPrice', this.addClassForm.customPrice);
						param.append('benchmark', this.addClassForm.benchmark);
						param.append('sphericalMirror', this.addClassForm.sphericalMirror);
						param.append('colonoscope', this.addClassForm.colonoscope);
						param.append('onTheSpot', this.addClassForm.onTheSpot);
						param.append('polarizing', this.addClassForm.polarizing);
						param.append('passageway', this.addClassForm.passageway);
						param.append('pricepol', this.addClassForm.pricepol);
						param.append('bluray', this.addClassForm.bluray);
						axios({
								method: 'post',
								url: '/price/addGlasses',
								data: param
							}).then(this.handleAddSucc.bind(this))
							.catch(this.handleAddErr.bind(this))
					}
				})
			},
			handleAddSucc(res) {
				//console.log(res);
				if (res.data.status === 10204) {
					this.$message.error(res.data.msg);

				} else if (res.data.status == 10206) {
					this.$message.error(res.data.msg);
					this.addTeacherForm.schoolName = '';
				} else if (res.status == 200) {
					this.addDialogVisible = false;
					this.$message.success('添加成功');
					this.$refs.addClassFormRef.resetFields();
					this.addClassForm.presentPrice = '';
					this.seriesId = '';
					this.getproductSeriesList();
				}
			},
			handleAddErr(err) {
				console.log(err)
			},
			addSeriesProduct() {
				this.addDialogVisible = true;
			},
			//关闭按钮
			handleClose() {
				this.addDialogVisible = false;
				this.$refs.addClassFormRef.resetFields();
				this.addClassForm.presentPrice = '';
				this.seriesId = '';
				this.labelId = '';
			
			},
			handleEditClose() {
				this.editDialogVisible = false;
				 this.$refs.editClassFormRef.resetFields();
				 this.fileList.url = '';
				 
			},
			getproductSeriesList() {
				let param = new URLSearchParams();
				param.append('page', this.page);
				axios({
					method: 'post',
					data: param,
					url: '/price/findGlassesBySeries'
				}).then(this.handleCoListSucc.bind(this)).catch(this.handleCoListErr.bind(this))
			},
			handleCoListSucc(res) {
				if (res.data.status == 200) {
					res ? res = res.data.data : '';
					this.productSeriesList = res.content;
					this.totalElements = res.totalElements;
					this.size = res.size;
					this.number = res.number + 1;
				}

			},
			handleCoListErr(err) {
				console.log(err)
			},
			//根据id删除学校
			async removeById(id) {
				const confirmResult = await this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('已经取消删除')
				}
				let param = new URLSearchParams();
				param.append('id', id)
				axios({
						method: 'post',
						url: '/price/deleteGlasses',
						data: param
					}).then(this.handleDeleteSucc.bind(this))
					.catch(this.handleDeleteErr.bind(this))
			},
			handleDeleteSucc(res) {
				if (res.data.status === 10204) {
					this.$message.error(res.data.msg);
					this.$router.push('/login');
				} else if (res.data.status == 200) {
					this.$message.success('删除成功');
					this.getproductSeriesList()
				}
			},
			handleDeleteErr(err) {
				console.log(err)
			},
			//获取级联选择器中的数据
			getOPtions() {
				let param = new URLSearchParams();
				param.append('token', this.token);
				axios({
					method: 'post',
					url: '/price/labelList',
					data: param
				}).then(this.handleGetOptionSucc.bind(this)).catch(this.handleGetOptionErr.bind(this))
			},
			handleGetOptionSucc(res) {
				if (res.data.status === 10204) {
					this.$message.error(res.data.msg);
					this.$router.push('/login');
				} else if (res.data.status == 200) {
					this.options = res.data.data;
				}
			},
			handleGetOptionErr(err) {
				console.log(err)
			},
		}
	}
</script>
<style>
</style>
