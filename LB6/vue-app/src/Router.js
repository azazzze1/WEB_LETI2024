import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/admin', name: 'AdminPanel',
        component: () => import('./components/AdminPanel.vue')
    },
    { path: '/login', name: 'LoginComponent',
        component: () => import('./components/Login.vue')
    },
    { path: '/exchange', name: 'StockExchange',
        component: () => import('./components/Exchange.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router