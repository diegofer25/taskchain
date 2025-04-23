import type { Props as AppConfirmDialogProps } from '@/modules/global/components/app-interactions/AppConfirmDialog.vue'
import { useTimeoutFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useInteractionsStore = defineStore('interactions', () => {
  const notifications = reactive<Notification[]>([])
  const confirmations = reactive<ConfirmOptions[]>([])

  return { notifications, confirmations, showNotification, removeNotification, confirm }

  function showNotification({
    status = 'success',
    title,
    message,
    duration = 5000,
  }: NotifyOptions) {
    const id = Date.now() + Math.random()

    notifications.push({ id, status, title, message })

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }
  }

  function removeNotification(id: number) {
    const index = notifications.findIndex((n) => n.id === id)

    if (index !== -1) {
      notifications.splice(index, 1)
    }
  }

  async function confirm(options: AppConfirmDialogProps) {
    const id = crypto.randomUUID()
    const isConfirmed = await new Promise((resolve) => {
      confirmations.push({
        ...options,
        id,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })

    removeAfterCloseAnimation(id)

    return isConfirmed

    function removeAfterCloseAnimation(id: string) {
      const index = confirmations.findIndex((c) => c.id === id)

      if (index !== -1) {
        useTimeoutFn(() => {
          confirmations.splice(index, 1)
        }, 300)
      }
    }
  }
})

// region Types

export interface Notification {
  id: number
  status: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

interface NotifyOptions {
  status?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface ConfirmOptions extends AppConfirmDialogProps {
  id: string
  onConfirm: () => void
  onCancel: () => void
}
// endregion
