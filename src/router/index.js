import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'
import Test from '../pages/test.vue'

const routes = [
    {
        path: '/test',
        name: 'Test',
        component: Test
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/login.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../pages/main.vue'),
        children: [
            {
                path: '/userInfoManage',
                name: 'userInfoManage',
                component: () => import('../pages/infoManagePage/userInfoManage.vue'),
            },
            {
                path: '/selfInfoManage',
                name: 'selfInfoManage',
                component: () => import('../pages/infoManagePage/selfInfoManage.vue'),
            },
            {
                path: '/validateInfo',
                name: 'validateInfo',
                component: () => import('../pages/infoManagePage/validateInfo.vue'),
            },
            {
                path: '/repoInfoManage',
                name: 'repoInfoManage',
                component: () => import('../pages/repoInfoManagePage/repoInfoManage.vue'),
            },
            {
                path: '/IOInfoManage',
                name: 'IOInfoManage',
                component: () => import('../pages/repoInfoManagePage/IOInfoManage.vue'),
            },
            {
                path: '/productInfoManage',
                name: 'productInfoManage',
                component: () => import('../pages/repoInfoManagePage/productInfoManage.vue'),
            },
        ],
    },
]

//定义router实体
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//主要是用于登录判断
/**
 * 在每次进入一个页面之前，导航守卫进行判断
 */
router.beforeEach((to, from, next) => {
    let isLogin = sessionStorage.getItem("account")
    //这一步判断权限，保证刷新之后不会掉状态
    //先判断store里面的，再判断localStora里面的，避免每次跳转都要获取数据
    if (store.state.hasPermission == '') {
        let isAuthority = sessionStorage.getItem("hasPermission")
        if (isAuthority) {
            store.commit("changeAuthority", {
                authoriy: isAuthority
            })
            store.commit("changeAccount", {
                account: sessionStorage.getItem("account")
            })
            store.commit("changeName",{
                name: sessionStorage.getItem("name")
            })
        }
    }
    //这一步判断是否登录状态，如果有登陆状态就直接跳转
    if (isLogin) {
        next()
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next('/login')
        }
    }
})


export default router