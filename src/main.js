import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/element-ui.scss' // custom element-ui style
import '@/styles/pro-table.scss' // custom win-design style

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import WinDesign from 'win-design'
// 默认主题样式文件(内置16套主题，可在『主题定制』中了解详细情况)
import 'win-design/lib/themes/default.css'

// // 如果你需要使用行业图标
// import 'win-design/lib/themes/iconx.css'
// import 'win-design/lib/themes/fonts/iconx.js'

// // 如果你需要使用行业标识
// import 'win-design/lib/themes/iconi.css'
// import 'win-design/lib/themes/fonts/iconi.js'

// // 如果你需要使用内置多色头像
// import 'win-design/lib/themes/fonts/avatars.js'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(WinDesign)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
