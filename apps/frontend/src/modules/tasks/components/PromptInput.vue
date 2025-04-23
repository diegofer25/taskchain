<template>
  <div
    class="rounded-lg transition-colors duration-500 bg-light-translucent dark:bg-dark-translucent"
  >
    <textarea
      rows="2"
      name="description"
      id="description"
      class="block w-full resize-none px-3 py-1.5 text-base text-light-text dark:text-dark-text placeholder:text-light-text-2 dark:placeholder:text-dark-text-2 sm:text-sm/6 outline-none ring-0"
      placeholder="Write a description..."
      v-model="value"
    />

    <!-- Spacer element to match the height of the toolbar -->
    <div aria-hidden="true">
      <div class="py-2">
        <div class="h-9" />
      </div>
      <div class="h-px" />
      <div class="py-2">
        <div class="py-px">
          <div class="h-9" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
