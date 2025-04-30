<template>
  <Popover class="relative isolate z-30" v-slot="{ open }">
    <div
      class="flex justify-between items-center px-2 py-2 md:px-4 container mx-auto"
      :class="{ 'justify-end': !authStore.isAuthenticated }"
    >
      <RouterLink to="/" v-if="authStore.isAuthenticated">
        <img :src="logoImage" alt="Taskchain logo" class="h-6 md:h-10 w-auto" />
      </RouterLink>
      <div class="max-w-7xl">
        <div class="flex gap-2 md:gap-4 items-center">
          <Transition
            name="fade"
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="flex flex-col text-ellipsis max-w-32 md:max-w-fit" v-if="open">
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
          >
            <template v-if="authStore.isAuthenticated">
              <img
                class="size-8 md:size-10 rounded-full"
                :src="authStore.user?.photoURL"
                alt=""
                v-if="authStore.user?.photoURL"
              />
              <div
                v-else
                class="size-10 md:size-10 rounded-full flex items-center justify-center bg-light-translucent dark:bg-dark-translucent text-light-text dark:text-dark-text"
              >
                <span class="text-sm/6 font-semibold">
                  {{ firstLetterNames }}
                </span>
              </div>
            </template>

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
import { computed } from 'vue'

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const firstLetterNames = computed(() => {
  return authStore.firstName.charAt(0) + (authStore.lastName.charAt(0) ?? '')
})

const logoImage = computed(() =>
  globalStore.isDark
    ? new URL('@/assets/images/horizontal-light.svg', import.meta.url).href
    : new URL('@/assets/images/horizontal-dark.svg', import.meta.url).href,
)
</script>
