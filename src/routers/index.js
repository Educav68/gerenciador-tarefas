// src/routers/index.js (Ajustado)

import { createRouter, createWebHistory } from 'vue-router';

// Componentes a serem criados/usados
import Login from '../components/Auth/Login.vue';
import Register from '../components/Auth/Register.vue';
// 🚨 ATENÇÃO AQUI: Importa a nova vista de tarefas 🚨
import TasksView from '../views/TasksView.vue'; 

const routes = [
  { path: '/', redirect: '/tasks' }, 
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { 
    path: '/tasks', 
    name: 'Tasks', 
    component: TasksView, // 🚨 Usa a nova vista 🚨
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🚨 Middleware de Proteção de Rota (Guarda de Navegação) 🚨
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwtToken'); // Checa se o token existe

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Se a rota exige autenticação E o token não existe, redireciona para Login
    next('/login'); 
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    // Se o usuário está logado e tenta acessar Login/Registro, redireciona para Tarefas
    next('/tasks');
  } else {
    next(); // Permite a navegação
  }
});

export default router;