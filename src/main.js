import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Pinia pour la gestion d'état
import { pinia } from './stores/index.js'

// TanStack Query pour la gestion des requêtes
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClientConfig } from './plugins/query.js'

const app = createApp(App)

// Configuration des plugins
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, queryClientConfig)

app.mount('#app')
