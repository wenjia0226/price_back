<template>
	<div>
		<el-card style="margin: 20px 0">
		  <el-row :gutter="20">
		      <el-col :span="6">
		       <el-button type="primary" @click="showEdit">修改密码</el-button>
		      </el-col>
		   </el-row>
		</el-card>
		<el-dialog title="添加系列" :visible.sync="showEditDialog" width="50%" :before-close="handleClose">
		    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
		    <el-form-item label="旧密码" prop="oldPassword">
		        <el-input v-model="editForm.oldPassword"></el-input>
		    </el-form-item>
			<el-form-item label="新密码" prop="newPassword">
			    <el-input v-model="editForm.newPassword"></el-input>
			</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="showEditDialog = false">取 消</el-button>
			    <el-button type="primary" @click="submitChange">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				showEditDialog: false,
				editForm: {
					oldPassword: '',
					newPassword: ''
				},
				editRules: {
				    oldPassword: [{required: true, message: '请输入旧密码', trigger: 'blur' }],
				    newPassword: [{required: true, message: '请输入新密码', trigger: 'blur' }],
				}
			}
		},
		methods: {
			showEdit() {
				this.showEditDialog = true;
			},
			handleClose() {
				this.showEditDialog = false;
				this.$refs.editFormRef.resetFields();
			},
			submitChange() {
				this.$refs.editFormRef.validate((valid) => {
				  if(!valid) return;
				let param = new FormData();
				param.append('oldPassword', this.editForm.oldPassword)
				param.append('newPassword',this.editForm.newPassword);
				axios({
					method: 'post',
					data: param,
					url: '/lightspace/priceclient/changePassword'
				}).then(this.handleChangeWordSucc.bind(this)).catch((err) => {console.log(err)})
				})	
			},
			handleChangeWordSucc(res) {
				//console.log(res)
				if(res.data.status == 200) {
					this.showEditDialog = false;
					this.$refs.editFormRef.resetFields();
					this.$message.success('修改成功')
				}else {
					this.$message.error(res.data.msg)
				}
			}
			
		}
	}
</script>

<style>
</style>
