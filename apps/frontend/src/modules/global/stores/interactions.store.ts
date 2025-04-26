import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useInteractionsStore = defineStore('interactions', () => {
  const notifications = reactive<Notification[]>([])

  return { notifications, showNotification, removeNotification, confirm }

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

// endregion
