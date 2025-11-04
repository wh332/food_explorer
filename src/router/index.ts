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

// 异步路由守卫 - 确保认证状态初始化完成
router.beforeEach(async (to, from, next) => {
  console.log('路由守卫: 开始检查', to.path, '来自', from.path)
  
  const authStore = useAuthStore()
  
  // 等待认证状态初始化完成（如果是首次访问）
  if (!authStore.isAuthenticated && authStore.isLoading) {
    console.log('路由守卫: 等待认证状态初始化...')
    // 等待一小段时间让认证状态初始化完成
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log('路由守卫: 当前认证状态', authStore.isAuthenticated)
  
  // 如果是认证相关页面
  if (to.path === '/login' || to.path === '/register' || to.path === '/forgot-password') {
    // 如果用户已登录，重定向到首页
    if (authStore.isAuthenticated) {
      console.log('路由守卫: 已登录用户访问认证页面，重定向到首页')
      next('/')
      return
    }
    
    console.log('路由守卫: 认证页面，允许访问')
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