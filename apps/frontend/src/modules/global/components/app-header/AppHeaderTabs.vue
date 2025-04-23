<template>
  <div class="relative mx-auto container px-2 py-6 sm:py-10">
    <div class="sm:hidden">
      <select
        aria-label="Select a tab"
        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
      >
        <option v-for="tab in tabs" :key="tab.name" :selected="tab.id === currentTab">
          {{ tab.name }}
        </option>
      </select>
      <ChevronDownIcon
        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        aria-hidden="true"
      />
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-dark-text-2 dark:border-light-text-2">
        <nav class="-mb-px flex space-x-8 justify-end" aria-label="Tabs">
          <a
            @click="currentTab = tab.id"
            v-for="tab in tabs"
            :key="tab.name"
            class="cursor-pointer"
            :class="[
              tab.id === currentTab
                ? 'border-light-accent text-light-link dark:border-dark-accent dark:text-dark-link'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'border-b-2 px-1 py-4 text-md font-medium whitespace-nowrap',
            ]"
            :aria-current="tab.id === currentTab ? 'page' : undefined"
            >{{ tab.name }}</a
          >
        </nav>
      </div>
    </div>

    <!-- Tabs Content -->
    <Transition
      name="fade"
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <AppHeaderSettingsTab v-if="currentTab === 'settings'" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import AppHeaderSettingsTab from '@/modules/global/components/app-header/AppHeaderOptions.vue'
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentTab = ref('settings')
const tabs = [{ name: t('settings'), id: 'settings' }]
</script>
