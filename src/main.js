import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/reset.scss'
import VueTyped from 'vue3-typed-js';

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(VueTyped);
app.use(createPinia())
app.use(router)

app.mount('#app')
