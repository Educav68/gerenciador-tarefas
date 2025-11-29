<template>
  <div class="task-list-container">
    <ul v-if="tasks.length > 0">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-complete="$emit('toggle-complete', task.id)"
        @delete-task="$emit('delete-task', task.id)"
        @edit-task="$emit('edit-task', task)"
      />
    </ul>
    <p v-else class="no-tasks-message">Sem tarefas ainda! Deseja adicionar uma?</p>
  </div>
</template>

<script setup>
// Importa o componente TaskItem para uso no template.
import TaskItem from './TaskItem.vue';

// 'defineProps' é usado para dizer quais dados este componente recebe do pai (App.vue).
const props = defineProps({
  tasks: {
    type: Array,
    required: true // É obrigatório que o pai (App.vue) passe este array
  }
});

// 'defineEmits' é usado para dizer quais eventos este componente pode "avisar" o pai (App.vue).
const emit = defineEmits(['toggle-complete', 'delete-task', 'edit-task']);
</script>

<style scoped>
.task-list-container {
  margin: 20px 0;
  width: 100%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.no-tasks-message {
  font-style: italic;
  color: #666;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
