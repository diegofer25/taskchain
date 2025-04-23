<template>
  <div class="flex flex-col gap-4 items-end relative mx-auto container px-2 pt-6 sm:pt-10">
    <ul role="list" class="border-t border-light-text-2 dark:border-dark-text-2 w-full mt-4">
      <li class="flex flex-col items-end gap-x-4 py-4 text-right">
        <p class="text-sm/6 font-semibold text-light-text dark:text-dark-text">
          {{ t('theme') }}
        </p>
        <AppThemeToggle />
      </li>
      <li
        class="flex flex-col items-end gap-x-4 py-4 text-right gap-2"
        v-if="authStore.isAuthenticated"
      >
        <p class="text-sm/6 font-semibold text-light-text dark:text-dark-text">
          {{ t('sign_out') }}
        </p>
        <button
          @click="signOut"
          class="flex items-center gap-x-1 outline-0 cursor-pointer bg-light-translucent hover:bg-dark-error text-dark-text p-2 rounded-full"
        >
          <ArrowRightStartOnRectangleIcon class="size-5" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AppThemeToggle from '@/modules/global/components/AppThemeToggle.vue'
import { useInteractionsStore } from '@/modules/global/stores/interactions.store'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/16/solid'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const interactionsStore = useInteractionsStore()

async function signOut() {
  const confirmed = await interactionsStore.confirm({
    title: t('sign_out'),
    description: t('are_you_sure_you_want_to_sign_out'),
    confirmText: t('yes'),
  })
  if (confirmed) {
    await authStore.signOut()
    router.push({ name: 'Auth' })
  } else {
    console.log('User cancelled sign out')
  }
}
</script>
