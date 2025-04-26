import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { createFetch } from '@vueuse/core'

export const useApiFetch = createFetch({
  baseUrl: '/api/v1',
  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore()
      const token = await authStore.user?.getIdToken()

      if (options.headers && token) {
        ;(options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }

      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
