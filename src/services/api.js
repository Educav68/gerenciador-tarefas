// src/services/api.js

import axios from 'axios';

// Altere para a URL correta do seu Backend
// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'https://gerenciador-tarefas-hsj5.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: Adiciona o JWT a cada chamada
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  
  if (token) {
    // Adiciona o token no formato padrão "Bearer [token]"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de Resposta: Lida com 401 (Token Expirado/Inválido)
api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        // Limpa o token e força o redirecionamento
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userId');
        
        // **Atenção:** Como o interceptor não tem acesso direto ao Vue Router,
        // o redirecionamento é melhor tratado na view principal ou usando uma abordagem centralizada.
        // Por enquanto, apenas a remoção do token é crítica.
    }
    return Promise.reject(error);
});

export default api;