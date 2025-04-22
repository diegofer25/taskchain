import App from '@/App.vue'
import '@/assets/main.css'
import { i18n } from '@/i18n'
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const app = createApp(App)

app.use(i18n).use(createPinia()).use(router).mount('#app')
