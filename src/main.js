import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router  from './routes'
import axios from 'axios'
import '@/assets/scss/all.scss'
import 'reset-css'
import "leaflet/dist/leaflet.css"
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
