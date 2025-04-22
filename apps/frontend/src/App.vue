<template>
  <ThemeToggle />
  <RouterView />
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import { RouterView } from 'vue-router'
</script>
