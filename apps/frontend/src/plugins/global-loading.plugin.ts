import AppLoading from '@/modules/global/components/AppLoading.vue'
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { type App, createApp, type Plugin } from 'vue'

export const GlobalLoadingPlugin: Plugin = {
  install(app: App) {
    // Mount the overlay once, outside your component tree
    const el = document.createElement('div')
    document.body.appendChild(el)
    createApp(AppLoading).mount(el)

    // Expose helpers in two convenient ways
    const controls = useGlobalLoading()
    app.provide('loading', controls) // --> inject('loading')
    app.config.globalProperties.$loading = controls // --> this.$loading in options API
  },
}
