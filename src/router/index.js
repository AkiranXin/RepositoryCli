import { createRouter, createWebHashHistory } from 'vue-router'
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
        component: () => import('../pages/main.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router