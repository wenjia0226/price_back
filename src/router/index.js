import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
// 价格表
import labelsetting from '@/components/price/labelsetting.vue'
import seriessetting from '@/components/price/seriessetting.vue'
import glassessetting from '@/components/price/glassessetting.vue'
import user from '@/components/user.vue'
Vue.use(Router)

export default new Router({
  routes: [
  {path: '/', redirect: '/login'},
  {path: '/login',component: Login},
	{	path: '/home',
		component: Home,
	 // redirect: '/schoolsetting',
		children: [
		{path: '/labelsetting', component: labelsetting},
		{path: '/seriessetting', component: seriessetting},
		{path: '/glassessetting', component: glassessetting},
		{path: '/user', component: user}
	 ],
	}
  ]
})
