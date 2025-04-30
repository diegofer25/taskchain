import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { routes } from '@/modules/modules.routes'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isGuestOpen = to.matched.some((record) => record.meta.isGuestOpen)
  const authStore = useAuthStore()

  if (!isGuestOpen && !authStore.isAuthenticated) {
    next({ name: 'Auth' })
  } else if (to.name === 'Auth' && authStore.isAuthenticated) {
    next({ name: 'TasksInput' })
  } else {
    next()
  }
})

export default router
