<template>
  <div class="comp-task-list">
    <task v-for="task in tasks" :key="task.id" :task="task" @click.native="toggleStopwatch(task)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Task } from '~/models/task.model'
import { tasksService } from '~/services/tasks.service'

export default Vue.extend({
  data() {
    return {
      tasks: [],
    }
  },
  mounted() {
    this.tasks = tasksService.getTasks()
    this.detectTaskChanges()
  },
  methods: {
    toggleStopwatch(task: Task) {
      tasksService.toggleStopwatch(task)
    },
    detectTaskChanges() {
      window.addEventListener('tasks-changed', (event) => {
        this.tasks = event.detail.storage
      })
    },
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
