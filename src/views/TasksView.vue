<template>
  <div>
    <TaskInput :editingTask="editingTask" :isEditing="editingTask !== null" @add-task="handleAddTask"
      @update-task="handleUpdateTask" @cancel-edit="handleCancelEdit" />

    <TaskList :tasks="tasks" @toggle-complete="handleToggleComplete" @delete-task="handleDeleteTask"
      @edit-task="handleEditTask" />

    <p class="pending-count">Tarefas pendentes: {{ pendingTasksCount }}</p>

    <div class="actions-section">
      <button @click="openEmailModal" class="export-button">Enviar por E-mail</button>
      <button @click="generatePdfReport" class="report-button">Relatório PDF</button>
      <button @click="handleLogout" class="cancel-button">Sair</button>
    </div>

    <div v-if="showDeleteConfirmation" class="delete-confirmation-overlay">
      <div class="delete-confirmation-modal">
        <p>Tem certeza que deseja excluir esta tarefa?</p>
        <div class="modal-buttons">
          <button @click="cancelDeleteTask" class="cancel-delete-button">Cancelar</button>
          <button @click="confirmDeleteTask" class="confirm-delete-button">Excluir</button>
        </div>
      </div>
    </div>

    <div v-if="showEmailModal" class="email-modal-overlay">
      <div class="email-modal">
        <h3>Enviar Tarefas por E-mail</h3>
        <p>Para qual e-mail você gostaria de enviar a lista de tarefas?</p>
        <input type="email" v-model="emailRecipient" placeholder="seuemail@exemplo.com" class="email-input" />
        <div class="modal-buttons">
          <button @click="cancelSendEmail" class="cancel-button">Cancelar</button>
          <button @click="sendTasksViaMailto" class="send-email-button">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TaskInput from '../components/TaskInput.vue';
import TaskList from '../components/TaskList.vue';
import api from '../services/api.js'; 

// --- ESTADO LOCAL E API ---
const tasks = ref([]); 
const editingTask = ref(null);
const router = useRouter();

// Variáveis de estado para Modais
const showDeleteConfirmation = ref(false);
const taskToDeleteId = ref(null);
const showEmailModal = ref(false);
const emailRecipient = ref('');

// Propriedade computada
const pendingTasksCount = computed(() => {
  return tasks.value.filter(task => !task.completed).length;
});

// 1. CARREGAMENTO INICIAL
const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks'); 
    tasks.value = response.data.map(task => ({
        ...task,
        id: task._id
    }));
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
};

// 2. ADICIONAR TAREFA (POST)
const handleAddTask = async (taskText) => {
  if (taskText.trim() === '') return;
  try {
    const response = await api.post('/tasks', { text: taskText });
    tasks.value.push({...response.data, id: response.data._id}); 
  } catch (error) {
    alert('Erro ao adicionar tarefa. Tente fazer login novamente.');
  }
};

// 3. ALTERNAR CONCLUSÃO (PATCH)
const handleToggleComplete = async (taskId) => {
  const task = tasks.value.find(t => t.id === taskId); 
  if (task) {
    const newCompletedStatus = !task.completed;
    try {
      await api.patch(`/tasks/${taskId}`, { completed: newCompletedStatus });
      task.completed = newCompletedStatus; 
    } catch (error) {
      alert('Erro ao atualizar tarefa.');
    }
  }
};

// 4. PREPARAR EXCLUSÃO (Modal)
const handleDeleteTask = (taskId) => {
  taskToDeleteId.value = taskId;
  showDeleteConfirmation.value = true;
};
const cancelDeleteTask = () => {
  showDeleteConfirmation.value = false;
  taskToDeleteId.value = null;
};
// 5. CONFIRMAR EXCLUSÃO (DELETE - Soft Delete)
const confirmDeleteTask = async () => {
  const taskId = taskToDeleteId.value;
  try {
    await api.delete(`/tasks/${taskId}`); // A API fará o Soft Delete
    tasks.value = tasks.value.filter(task => task.id !== taskId); 
    cancelDeleteTask();
  } catch (error) {
    console.error('Erro ao excluir tarefa.', error);
  }
};

