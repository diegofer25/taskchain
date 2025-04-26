import { i18n } from '@/i18n'
import AppConfirmDialog from '@/modules/global/components/app-interactions/AppConfirmDialog.vue'
import { useConfirmation } from '@/modules/global/composables/use-confirmation'
import { type App, createApp, type Plugin } from 'vue'

export const ConfirmationPlugin: Plugin = {
  install(app: App) {
    // Mount the confirmation dialog container once, outside your component tree
    const el = document.createElement('div')
    document.body.appendChild(el)
    createApp(AppConfirmDialog).use(i18n).mount(el)

    // Expose the confirmation composable globally
    const confirmation = useConfirmation()
    app.provide('confirmation', confirmation) // --> inject('confirmation')
    app.config.globalProperties.$confirmation = confirmation // --> this.$confirmation in options API
  },
}
