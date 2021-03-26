<template>
  <div class="comp-task-list">
    <task v-for="task in tasks" :key="task.id" :task="task" @click.native="tasksService.toggle(task)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Task } from '~/models/task.model'
import { tasksService } from '~/services/tasks.service'

export default Vue.extend({
  data() {
    return {
      tasks: [] as Task[],
      tasksService,
    }
  },
  mounted() {
    this.tasks = tasksService.tasks.map((task) => new Task(task.id, task.name, task.seconds))
    console.log(this.tasks)
    // this.detectTaskChanges()
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
