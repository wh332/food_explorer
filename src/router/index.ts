import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/cuisines',
    name: 'Cuisines',
    component: () => import('../views/CuisinesView.vue')
  },
  {
    path: '/dishes',
    name: 'Dishes',
    component: () => import('../views/DishesView.vue')
  },
  {
    path: '/dish/:id',
    name: 'DishDetail',
    component: () => import('../views/DishDetailView.vue')
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: () => import('../views/AIAssistantView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/cuisine/:id',
    name: 'CuisineDetail',
    component: () => import('../views/CuisineDetailView.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router