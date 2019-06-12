import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import {CarCate} from './lib'

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.filter('goodtime', function(value){
    if (!value) return ''
    let date = new Date(value)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}:${date.getHours()}.${date.getMinutes()}  `
})

Vue.filter('simpletime', function(value){
    if (!value) return ''
    let date = new Date(value)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
})


Vue.filter('carCategory', function(value){
    if (!value) return ''

    return CarCate[value]
})


/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    template: '<App/>'
}).$mount('#app')
