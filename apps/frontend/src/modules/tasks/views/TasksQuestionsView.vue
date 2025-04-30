<template>
  <div class="flex flex-col text-center">
    {{ processId }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  processId: string
}>()
</script>
