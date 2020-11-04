<template>
   <el-container class="home-container">
      <el-aside  style="min-height: 100vh" >
         <el-menu
         :default-active="this.$route.path"
         class="el-menu-vertical-demo"
         background-color="#333744"
         text-color="#fff"
         active-text-color="#409eff"
         router
         :unique-opened="true"
         :collapse-transition="false" >
		 <el-submenu index="/nocheck">
		   <template slot="title">
		     <i class="el-icon-s-custom"></i>
		     <span>价格表</span>
		   </template>
		   <el-menu-item-group>
		     <el-menu-item index="/labelsetting">
		         <i class="el-icon-star-on"></i>
		        <span slot="title">标签设置</span>
		     </el-menu-item>
		     <el-menu-item index="/seriessetting">
		       <i class="el-icon-star-on"></i>
		       <span slot="title">系列设置</span>
		     </el-menu-item>
		     <el-menu-item index="/glassessetting">
		        <i class="el-icon-star-on"></i>
		       <span slot="title">产品设置</span>
		     </el-menu-item>
				 <el-menu-item index="/classsetting">
				    <i class="el-icon-star-on"></i>
				   <span slot="title">类别设置</span>
				 </el-menu-item>
		   </el-menu-item-group>
		 </el-submenu>
		 <el-menu-item index="/user">
		   <i class="el-icon-document"></i>
		   <span slot="title">账号设置</span>
		 </el-menu-item>
		 </el-menu>
      </el-aside>
      <!-- 右侧主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
   </el-container>
</template>
<script>
  import axios from 'axios'
  export default {
	
    data() {
      return {
        menuList: [],
        activeIndex: '/home',
		role: ''
      }
    },
    methods: {
      //保存链接的激活状态
      saveNavState(activeIndex) {
          this.activeIndex = activeIndex;
          console.log(this.activeIndex)
      }
    }
  }
</script>

<style lang="stylus" scoped >
  .el-menu
    border-right:none
    .toggle-button
      line-height: 30px
      height: 30px
      color: #fff
      text-align:center
  .el-menu-vertical-demo
    min-height: 100%
</style>
