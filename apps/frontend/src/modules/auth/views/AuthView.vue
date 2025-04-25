<template>
  <div class="flex mt-40 justify-center container mx-auto px-4 py-8">
    <div class="flex flex-col gap-3 max-w-80">
      <button
        v-for="provider in PROVIDERS"
        :key="provider.name"
        @click="signIn(provider.name)"
        class="flex height-[64.894px] py-2 px-4 items-center gap-[16.223px] rounded-md border border-light-text-2 dark:border-dark-text-2 border-solid bg-light-surface dark:bg-dark-surface cursor-pointer hover:bg-light-translucent dark:hover:bg-dark-translucent"
      >
        <img :src="provider.icon" alt="Google" />
        {{ t('sign_in_with_provider', { provider: provider.name }) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { useInteractionsStore } from '@/modules/global/stores/interactions.store'
import { requestTokensDependentsOnFbToken } from '@/modules/global/utils/initialization.utils'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const PROVIDERS = [
  {
    name: 'Google',
    icon: new URL('@/assets/images/social-icons/Google.svg', import.meta.url).href,
  },
  {
    name: 'Microsoft',
    icon: new URL('@/assets/images/social-icons/Microsoft.svg', import.meta.url).href,
  },
] as const

type Provider = (typeof PROVIDERS)[number]['name']

const { t } = useI18n()
const router = useRouter()
const { showNotification } = useInteractionsStore()
const { googleSignIn, microsoftSignIn } = useAuthStore()
const { show, hide } = useGlobalLoading()

async function signIn(provider: Provider) {
  try {
    if (provider === 'Google') {
      await googleSignIn()
    } else if (provider === 'Microsoft') {
      await microsoftSignIn()
    }
    show()
    await requestTokensDependentsOnFbToken()
    hide()

    router.push({ name: 'TasksHome' })
  } catch (e) {
    console.error('Error signing in:', e)

    showNotification({
      status: 'error',
      title: t('an_error_occurred'),
      message: t('an_error_occurred_while_signing_in', { provider }),
    })
  }
}
</script>

<style scoped lang="scss"></style>
