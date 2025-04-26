import type { RouteRecordRaw } from 'vue-router'

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'TasksHome',
    component: () => import('@/modules/tasks/views/TasksHomeView.vue'),
  },
]
