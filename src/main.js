import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/style.scss'
import router from './routes'

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
	let userId = sessionStorage.getItem('userId')

	if (!userId && to.path !== '/login') {
		next({
			path: '/login'
		})
	} else {

		//从session获取用户可以跳转的path进行权限限制（数组存入session的时候会变为字符串，在此先将字符串转为数组，最后加入公共页path）
		let pathArr = sessionStorage.getItem('pathArr')
		let pathArray = []
		if (pathArr) {
			pathArray = pathArr.split(',')
		}
		pathArray.push('/login')
		pathArray.push('/main')

		let index = pathArray.indexOf(to.path)
		//如果数组中不包含将要跳转的path，如果不包含则跳转至404，如果包含则正常跳转
		if (index < 0) {
			if (to.path == '/404') {
				next()
			} else {
				next({
					path: '/404'
				})
			}
		} else {
			next()
		}

	}
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
}).$mount('#app')
