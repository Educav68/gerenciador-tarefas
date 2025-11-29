// src/main.js (Versão com Vue Router)

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers' // 🚨 Importa o objeto roteador 🚨

const app = createApp(App)

app.use(routers) // 🚨 Ativa o Vue Router na aplicação 🚨
app.mount('#app')