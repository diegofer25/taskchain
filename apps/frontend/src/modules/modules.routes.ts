import { authRoutes } from '@/modules/auth/auth.routes'
import { tasksRoutes } from '@/modules/tasks/tasks.routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/modules/global/layouts/AuthenticatedLayout.vue'),
    children: [...tasksRoutes],
  },
  {
    path: '/auth',
    component: () => import('@/modules/global/layouts/UnauthenticatedLayout.vue'),
    children: [...authRoutes],
    meta: {
      isGuestOpen: true,
    },
  },
]
