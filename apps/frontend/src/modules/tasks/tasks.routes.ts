import type { RouteRecordRaw } from 'vue-router'

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('@/modules/tasks/pages/TasksCreationPage.vue'),
    children: [
      {
        path: '',
        name: 'TasksInput',
        component: () => import('@/modules/tasks/views/TaskInputFormView.vue'),
      },
      {
        path: 'questions/:processId',
        props: true,
        name: 'TasksQuestions',
        component: () => import('@/modules/tasks/views/TasksQuestionsView.vue'),
      },
    ],
  },
]
