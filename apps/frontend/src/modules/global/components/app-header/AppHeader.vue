<template>
  <Popover class="relative isolate z-50" v-slot="{ open }">
    <div class="flex justify-between items-center p-2 container mx-auto">
      <RouterLink to="/">
        <img :src="logoImage" alt="Taskchain logo" class="h-10 w-auto" />
      </RouterLink>
      <div class="max-w-7xl">
        <div class="flex gap-4 items-center">
          <Transition
            name="fade"
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="flex flex-col" v-if="open">
              <p class="text-sm/6 font-semibold text-light-text dark:text-dark-text">
                {{ authStore.user?.displayName }}
              </p>
              <p class="truncate text-xs/5 text-light-text-2 dark:text-dark-text-2">
                {{ authStore.user?.email }}
              </p>
            </div>
          </Transition>
          <PopoverButton
            class="inline-flex items-center gap-x-1 outline-0 cursor-pointer hover:bg-light-translucent dark:hover:bg-dark-translucent p-2 rounded-full"
            ref="popoverButtonRef"
          >
            <img
              class="size-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
              v-if="authStore.isAuthenticated"
            />
            <EllipsisVerticalIcon
              v-else
              class="size-5 text-light-text dark:text-dark-text"
              aria-hidden="true"
            />
          </PopoverButton>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <PopoverPanel
        class="absolute inset-x-0 top-0 -z-10 pt-8 sm:pt-4 shadow-sm backdrop-blur-md bg-light-translucent dark:bg-dark-translucent"
      >
        <AppHeaderOptions />
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AppHeaderOptions from '@/modules/global/components/app-header/AppHeaderOptions.vue'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/16/solid'
import { computed, onMounted, ref } from 'vue'

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const popoverButtonRef = ref<HTMLElement | null>(null)

onMounted(() => {
  console.log('Popover button ref:', popoverButtonRef.value)
})

const logoImage = computed(() =>
  globalStore.isDark
    ? new URL('@/assets/images/horizontal-light.svg', import.meta.url).href
    : new URL('@/assets/images/horizontal-dark.svg', import.meta.url).href,
)
</script>
