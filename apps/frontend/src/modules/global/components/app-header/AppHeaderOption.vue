<template>
  <li class="flex flex-col items-end gap-x-4 text-right">
    <p class="text-sm/6 font-semibold text-light-text dark:text-dark-text">
      {{ title }}
    </p>
    <slot />
  </li>
</template>

<script lang="ts" setup>
interface Props {
  title: string
}

defineProps<Props>()
</script>
