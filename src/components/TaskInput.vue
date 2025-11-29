<template>
  <div class="task-input-container">
    <input
      type="text"
      v-model="currentTaskText"
      @keyup.enter="handleSubmit"
      :placeholder="isEditing ? 'Editar tarefa...' : 'Adicionar nova tarefa...'"
      :aria-label="isEditing ? 'Editar Tarefa' : 'Nova Tarefa'"
    />
    <button @click="handleSubmit">
      {{ isEditing ? 'Salvar' : 'Adicionar' }}
    </button>
    <button v-if="isEditing" @click="cancelEdit" class="cancel-button">
      Cancelar
    </button>
  </div>
</template>

<script setup>
// 'ref' é usado para criar variáveis reativas no Vue 3.
//  import { ref, watch, defineProps, defineEmits } from 'vue';
import { ref, watch } from 'vue';

// --- Propriedades do Componente ---
// 'defineProps' é como dizemos ao Vue que este componente pode receber dados do pai (App.vue).
// 'editingTask' será o objeto da tarefa sendo editada (se houver).
// 'isEditing' indicará se o componente está no modo de edição.
const props = defineProps({
  editingTask: {
    type: Object, // Esperamos um objeto de tarefa (ex: { id: 1, text: 'Tarefa X' })
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

// 'defineEmits' é como dizemos ao Vue que este componente pode "avisar" o pai
// sobre eventos. Aqui, ele pode emitir 'add-task', 'update-task' e 'cancel-edit'.
const emit = defineEmits(['add-task', 'update-task', 'cancel-edit']);

// --- Dados Reativos Internos ---
// 'currentTaskText' vai guardar o que o usuário digita/edita na caixa de texto.
const currentTaskText = ref('');

// --- Observador de Propriedades ---
// 'watch' observa a propriedade 'editingTask'. Sempre que 'editingTask' mudar,
// esta função é executada. Isso é útil para preencher o input quando uma tarefa
// é selecionada para edição.
watch(() => props.editingTask, (newTask) => {
  if (newTask && props.isEditing) {
    // Se há uma nova tarefa para editar e estamos em modo de edição,
    // preenche o campo de texto com o texto da tarefa.
    currentTaskText.value = newTask.text;
  } else {
    // Se não há tarefa para editar ou não estamos em modo de edição, limpa o campo.
    currentTaskText.value = '';
  }
}, { immediate: true }); // 'immediate: true' faz com que o 'watch' seja executado
                       // uma vez logo que o componente é montado.

// --- Métodos do Componente ---
// Esta função é chamada quando o botão é clicado ou Enter é pressionado.
// Ela agora lida tanto com a adição quanto com a atualização de tarefas.
const handleSubmit = () => {
  // Remove espaços em branco do início e do fim.
  const trimmedText = currentTaskText.value.trim();

  // Se o campo de texto estiver vazio, não faz nada.
  if (trimmedText === '') {
    return;
  }

  if (props.isEditing) {
    // Se estivermos no modo de edição, emitimos o evento 'update-task'.
    // Enviamos o ID da tarefa original e o novo texto.
    emit('update-task', { id: props.editingTask.id, text: trimmedText });
  } else {
    // Se não estivermos no modo de edição, emitimos o evento 'add-task'.
    emit('add-task', trimmedText);
  }

  // Limpa o campo de texto após a submissão.
  currentTaskText.value = '';
};

// Esta função é chamada quando o botão "Cancelar" é clicado no modo de edição.
const cancelEdit = () => {
  // Limpa o campo de texto.
  currentTaskText.value = '';
  // Emite um evento 'cancel-edit' para que o componente pai saiba que a edição foi cancelada.
  emit('cancel-edit');
};
</script>

<style scoped>
.task-input-container {
  display: flex;
  justify-content: center;
  /* Ajuste a margem para evitar que ela empurre demais em telas pequenas */
  margin: 0 10px 20px 10px; /* Top, Right, Bottom, Left - Adicionei margens laterais */
  width: calc(100% - 20px); /* Garante que ocupe a maior parte da largura do pai */
  max-width: 460px; /* Limita a largura máxima como no App.vue */
}

.task-input-container input {
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex-grow: 1;
  min-width: 0;
  font-size: 1.1em;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-input-container button {
  padding: 12px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 1.1em;
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0;
}

.task-input-container button:hover {
  background-color: #36a372; /* Cor mais escura no hover */
}

.task-input-container button.cancel-button {
  background-color: #f44336; /* Cor vermelha para o botão Cancelar */
}

.task-input-container button.cancel-button:hover {
  background-color: #d32f2f; /* Cor mais escura no hover para Cancelar */
}


/* - Media Query para Mobile - */
@media (max-width: 600px) {
  .task-input-container {
    flex-direction: column;
    align-items: center;
  }

  .task-input-container input {
    width: 100%;
    margin-bottom: 10px;
  }

  .task-input-container button {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px; /* Adicionado para espaçamento entre botões em mobile */
  }

  .task-input-container button:last-child {
      margin-bottom: 0; /* Remove margem do último botão em mobile */
  }
}
</style>