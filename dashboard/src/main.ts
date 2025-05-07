import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import router from './router'
import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'
import 'virtual:svg-icons-register'
import { dashboardConfig } from '@dcts/config'

document.title = dashboardConfig.APP_NAME

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `__persisted__${id}`,
}))

app.use(router)
app.use(pinia)
app.mount('#app')

console.info(import.meta.env.MODE)
