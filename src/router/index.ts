import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../config/supabase'

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

// 路由守卫 - 检查用户认证状态
router.beforeEach(async (to, from, next) => {
  try {
    // 获取当前用户会话
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('获取会话失败:', error)
      // 如果获取会话失败，重定向到登录页面
      if (to.meta.requiresAuth) {
        next('/login')
        return
      }
    }
    
    // 如果路由需要认证且用户未登录，重定向到登录页面
    if (to.meta.requiresAuth && !session) {
      console.log('路由守卫: 需要认证但未登录，重定向到登录页面')
      next('/login')
    } else if (to.path === '/login' && session) {
      // 如果用户已登录但访问登录页面，重定向到首页
      console.log('路由守卫: 已登录用户访问登录页面，重定向到首页')
      next('/')
    } else {
      console.log('路由守卫: 允许导航到', to.path)
      next()
    }
  } catch (error) {
    console.error('路由守卫错误:', error)
    // 如果发生错误，允许继续导航
    next()
  }
})

export default router