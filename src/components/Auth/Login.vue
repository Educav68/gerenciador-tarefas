<template>
    <div>
        <div class="auth-container">
            <h2>Login</h2>
           
            <input type="email" v-model="email" placeholder="E-mail" required />
            <input type="password" v-model="password" placeholder="Senha" required />
            <button @click="handleLogin">Entrar</button>
            <br>
            <p class="mt-3">Não tem conta? <router-link to="/register">Crie uma agora</router-link></p>
          </div>
       
        <div v-if="showFeedbackModal" class="delete-confirmation-overlay">
            <div class="delete-confirmation-modal">
                <p>{{ feedbackMessage }}</p>
                <div class="modal-buttons">
                    <button @click="closeFeedbackModal" class="confirm-delete-button">OK</button>
                  </div>
              </div>
          </div>
      </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 🚨 MUDANÇA 1: Importar o serviço 'api' configurado (que aponta para o Render) 🚨
import api from '../../services/api.js';

const email = ref('');
const password = ref('');
const router = useRouter();

// Variáveis de estado e Modal (MANTIDO)
const showFeedbackModal = ref(false);
const feedbackMessage = ref('');

const showModal = (message) => {
  feedbackMessage.value = message;
  showFeedbackModal.value = true;
};
const closeFeedbackModal = () => {
  showFeedbackModal.value = false;
};

// 🚨 MUDANÇA 2: REMOVER A URL LOCAL HARDCODED (API_BASE_URL) 🚨
// A URL base agora é definida centralmente no api.js

const handleLogin = async () => {
  try {
    // 🚨 MUDANÇA 3: Usar 'api.post' e o caminho '/auth/login' 🚨
    // O 'api' já sabe o endereço base do Render
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    const { token, userId } = response.data;

    // Salvar o Token e o ID do Usuário
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userId', userId);

    // Redireciona para a lista de tarefas
    router.push('/tasks');

  } catch (error) {
    if (error.response && error.response.status === 401) {
      showModal('Falha no login: Credenciais inválidas.');
    } else {
      // Erro de comunicação (cai aqui se a URL hardcoded estiver errada ou bloqueada)
      showModal('Erro na comunicação com o servidor.');
    }
    console.error(error);
  }
};
</script>

<style scoped>
/* (Estilos mantidos, eles estavam corretos) */
.auth-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 20px;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

/* ESTILOS DO MODAL DE FEEDBACK */
.delete-confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.delete-confirmation-modal {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
}

.delete-confirmation-modal p {
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #333;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.confirm-delete-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.confirm-delete-button:hover {
  background-color: #368261;
}
</style>