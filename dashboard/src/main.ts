import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import router from './router'
import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'
import 'virtual:svg-icons-register'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { dashboardConfig } from '@dcts/config'
import naive from "naive-ui";

// @ts-ignore
window.CESIUM_BASE_URL = '/'

document.title = dashboardConfig.APP_NAME

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `__persisted__${id}`,
}))

app.use(router)
app.use(pinia)
app.use(naive)
app.mount('#app')

console.info(import.meta.env.MODE)
