<template>
  <div class="comp-task-list">
    <task v-for="task in tasks" :key="task.id" :task="task" @click.native="tasksService.toggle(task)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Task } from '~/models/task.model'
import { tasksService } from '~/services/tasks.service'
import { eventBus } from '~/utils/event'

export default Vue.extend({
  data() {
    return {
      tasks: [] as Task[],
      tasksService,
    }
  },
  mounted() {
    this.tasks = tasksService.tasks
    eventBus.$on('tasks-update', (tasks: Task[]) => (this.tasks = tasks))
  },
})
</script>

<style>
.comp-task-list {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
