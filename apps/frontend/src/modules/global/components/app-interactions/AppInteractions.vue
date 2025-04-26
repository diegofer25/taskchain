<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <AppNotification
        v-for="notification in notifications"
        :key="notification.id"
        :status="notification.status"
        :title="notification.title"
        :message="notification.message"
        @close="removeNotification(notification.id)"
      />
    </div>
  </div>
  <!-- <AppConfirmDialog
    v-for="{ id, onCancel, onConfirm, ...props } in confirmations"
    :key="id"
    v-bind="props"
    @cancel="onCancel"
    @confirm="onConfirm"
  /> -->
</template>

<script setup lang="ts">
import AppNotification from '@/modules/global/components/app-interactions/AppNotification.vue'
import { useInteractionsStore } from '@/modules/global/stores/interactions.store'

const { notifications, removeNotification } = useInteractionsStore()
</script>
