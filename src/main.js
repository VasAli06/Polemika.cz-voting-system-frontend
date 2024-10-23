
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/reset.scss'
import VueTyped from 'vue3-typed-js';

import App from './App.vue'
import router from './router'


import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Stylování Vuetify
import '@mdi/font/css/materialdesignicons.css' // Ikony (pokud chceš používat)

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})




const app = createApp(App)
app.use(VueTyped);
app.use(vuetify);
app.use(createPinia())
app.use(router)

app.mount('#app')
