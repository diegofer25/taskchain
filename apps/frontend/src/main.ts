import App from '@/App.vue'
import '@/assets/main.css'
import { i18n } from '@/i18n'
import { waitForAuthCheck } from '@/modules/global/services/firebase.service'
import router from '@/router'
import { RuntimeLoader } from '@rive-app/webgl'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const appEl = document.getElementById('app')
renderLoadingContainer(appEl)

loadAppDependencies({
  // For production I prefer to use the CDN version of the Rive WASM because it could be cached on the user's browser
  // and it is faster to load. But for development I prefer to use the local version of the Rive WASM
  riveUrl: import.meta.env.DEV ? '/rive.wasm' : undefined,
})

async function loadAppDependencies({ riveUrl }: LoadAppDependenciesOptions = {}) {
  if (riveUrl) {
    RuntimeLoader.setWasmUrl(riveUrl)
  }
  try {
    await Promise.all([RuntimeLoader.awaitInstance(), waitForAuthCheck()])
    if (appEl) {
      createApp(App).use(i18n).use(createPinia()).use(router).mount(appEl)
    }
  } catch {
    loadAppDependencies({ riveUrl: '/rive.wasm' })
  }
}

function renderLoadingContainer(appEl: HTMLElement | null) {
  const logoImgEl = document.createElement('img')
  logoImgEl.className = 'w-64 h-64'
  logoImgEl.src = 'vertical-dark.svg'
  logoImgEl.alt = 'logo'

  const loadingImgEl = document.createElement('img')
  loadingImgEl.className = 'w-32 h-32'
  loadingImgEl.src = '/loading.gif'
  loadingImgEl.alt = 'loading'

  const container = document.createElement('div')
  container.className = 'container flex flex-col items-center justify-center h-screen gap-4 mx-auto'

  container.appendChild(logoImgEl)
  container.appendChild(loadingImgEl)

  appEl?.appendChild(container)
}

interface LoadAppDependenciesOptions {
  riveUrl?: string
}
