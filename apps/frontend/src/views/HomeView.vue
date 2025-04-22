<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center container mx-auto px-4 py-8 gap-8"
  >
    <img :src="logoImage" alt="Logo" class="w-80 h-auto" />
    <MainTaskInputForm />
  </div>
</template>

<script setup lang="ts">
import MainTaskInputForm from '@/components/MainTaskInputForm.vue'
import { useGlobalStore } from '@/stores/global.store'
import { computed } from 'vue'

const globalStore = useGlobalStore()
const logoImage = computed(() => {
  return globalStore.theme === 'dark'
    ? new URL('@/assets/images/horizontal-light.svg', import.meta.url).href
    : new URL('@/assets/images/horizontal-dark.svg', import.meta.url).href
})
</script>

<style scoped lang="scss"></style>
