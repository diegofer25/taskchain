<template>
  <div class="relative mx-auto container px-2 md:px-4 pt-6 sm:pt-10">
    <ul
      role="list"
      class="flex flex-col gap-4 border-t py-4 border-light-text-2 dark:border-dark-text-2 w-full mt-6"
    >
      <AppHeaderOption :title="t('language')" class="gap-2">
        <AppLanguageSelector />
      </AppHeaderOption>
      <AppHeaderOption :title="t('theme')">
        <AppThemeToggle />
      </AppHeaderOption>
      <AppHeaderOption :title="t('sign_out')" v-if="authStore.isAuthenticated">
        <button
          @click="signOut"
          class="flex items-center gap-x-1 outline-0 cursor-pointer bg-light-translucent hover:bg-dark-error text-dark-text p-2 rounded-full"
        >
          <ArrowRightStartOnRectangleIcon class="size-5" aria-hidden="true" />
        </button>
      </AppHeaderOption>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AppHeaderOption from '@/modules/global/components/app-header/AppHeaderOption.vue'
import AppLanguageSelector from '@/modules/global/components/AppLanguageSelector.vue'
import AppThemeToggle from '@/modules/global/components/AppThemeToggle.vue'
import { useConfirmation } from '@/modules/global/composables/use-confirmation'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/16/solid'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const { confirm } = useConfirmation()
const authStore = useAuthStore()

async function signOut() {
  const confirmed = await confirm({
    title: t('sign_out'),
    description: t('are_you_sure_you_want_to_sign_out'),
    confirmText: t('yes'),
  })
  if (confirmed) {
    await authStore.signOut()
    await router.push({ name: 'Auth' })
  }
}
</script>
