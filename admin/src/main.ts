import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import router from './router'
import directives from "@/dicevtive/index.ts";
import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import naive from "naive-ui";
import 'cesium/Build/Cesium/Widgets/widgets.css'

import './loaded/autoUpdate.ts'
import './loaded/singleInputNoEnterSubmit.ts'

window.CESIUM_BASE_URL = '/cesium-static'

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `__persisted__${id}`,
}))

app.use(router)
app.use(pinia)
app.use(naive)
app.use(directives)
app.mount('#app')

console.info(import.meta.env.MODE)
