import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/modules/auth/views/AuthView.vue'),
    meta: {
      isGuestOpen: true,
    },
  },
]
