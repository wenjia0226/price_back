<template>
  <div>
    <!-- 面包屑导航区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>价格表</el-breadcrumb-item>
         <el-breadcrumb-item>标签设置</el-breadcrumb-item>
     </el-breadcrumb>
     <el-card style="margin: 20px 0">
       <el-row :gutter="20">
           <el-col :span="6">
            <el-button type="primary" @click="addLabel">新增标签</el-button>
           </el-col>
        </el-row>
       <el-table :data="this.content" border  stripe style="width: 100%;margin: 20px 0">
         <el-table-column label="标签名" prop="name"></el-table-column>
         <el-table-column label="标签路径" prop="path"></el-table-column>
         <el-table-column label="操作">
             <template slot-scope="scope">
                <el-button type="primary" size="middle" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
             </template>
         </el-table-column>
         <el-table-column label="操作">
             <template slot-scope="scope">
                <el-button type="danger"  size="middle" icon="el-icon-delete" @click ="removeLabelById(scope.row.id)" ></el-button>
             </template>
         </el-table-column>
       </el-table>
     </el-card>
     <!-- 添加对话框 -->
     <el-dialog title="添加标签" :visible.sync="addDialogVisible" width="50%" :before-close="handleClose">
         <el-form :model="addLabelForm" :rules="addLabelRules" ref="addLabelRef" label-width="120px">
             <el-form-item label="标签名称" prop="name" >
                 <el-input v-model="addLabelForm.name"></el-input>
             </el-form-item>
             <el-form-item label="标签路径" prop="path" >
                 <el-input v-model="addLabelForm.path"></el-input>
             </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
             <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="submitLabel">确 定</el-button>
         </span>
     </el-dialog>
     <!-- 修改用户对话框 -->
     <el-dialog title="修改标签信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
       <el-form :model="editLabelForm" :rules="editLabelRules" ref="editLabelRef" label-width="120px">
           <el-form-item label="标签名称" prop="name" >
               <el-input v-model="editLabelForm.name"></el-input>
           </el-form-item>
           <el-form-item label="标签路径" prop="path" >
               <el-input v-model="editLabelForm.path"></el-input>
           </el-form-item>
       </el-form>
		 <span slot="footer" class="dialog-footer">
			 <el-button @click="editDialogVisible = false">取 消</el-button>
			 <el-button type="primary" @click="editLabelInfo">确 定</el-button>
		 </span>
    </el-dialog>
   </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'Label',
    data () {
      return {
        id: '',
        token: '',
        query: '',
        currentPage: 1,
        pageSize: 5,
        total: 0,
        options: [],
        LabelList: [],
        content: [],
        editDialogVisible: false,
        addDialogVisible: false, //控制对话框的显示隐藏
        tea_cat: [],
        addLabelForm: {
            name: '',
            path: ''
        },
        page: 1,
        size: 5,
        total:0,
        totalElements: 0,
        number: 1,
        addLabelRules: {
          name: [{required: true, message: '请输入标签名', trigger: 'blur' }],
          path: [{required: true, message: '请输入标签路径', trigger: 'blur' }],
        },

        editLabelForm: {
           name: '',
           path: ''
        },
        editLabelRules: {
          name: [{required: true, message: '请输入标签名', trigger: 'blur' }],
           path: [{required: true, message: '请输入标签路径', trigger: 'blur' }],
        },
      }
    },
    created() {
      this.getLabelList();
    },
    methods: {
      //添加标签
      submitLabel() {
         this.$refs.addLabelRef.validate((valid) => {
             if(!valid) return;
             let param = new URLSearchParams();
             param.append('name', this.addLabelForm.name);
             param.append('path', this.addLabelForm.path);
             param.append('token', this.token);
             axios({
                 method: 'post',
                 url: '/lightspace/addLabel',
                 data: param
             }).then(this.handleAddLabelSucc.bind(this))
             .catch(this.handleAddLabelErr.bind(this))
         })
      },
      handleAddLabelSucc(res) {
        if(res.data.status === 10204) {
            this.$message.error(res.data.msg);
           } else if(res.data.status == 10206) {
             this.$message.error(res.data.msg);
            this.addLabelForm.schoolName = '';
          }else if(res.status == 200){
            this.addDialogVisible = false;
            this.$message.success('添加标签成功');
            this.$refs.addLabelRef.resetFields();
            this.getLabelList();
          }
      },
      handleAddLabelErr(err) {
          console.log(err)
      },
      addLabel() {
        this.addDialogVisible = true;
      },
      //关闭按钮
      handleClose() {
       this.addDialogVisible = false;
       this.$refs.addLabelRef.resetFields();
      },
      getLabelList() {
        let param = new URLSearchParams();
        axios({
          method: 'post',
          data: param,
           url: '/lightspace/labelList'
        }).then(this.handleGetLabelListSucc.bind(this)).catch(this.handleGetLabelErr.bind(this))
      },
      handleGetLabelListSucc(res) {
        if(res.data.status == 200 && res.data.data !== '') {
         this.content = res.data.data;
         }
      },
      handleGetLabelErr(err) {
        console.log(err)
      },
     showEditDialog (id) {
       this.id = id;
         this.editDialogVisible = true;
        let param = new URLSearchParams();
         param.append('id', id);
         axios({
             method: 'post',
             url: '/lightspace/editLabel',
             data: param
         }).then(this.handleEditLabelSucc.bind(this))
         .catch(this.handleEditLabelErr.bind(this))
     },
     handleEditLabelSucc(res) {
       // console.log(res)
       if(res.data.status === 10204) {
           this.$message.error(res.data.msg);
           this.$router.push('/login');
          } else if(res.data.status == 200) {
           this.editLabelForm = res.data.data;
         }
     },
     handleEditLabelErr(err) {
         console.log(err)
     },
     //监听修改用户对话框的关闭事件
     editDialogClosed() {
        this.$refs.editLabelRef.resetFields()
     },
     //修改保存
    editLabelInfo() {
      this.$refs.editLabelRef.validate((valid) => {
         if(!valid)  return;
         let param = new URLSearchParams();
         param.append('name', this.editLabelForm.name);
         param.append('path', this.editLabelForm.path);
         param.append('id', this.id);
         axios({
             method: 'post',
             url: '/lightspace/saveLabel',
             data: param
         }).then(this.handleEditSaveLabelSucc.bind(this))
         .catch(this.handleEditSaveLabelErr.bind(this))
         })
     },
     handleEditSaveLabelSucc(res) {
      if(res.data.status === 10204) {
          this.$message.error(res.data.msg);
          this.$router.push('/login');
         }else if(res.data.status == 200) {

           //隐藏编辑框
           this.editDialogVisible = false;
           //提示修改成功
           this.$message.success('更新信息成功');
           this.getLabelList(this.page)
         }
     },
     handleEditSaveLabelErr(err) {
         console.log(err)
     },
     //根据id删除学校
     async removeLabelById(id) {
         const confirmResult = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
         }).catch(err => err)
         if(confirmResult !== 'confirm') {
             return this.$message.info('已经取消删除')
         }
         let param = new URLSearchParams();
         param.append('id', id);
         axios({
             method: 'post',
             url: '/lightspace/deleteLabel',
             data: param
         }).then(this.handleDeleteLabelSucc.bind(this))
         .catch(this.handleDeleteLabelErr.bind(this))
         },
         handleDeleteLabelSucc(res) {
             if(res.data.status === 10204) {
                 this.$message.error(res.data.msg);
                 this.$router.push('/login');
             } else if(res.data.status == 200) {
               this.$message.success('删除标签成功');
               this.getLabelList();
             }
         },
         handleDeleteLabelErr(err) {
             console.log(err)
         }
    }
  }
</script>

<style>
</style>
