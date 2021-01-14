<template>
    <div class="login_container">
      
       <el-row style="flex: 1">
         <el-col :span="10" :offset="7">
          <div class="login_box">
              <!-- <div class="avatar_box">
                  <img src="../assets/logo.png" alt="">
              </div> -->
              <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
                   <el-form-item class="userLogin"> 用户登录</el-form-item>
                  <el-form-item prop="username">
                      <el-input  v-model="loginForm.loginname" prefix-icon="el-icon-user-solid"></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                      <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" @keyup.enter.native="submitForm"></el-input>
                  </el-form-item>
                  <el-form-item class="btns"  >
                      <el-button type="primary" @click="submitForm" >登录</el-button>
                      <!-- <el-button type="info" @click="resetForm">重置</el-button> -->
                  </el-form-item>
              </el-form>
          </div>
        </el-col>
        </el-row>
        <div style="background: #0652A1; height: 50px;width: 100%;">

        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'login',
    // created() {
    //     this.getMenuList()
    // },
    data() {
        return {
            //登录表单的数据绑定对象
            loginForm: {
                loginname: '',
                password: ''
            },
            loginFormRules: {
                loginname: [
                    {required: true,  message: '请输入姓名', trigger: 'blur'}
                ],
                password: [
                     {required: true,  message: '请输入密码', trigger: 'blur'},

                ]
            }
        }
    },
    methods: {
        resetForm(formName) {
            this.$refs.loginFormRef.resetFields()
        },
        submitForm() {
            this.$refs.loginFormRef.validate( async(valid) => {
                //预验证
                if(!valid) return this.$message.error('请输入正确的账号密码');
                //如果验证成功，发起登录请求
               let param = new URLSearchParams();
               param.append('loginName', this.loginForm.loginname);
               param.append('password', this.loginForm.password);
                axios({
                    method: 'post',
                    url: '/price/priceclient/loginPrice',
                    data: param
                }).then(this.handleLoginSucc.bind(this))
                .catch(this.handleLoginErr.bind(this))
            })
        },
        handleLoginSucc(res) {
         if(res.data.status !== 200) return this.$message.error('登录失败');
            //将token 存到sessionStorage
          if(res.data.status ==200) {
						this.$message.success('登录成功');
						this.$router.push('/home')
					}
           
       

        },
        handleLoginErr(err) {
          this.$message.error('账号密码不存在')
            console.log(err, err.msg)
        },
        home() {
           this.$router.push('/home');
        }
    }


}
</script>
<style >
.login_container {
     position: absolute;
     top: 0;
     bottom: 0;
     left: 0;
     right: 0;
     display: flex;
     flex-direction: column;
     padding:10px;
}
.headerWrap {
  height: 150px;
  line-height: 150px;
}
.leftLogo {
  height: 50px;
  width: auto;
}
.rightLogo {
  height: 150px;
  width: auto;
}
.zhineng {
 height: 100px;
 width: auto;
}
.userLogin {
  padding: 10rpx;
  color: #0851A3;
  font-size: 30rpx !important;
  font-weight: bold;
  text-align: center;
}
.login_box {
    width: 450px;
    border: 3px solid #0851A3;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.btns {
    display: flex;
    justify-content: center;
}
.login_form{
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
.el-button--primary {
  background: rgb(6, 82, 161);
}
</style>
