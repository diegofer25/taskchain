<template>
  <!-- Fades in/out only when loading is true -->
  <transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <!-- Spinner -->
      <div
        :style="{ width: size, height: size }"
        class="animate-spin rounded-full border-4 border-t-transparent border-r-transparent border-b-[var(--color-light-primary)] dark:border-b-[var(--color-dark-primary)] border-l-[var(--color-light-primary)] dark:border-l-[var(--color-dark-primary)]"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { computed } from 'vue'

const { isLoading } = useGlobalLoading()

// Optional: allow a local `size` prop if you ever want variations
const props = defineProps<{ size?: number }>()
const size = computed(() => `${props.size ?? 64}px`)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
