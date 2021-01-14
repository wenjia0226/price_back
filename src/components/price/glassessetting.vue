<template>
  <div>
    <!-- 面包屑导航区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>产品设置</el-breadcrumb-item>
         <el-breadcrumb-item>系列产品</el-breadcrumb-item>
     </el-breadcrumb>
     <el-card  style="margin: 20px 0">
      <el-row :gutter="20">
       <el-col :span="6">
       </el-col>
       <el-col :span="6">
          <el-button type="primary" @click="addSeriesProduct">添加产品</el-button>
       </el-col>
      </el-row>
      <el-table :data="this.productSeriesList" border  stripe style="width: 100%;margin: 20px 0">
        <el-table-column label="系列名称" prop="seriesName"></el-table-column>
        <el-table-column label="图片"  prop="imgurl" min-width="20%" >
         <!-- 图片的显示 -->
         <template   slot-scope="scope">
          <el-image style="min-height: 70;height: 70" :src="scope.row.pic" fit="contain"></el-image>
         </template>
      </el-table-column>
	 <!-- <el-table-column label="所属类型" prop="type"></el-table-column> -->
      <el-table-column label="备注" prop="details"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
             <el-button type="danger"  size="middle" icon="el-icon-delete" @click ="removeById(scope.row.id)" ></el-button>
          </template>
      </el-table-column>
      </el-table>
      <!-- 添加对话框 -->
      <el-dialog title="添加产品" :visible.sync="addDialogVisible" width="50%" :before-close="handleClose">
          <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="120px">
              <el-form-item label="所属类型" prop='type'>
				   <el-radio v-model="radio" label="1" @change="getType">价格图片</el-radio>
				    <el-radio v-model="radio" label="2"  @change="getType">详情图片</el-radio>
			  </el-form-item>
			  <el-form-item label="所属标签" prop='label'>
                  <el-select v-model="addForm.label" placeholder="请选择"   @change="handleChange">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="所属系列" prop='label'>
                  <el-select v-model="series" placeholder="请选择"   @change="handleSeriousChange">
                    <el-option
                      v-for="item in seriesOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
             <el-form-item label="图片" >
              <el-upload
                ref="upload"
                action="/as"
                :limit ="1"
                list-type="picture-card"
                :http-request="handleUpload"
                :auto-upload="false"
                >
                <i class="el-icon-plus"></i>
              </el-upload>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitCoparation">确 定</el-button>
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
       token: '',
       series: '',
	   radio: '1',
       productSeriesList: [],
       fileList: [],
       labelId: '',
       productId: '',
       options: '',
        addDialogVisible: false, //控制对话框的显示隐藏
        file: '',
        seriesOptions:[],
        addForm: {
            name: '',
            label: '',
            file: '',
            token: '',
			type: 1
        },
        addRules: {
			type: [{required: true, message: '请选择所属类型', trigger: 'blur' }],
            label: [{required: true, message: '请选择所属标签', trigger: 'blur' }],
            name: [{required: true, message: '请输入姓名', trigger: 'blur' }],
            file: {required: true, message: '选择图片', trigger: 'blur'}
        },
        }
      },
      methods: {
		  getType(val) {
			  this.addForm.type = val;
		  },
        handleSeriousChange(val) {
         this.productId = val;
        },
        handleChange(val) {
          this.addForm.label = val;
          this.labelId = val;
          this.getSeriousProduct();
        },
        getSeriousProduct() {
          let param = new FormData();
          param.append('id', this.labelId);
          axios({
            method: 'post',
            data: param,
            url: '/price/findSeriesBylabel'
          }).then((this.handleGetProductByLabelId.bind(this))).catch((err) => {
            console.log(err)
          })
        },
        handleGetProductByLabelId(res) {
          if(res.data.data) {
            this.seriesOptions = res.data.data;
          }
        },
        handleUpload(raw){
          this.addForm.file = raw.file;
        },
        //添加产品
        submitCoparation() {
         this.$refs.addFormRef.validate((valid) => {
           if(!valid) return;
            this.$refs.upload.submit();
           let param = new FormData();
           if(this.addForm.file) {
			 param.append('type', this.addForm.type);
             param.append('file', this.addForm.file);
             param.append('seriesId', this.productId);
           }else {
             return this.$message.error('请添加图片')
           }

           axios({
               method: 'post',
               url: '/price/addSeriesProduct',
               data: param,
               headers: {
                 'Content-Type': 'multipart/form-data'
               }
           }).then(this.handleAddSucc.bind(this))
           .catch(this.handleAddErr.bind(this))
         })
        },
        handleAddSucc(res) {
            console.log(res);
          if(res.data.status === 10204) {
              this.$message.error(res.data.msg);

             } else if(res.data.status == 10206) {
               this.$message.error(res.data.msg);
              this.addTeacherForm.schoolName = '';
            }else if(res.status == 200){
              this.addDialogVisible = false;
              this.$message.success('添加成功');
              this.$refs.addFormRef.resetFields();
              this.$refs.upload.clearFiles();
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
         this.$refs.addFormRef.resetFields();
        },
        getproductSeriesList() {
          let param = new URLSearchParams();
          axios({
            method: 'post',
            data: param,
             url: '/price/seriesProductList'
          }).then(this.handleCoListSucc.bind(this)).catch(this.handleCoListErr.bind(this))
        },
        handleCoListSucc(res) {
          // console.log(res)
          if(res.data.status == 200) {
            this.productSeriesList = res.data.data
          }

        },
        handleCoListErr(err) {
          console.log(err)
        },
        addTeacher() {

        },
        //根据id删除学校
       async removeById(id) {
          const confirmResult = await this.$confirm('此操作将永久删除该系列, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).catch(err => err)
          if(confirmResult !== 'confirm') {
              return this.$message.info('已经取消删除')
          }
          let param = new URLSearchParams();
          param.append('id', id)
          axios({
              method: 'post',
              url: '/price/deleteSeriesProduct',
              data: param
          }).then(this.handleDeleteSucc.bind(this))
          .catch(this.handleDeleteErr.bind(this))
        },
        handleDeleteSucc(res) {
            if(res.data.status === 10204) {
                this.$message.error(res.data.msg);
                this.$router.push('/login');
            } else if(res.data.status == 200) {
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
        handleGetOptionSucc (res) {
          if(res.data.status === 10204) {
              this.$message.error(res.data.msg);
              this.$router.push('/login');
          } else if(res.data.status == 200) {
           // console.log(res)
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
