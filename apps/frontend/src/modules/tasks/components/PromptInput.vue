<template>
  <div
    class="rounded-lg transition-colors duration-500 bg-light-translucent dark:bg-dark-translucent mx-2 mt-4"
  >
    <textarea
      rows="5"
      name="description"
      id="description"
      class="block w-full resize-none p-2 text-base text-light-text dark:text-dark-text placeholder:text-light-text-2 dark:placeholder:text-dark-text-2 sm:text-sm/6 outline-none ring-0"
      :placeholder="typeWriter.text.value"
      v-model="value"
    />
  </div>
</template>

<script lang="ts" setup>
import { useTypeWriter } from '@/modules/global/composables/use-type-writer'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const { t } = useI18n()
const typeWriter = useTypeWriter({
  phrases: computed(() => [
    t('taskchain_home_main_placeholder_1'),
    t('taskchain_home_main_placeholder_2'),
    t('taskchain_home_main_placeholder_3'),
    t('taskchain_home_main_placeholder_4'),
    t('taskchain_home_main_placeholder_5'),
    t('taskchain_home_main_placeholder_6'),
    t('taskchain_home_main_placeholder_7'),
  ]),
})
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
