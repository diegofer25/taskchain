<template>
  <TransitionRoot
    as="template"
    :show="!confirmation.closed"
    v-for="confirmation in confirmations"
    :key="confirmation.id"
  >
    <Dialog class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-light-surface dark:bg-dark-surface text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex size-8 md:size-10 shrink-0 items-center justify-center rounded-ful sm:mx-0 sm:size-10"
                  >
                    <component
                      :is="confirmation.iconComponent || InformationCircleIcon"
                      class="size-8 md:size-10 rounded-full bg-light-translucent dark:bg-dark-translucent text-light-text dark:text-dark-text"
                      :class="confirmation.iconClass || 'text-light-accent dark:text-dark-accent'"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold text-light-text dark:text-dark-text"
                      >{{ confirmation.title || t('confirmation') }}</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-light-text-2 dark:text-dark-text-2">
                        {{ confirmation.description || t('are_you_sure_about_this_action') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-light-bg dark:bg-dark-bg px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
              >
                <button
                  type="button"
                  class="cursor-pointer inline-flex w-full justify-center rounded-md bg-light-link dark:bg-dark-link hover:bg-light-link-hover dark:hover:bg-dark-link-hover px-3 py-2 text-sm font-semibold text-dark-text dark:text-light-text shadow-xs sm:ml-3 sm:w-auto"
                  @click="confirmation.onConfirm()"
                >
                  {{ confirmation.confirmText || t('ok') }}
                </button>
                <button
                  type="button"
                  class="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="confirmation.onCancel()"
                  ref="cancelButtonRef"
                >
                  {{ confirmation.cancelText || t('cancel') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { useConfirmation } from '@/modules/global/composables/use-confirmation'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { InformationCircleIcon } from '@heroicons/vue/16/solid'
import { type FunctionalComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export interface Props {
  title?: string
  description?: string
  iconComponent?: FunctionalComponent
  iconClass?: string
  confirmText?: string
  cancelText?: string
}

const { t } = useI18n()
const { confirmations } = useConfirmation()
</script>
