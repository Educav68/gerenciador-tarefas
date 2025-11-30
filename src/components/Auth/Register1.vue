// src/components/Auth/Register.vue (Ajustado)
<template>
  <div>

    <div class="auth-container">
      <h2>Registro de Novo Usuário</h2>
      <input type="email" v-model="email" placeholder="E-mail" required />
      <input type="password" v-model="password" placeholder="Senha (mín. 8 dígitos)" required minlength="8" />
      <button @click="handleRegister">Registrar</button>
      <br>
      <p>Já tem conta? <router-link to="/login">Faça Login</router-link></p>
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
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const showFeedbackModal = ref(false);
const feedbackMessage = ref('');

// Funções do Modal
const showModal = (message) => {
    feedbackMessage.value = message;
    showFeedbackModal.value = true;
};
const closeFeedbackModal = () => {
    showFeedbackModal.value = false;
    // Não limpa a mensagem aqui, apenas fecha
};

const API_BASE_URL = 'http://localhost:3000/api/auth';

const handleRegister = async () => {
    // 1. VALIDAÇÃO DE TAMANHO MÍNIMO (FRONTEND)
    // Ajustado para 8, conforme seu código anterior (embora 6 seja um mínimo comum)
    if (password.value.length < 8) {
        showModal('A senha deve ter pelo menos 8 caracteres.');
        return; // Impede o envio para a API
    }

    try {
        await axios.post(`${API_BASE_URL}/register`, {
            email: email.value,
            password: password.value,
        });

        // Mensagem de sucesso no modal
        showModal('Registro bem-sucedido! Faça login agora.');
        // Redireciona APÓS um pequeno atraso para que o usuário veja o modal
        setTimeout(() => {
            router.push('/login');
        }, 1500); 

    } catch (error) {
        // Lógica de tratamento de erro da API
        if (error.response && error.response.status === 400) {
            showModal('Falha no registro: Usuário já existe ou dados inválidos.');
        } else {
            showModal('Erro ao registrar. Tente novamente.');
        }
        console.error(error);
    }
};
</script>

<style scoped>
/* Estilos do Formulário */
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
    background-color: rgba(0, 0, 0, 0.5); /* Fundo escuro */
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

.confirm-delete-button { /* Usado como botão "OK" */
    background-color: #42b983; /* Verde para confirmar/OK */
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