// 6. PREPARAR EDIÇÃO
const handleEditTask = (taskToEdit) => {
  editingTask.value = { ...taskToEdit }; 
};
const handleCancelEdit = () => {
  editingTask.value = null;
};
// 7. ATUALIZAR EDIÇÃO (PATCH)
const handleUpdateTask = async ({ id, text }) => {
    try {
        const response = await api.patch(`/tasks/${id}`, { text });
        
        const taskIndex = tasks.value.findIndex(t => t.id === id); 
        if (taskIndex !== -1) {
            tasks.value[taskIndex] = {...response.data, id: response.data._id}; 
        }
        editingTask.value = null;

    } catch (error) {
        console.error('Erro ao atualizar tarefa.', error);
    }
};

// 8. LOGOUT
const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    router.push('/login');
};

// 9. FUNÇÃO DE DOWNLOAD DE PDF
const generatePdfReport = async () => {
  try {
    const response = await api.get('/tasks/report', {
      responseType: 'blob', // Espera resposta binária
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_tarefas.pdf'); 
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar relatório. Verifique o console do servidor.');
  }
};

// 10. FUNÇÕES DE MODAL DE E-MAIL
const openEmailModal = () => {
  if (tasks.value.length === 0) {
    alert("Não há tarefas para enviar por e-mail!");
    return;
  }
  emailRecipient.value = ''; 
  showEmailModal.value = true;
};
const cancelSendEmail = () => {
  showEmailModal.value = false;
  emailRecipient.value = ''; 
};
const sendTasksViaMailto = () => {
  const recipient = emailRecipient.value;

  if (!recipient || recipient.trim() === '') {
    alert("E-mail do destinatário não informado ou inválido.");
    return;
  }

  const subject = encodeURIComponent("Minhas Tarefas do Gerenciador");
  let body = "Lista de Tarefas:\n\n";

  if (tasks.value.length > 0) {
    tasks.value.forEach((task, index) => {
      body += `${index + 1}. ${task.text} [${task.completed ? 'Concluída' : 'Pendente'}]\n`;
    });
  }

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(body)}`;

  showEmailModal.value = false; 
  emailRecipient.value = ''; 
};


onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
/* Estilos mantidos para o layout da lista e modais */
.pending-count {
  font-size: 1.3em;
  font-weight: bold;
  color: #34495e;
  margin-top: 30px;
  padding: 10px;
  background-color: #e0ffe0;
  border-radius: 5px;
  width: 100%;
}

.actions-section {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.export-button,
.cancel-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.export-button {
  background-color: #1a73e8;
  color: white;
}

.export-button:hover {
  background-color: #0c61d3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* Estilos para o Modal de Confirmação de Exclusão */
.delete-confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fundo escuro semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.delete-confirmation-modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 280px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

/* Estilo para os botões do modal de deleção */
.confirm-delete-button {
  background-color: #dc3545;
  /* Vermelho */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.confirm-delete-button:hover {
  background-color: #c82333;
}

.cancel-delete-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.cancel-delete-button:hover {
  background-color: #5a6268;
}

.delete-confirmation-modal p {
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #333;
}

/* Estilos para o Modal de Envio de E-mail (email-modal) */
.email-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fundo escuro semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  /* Garante que fique na frente de tudo */
}

.email-modal {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  text-align: center;
  min-width: 300px;
  max-width: 90%;
}

.email-modal h3 {
  color: #42b983;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.email-modal p {
  margin-bottom: 20px;
  font-size: 1em;
  color: #555;
}

.email-input {
  width: 100%;
  /* Ocupa a largura total dentro do modal */
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
}

/* Garante que os botões (Cancelar/Enviar) do modal de e-mail fiquem lado a lado */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.send-email-button {
  background-color: #1a73e8;
  /* Azul */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.send-email-button:hover {
  background-color: #0c61d3;
}

/* Estilos para o botão Cancelar */
.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Estilo hover para o botão Relatório PDF */
.report-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  
  /* Cor Roxa para Exemplo */
  background-color: #6a0dad; 
  color: white;
}

.report-button:hover {
  background-color: #580097;
}
</style>