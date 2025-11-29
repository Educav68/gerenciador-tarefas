<template>
  <li :class="{ completed: task.completed }">
    <input
      type="checkbox"
      :checked="task.completed"
      @change="emitToggleComplete"
      :id="`task-${task.id}`"
    />
    <label :for="`task-${task.id}`" class="task-text">{{ task.text }}</label>

    <button @click="emitEditTask" class="edit-button">Editar</button>

    <button @click="emitDeleteTask" class="delete-button-text">Excluir</button>
  </li>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-complete', 'delete-task', 'edit-task']);

const emitToggleComplete = () => {
  emit('toggle-complete', props.task.id);
};

const emitDeleteTask = () => {
  emit('delete-task', props.task.id);
};

const emitEditTask = () => {
  emit('edit-task', props.task);
};
</script>

<style scoped>
/* Estilos visuais para cada item individual da tarefa */
li {
  display: flex; /* Organiza os elementos (checkbox, texto, botão) lado a lado */
  align-items: center; /* Alinha os itens verticalmente no centro */
  justify-content: space-between; /* Espaça os elementos de forma igual */
  background-color: #ffffff; /* Fundo branco para cada item */
  padding: 12px 15px; /* Espaçamento interno */
  border-radius: 6px; /* Cantos levemente arredondados */
  margin-bottom: 8px; /* Espaço entre um item e outro na lista */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sombra suave para um efeito 3D */
  transition: all 0.2s ease-in-out; /* Suaviza as transições de estilo */
  position: relative; /* Necessário para posicionar o botão de edição se desejar */
}

li.completed {
  background-color: #f0f0f0; /* Fundo mais claro quando a tarefa está concluída */
  color: #888; /* Texto cinza claro para tarefas concluídas */
}

li.completed .task-text {
  text-decoration: line-through; /* Risca o texto da tarefa concluída */
  color: #888; /* Mantém o texto cinza */
}

li input[type="checkbox"] {
  margin-right: 15px; /* Espaço à direita do checkbox */
  width: 20px; /* Largura do checkbox */
  height: 20px; /* Altura do checkbox */
  cursor: pointer; /* Muda o cursor para uma mãozinha ao passar por cima */
  accent-color: #42b983; /* Define a cor do checkbox marcado (navegadores modernos) */
  flex-shrink: 0; /* Impede que o checkbox diminua */
}

li .task-text {
  flex-grow: 1; /* Permite que o texto ocupe o máximo de espaço disponível */
  text-align: left; /* Alinha o texto da tarefa à esquerda */
  font-size: 1.1em; /* Tamanho maior da fonte para o texto da tarefa */
  word-break: break-word; /* Garante que palavras longas quebrem para a linha de baixo */
  margin-right: 15px; /* Espaço entre o texto e os botões */
}

/* Estilos para o botão de Edição */
.edit-button {
  background-color: #007bff; /* Cor azul para o botão Editar */
  color: white;
  border: none;
  border-radius: 6px; /* Cantos arredondados */
  padding: 8px 12px; /* Espaçamento interno */
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  margin-left: auto; /* Empurra para a direita se houver espaço, antes do delete-button */
  margin-right: 10px; /* Espaço entre Editar e Excluir */
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0; /* Impede que o botão diminua */
}

.edit-button:hover {
  background-color: #0056b3; /* Cor mais escura no hover */
}

/* NOVO: Estilos para o botão de Excluir (agora retangular e vermelho) */
.delete-button-text { /* Use a nova classe aqui */
  background-color: #e74c3c; /* Fundo vermelho para o botão 'Excluir' */
  color: white; /* Texto branco */
  border: none;
  border-radius: 6px; /* Cantos arredondados, igual ao de editar */
  padding: 8px 12px; /* Espaçamento interno, igual ao de editar */
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0; /* Impede que o botão diminua */
}

.delete-button-text:hover {
  background-color: #c0392b; /* Cor mais escura ao passar o mouse */
}
</style>