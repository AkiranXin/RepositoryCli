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
        path: '/',
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
                path: 'selfInfoManage',
                name: '/selfInfoManage',
                component: () => import('../pages/infoManagePage/selfInfoManage.vue'),
            }
        ],
    },
]


console.log(store);

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// router.beforeEach((to, from) => {
//     if (to.path === '/main') {
//         store.state.hasPermission = ''
//     } else if (to.path === '/userInfoManage') {
//         store.state.hasPermission = '1'
//     }
//     return true
// })

export default router