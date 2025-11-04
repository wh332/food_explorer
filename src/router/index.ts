import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/cuisines',
    name: 'Cuisines',
    component: () => import('../views/CuisinesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dishes',
    name: 'Dishes',
    component: () => import('../views/DishesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dish/:id',
    name: 'DishDetail',
    component: () => import('../views/DishDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: () => import('../views/AIAssistantView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cuisine/:id',
    name: 'CuisineDetail',
    component: () => import('../views/CuisineDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 简化的路由守卫 - 避免异步阻塞
router.beforeEach((to, from, next) => {
  console.log('路由守卫: 开始检查', to.path, '来自', from.path)
  
  const authStore = useAuthStore()
  
  // 如果是认证相关页面，直接允许访问
  if (to.path === '/login' || to.path === '/register' || to.path === '/forgot-password') {
    console.log('路由守卫: 认证页面，直接允许访问')
    next()
    return
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 如果已认证，允许访问
    if (authStore.isAuthenticated) {
      console.log('路由守卫: 已认证用户，允许访问', to.path)
      next()
      return
    }
    
    // 如果未认证，重定向到登录页面
    console.log('路由守卫: 未认证用户，重定向到登录页面')
    next('/login')
    return
  }
  
  // 其他页面直接允许访问
  console.log('路由守卫: 允许访问', to.path)
  next()
})

export default router