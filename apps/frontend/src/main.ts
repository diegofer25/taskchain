import App from '@/App.vue'
import '@/assets/main.css'
import { i18n } from '@/i18n'
import { waitForAuthCheck } from '@/modules/global/services/firebase.service'
import { ConfirmationPlugin } from '@/plugins/confirmation.plugin'
import { GlobalLoadingPlugin } from '@/plugins/global-loading.plugin'
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const app = createApp(App)
  .use(i18n)
  .use(createPinia())
  .use(ConfirmationPlugin)
  .use(GlobalLoadingPlugin)

waitForAuthCheck().then(() => app.use(router).mount('#app'))
