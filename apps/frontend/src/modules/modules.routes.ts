import { authRoutes } from '@/modules/auth/auth.routes'
import { tasksRoutes } from '@/modules/tasks/tasks.routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [...authRoutes, ...tasksRoutes]
