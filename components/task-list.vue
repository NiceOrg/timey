<template>
  <div class="comp-task-list">
    <task v-for="task in tasks" :key="task.id" :task="task" @click.native="emit(TASK_TOGGLE, task)" />
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
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = tasks))
    emit(TASK_GET)
  },
})
</script>

<style scoped>
.comp-task-list {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
