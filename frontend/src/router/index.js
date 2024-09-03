import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue'),
            beforeEnter: (to, from, next) => {
                if (checkAuth()) {
                    next({ path: '/' });
                }
                next();
            }
        },
        {
            path: '/signup',
            name: 'Signup',
            component: () => import('../views/Signup.vue'),
            beforeEnter: (to, from, next) => {
                if (checkAuth()) {
                    next({ path: '/' });
                }
                next();
            }
        },
        {
            path: '/form/:id?',
            name: 'Form',
            props: true,
            meta: { requiresAuth: true },
            component: () => import('../views/Form.vue'),
        },
        {
            path: '/form/:id/revision',
            name: 'FormRevision',
            props: true,
            meta: { requiresAuth: true },
            component: () => import('../views/Form.vue'),
        },
        {
            path: '/user',
            name: 'User',
            meta: { requiresAuth: true },
            component: () => import('../views/User.vue'),
        },
        {
            path: '/change-password',
            name: 'ChangePassword',
            meta: { requiresAuth: true },
            component: () => import('../views/ChangePassword.vue'),
        },
        {
            path: '/resetPassword/:token',
            name: 'ResetPassword',
            props: true,
            component: () => import('../views/ResetPassword.vue'),
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!checkAuth()) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next()
        }
    } else {
        next()
    }
});

function checkAuth() {
    return localStorage.getItem('token');
}

export default router
