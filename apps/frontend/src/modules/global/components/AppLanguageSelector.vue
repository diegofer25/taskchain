<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="cursor-pointer inline-flex w-full justify-center gap-x-1.5 rounded-md bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm font-semibold text-light-text dark:text-dark-text shadow-xs ring-1 ring-light-text-2 dark:ring-dark-text-2 ring-inset hover:bg-light-translucent dark:hover:bg-dark-translucent"
      >
        <img :src="currentFlag" :alt="currentLocale" class="size-5 rounded-full" />
        <ChevronDownIcon class="-mr-1 size-5 text-gray-400" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-light-text-2 dark:divide-dark-text-2 rounded-md bg-light-bg dark:bg-dark-bg shadow-lg ring-1 ring-light-text-2 dark:ring-dark-text-2 focus:outline-hidden"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }" v-for="locale in availableLocales" :key="locale">
            <a
              @click="() => setLanguage(locale)"
              :class="[
                active
                  ? 'bg-light-translucent dark:bg-dark-translucent text-light-text dark:text-dark-text outline-hidden'
                  : 'text-light-text-2 dark:text-dark-text-2',
                'group flex items-center px-4 py-2 text-sm gap-2 cursor-pointer',
              ]"
            >
              <img :src="FLAGS[locale]" :alt="currentLocale" class="size-5 rounded-full" />
              {{ locale }}
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import enUsFlag from '@/assets/images/country-flags/en-US.svg'
import esFlag from '@/assets/images/country-flags/es.svg'
import ptBrFlag from '@/assets/images/country-flags/pt-BR.svg'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const FLAGS: Record<string, string> = {
  'en-US': enUsFlag,
  es: esFlag,
  'pt-BR': ptBrFlag,
}

const { locale: currentLocale, availableLocales } = useI18n()
const storedLocale = useStorage('locale', currentLocale.value)

const currentFlag = computed(() => FLAGS[currentLocale.value])

function setLanguage(locale: string) {
  currentLocale.value = locale
  storedLocale.value = locale
  document.documentElement.setAttribute('lang', locale)
  document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('data-locale', locale)
}
</script>
