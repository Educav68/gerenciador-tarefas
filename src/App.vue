<template>
  <div id="app">
    <img src="./assets/logo.svg" alt="Logo do Vue.js" class="vue-logo">
    <h1>Gerenciador de Tarefas</h1>

    <router-view />

    <div class="app-footer">
      <h5>- Criado com Vue.js 3 -</h5>
      <a href="https://educav.net" target="_blank">
        <img src="./assets/educavdigital.png" alt="Edu Cav Digital" class="circular-image">
      </a>
      <h6>&copy; 2025 - by Eduardo Grübel</h6>
    </div>

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
/* Estilos globais (não scoped) */
* {
    box-sizing: border-box;
}

#app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 50px;
    background-color: #f0f2f5;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    
    /* Centralização e Limitação de Largura */
    max-width: 500px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1,
h2 {
    color: #42b983;
    margin-bottom: 25px;
    word-break: break-word;
    width: 100%;
}

/* Estilos do Rodapé */
.app-footer {
    margin-top: 40px;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.app-footer h6 {
    color: #666;
    /*font-size: 0.9em;*/
    margin-bottom: 15px;
}

.vue-logo {
    width: 65px;
    height: auto;
    margin-top: 15px;
    opacity: 0.8;
}

.circular-image {
    border-radius: 50%;
    width: 65px;
    height: auto;
    margin-top: 1px;
    opacity: 0.8;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
}

.circular-image:hover {
    transform: scale(1.1);
    opacity: 1;
    cursor: pointer;
}

.app-footer a:hover {
    background-color: transparent;
    outline: none;
    box-shadow: none;
}

.app-footer a:focus {
    outline: none;
    box-shadow: none;
}
</style>