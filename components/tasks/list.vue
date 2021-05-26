<template>
  <div class="comp-task-list">
    <div v-show="tasks.length == 0" class="empty-tasks">Appuyer sur le bouton pour ajouter une nouvelle tâche.</div>
    <div v-show="tasks.length !== 0">
      <tasks v-for="task in tasks" :key="task.id" :task="task" @click.native="emit(TASK_TOGGLE, task)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { TASK_TOGGLE } from '~/plugins'

export default Vue.extend({
  props: {
    tasks: {
      default: () => [],
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      emit,
      TASK_TOGGLE,
    }
  },
})
</script>

<style scoped>
.comp-task-list {
  overflow-y: auto;
  height: 100%;
  padding: 0.3rem 1rem 1rem 1rem;
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
