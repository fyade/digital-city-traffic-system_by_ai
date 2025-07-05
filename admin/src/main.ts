import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import router from './router'
import directives from "@/dicevtive/index.ts";
import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'
import { publicConfig } from '@dcts/config'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import naive from "naive-ui";

import './loaded/autoUpdate.ts'
import './loaded/singleInputNoEnterSubmit.ts'

// @ts-ignore
window.CESIUM_BASE_URL = '/'

document.title = publicConfig.APP_NAME

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `__persisted__${id}`,
}))

app.use(router)
app.use(pinia)
app.use(naive)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(directives)
app.mount('#app')

console.info(import.meta.env.MODE)
