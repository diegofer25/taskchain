<template>
  <AppHeader />
  <RouterView />
  <AppInteractions />
</template>

<script setup lang="ts">
import AppHeader from '@/modules/global/components/app-header/AppHeader.vue'
import AppInteractions from '@/modules/global/components/app-interactions/AppInteractions.vue'
import { RouterView } from 'vue-router'
</script>
