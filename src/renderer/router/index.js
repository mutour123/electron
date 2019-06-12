import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: require('../components/Home').default
        },
        {
            path: '/car-add',
            name: 'car-add',
            component: require('../components/CarAdd').default
        },
        {
            path: '/car-delete',
            name: 'car-delete',
            component: require('../components/CarDelete').default
        },
        {
            path: '/history',
            name: 'history',
            component: require('../components/History').default
        },
        {
            path: '/car-list',
            name: 'car-list',
            component: require('../components/CarList').default
        }
    ]

})