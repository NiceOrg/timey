<template>
  <div class="comp-task-list">
    <div v-show="tasks.length == 0" class="empty-tasks">Appuyer sur le bouton pour ajouter une nouvelle tâche.</div>
    <div v-show="tasks.length !== 0">
      <tasksTask v-for="task in tasks" :key="task.id" :task="task" @click.native="emit(TASK_TOGGLE, task)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Task } from '~/models'
import { TASK_TOGGLE, TASK_SEND, TASK_GET } from '~/plugins'

export default Vue.extend({
  data() {
    return {
      tasks: [] as Task[],
      emit,
      TASK_TOGGLE,
    }
  },
  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = [...tasks]))
    emit(TASK_GET)
  },
})
</script>

<style scoped>
.comp-task-list {
  overflow-y: auto;
  height: 100%;
  padding: 1.5rem 1rem 1rem 1rem;
}

.empty-tasks {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  font-style: italic;
  font-size: 22px;
}
</style>
