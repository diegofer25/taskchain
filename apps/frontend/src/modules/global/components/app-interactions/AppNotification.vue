<template>
  <transition
    appear
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white ring-1 shadow-lg ring-black/5"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="shrink-0">
            <!-- Dynamic icon based on status -->
            <component :is="iconComponent" class="w-6 h-6" :class="iconClass" aria-hidden="true" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ title }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              type="button"
              @click="close"
              class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/16/solid'
import { computed, ref } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'success',
    validator: (value: string) => ['success', 'error', 'warning', 'info'].includes(value),
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
})

const emit = defineEmits<{ (e: 'close'): void }>()
const visible = ref(true)

const iconMapping = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
} as const

const colorMapping = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
} as const

const iconComponent = computed(() => iconMapping[props.status as keyof typeof iconMapping])
const iconClass = computed(() => colorMapping[props.status as keyof typeof colorMapping])

function close(): void {
  visible.value = false
  emit('close')
}
</script>
