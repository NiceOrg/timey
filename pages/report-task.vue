<template>
  <div class="page-report-task">
    <div v-for="(task, index) in orderedTasks" :key="task.id" class="task-reported">
      <template v-if="!task.seconds == 0">
        <a-icon v-if="index == 0" theme="filled" type="crown" :style="{ color: '#C9B037' }" />
        <a-icon v-else-if="index == 1" theme="filled" type="crown" :style="{ color: '#D7D7D7' }" />
        <a-icon v-else-if="index == 2" theme="filled" type="crown" :style="{ color: '#6A3805' }" />
        <template v-else> #{{ index + 1 }} </template>

        <strong>{{ task.name }}</strong> {{ tasksPlugin.getTime(task.seconds) }}
        <div class="progression-bar" :style="{ width: progressionBarSize(task) }"></div>
        <br />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Task } from '~/models/task.model'
import { TASK_GET, TASK_SEND, tasksPlugin } from '~/plugins/tasks.client'

export default Vue.extend({
  data() {
    return {
      orderedTasks: [] as Task[],
      tasksPlugin,
    }
  },
  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => this.orderTasks(tasks))
    emit(TASK_GET)
  },
  methods: {
    progressionBarSize(task: Task) {
      return (task.seconds / this.orderedTasks[0].seconds) * 100 + '%'
    },
    orderTasks(tasks: Task[]) {
      this.orderedTasks = tasks
        .map((task: Task) => new Task(task.id, task.name, task.seconds, task.started))
        .sort(Task.compareSeconds)
        .slice(0, 10)
    },
  },
})
</script>

<style scoped>
.page-report-task {
  overflow-y: auto;
}

.task-reported {
  margin: 0 0.6rem;
}

.progression-bar {
  border: 0.1rem solid black;
  height: 1.9rem;
  border-radius: 1rem;
  background-color: #e4f6c0;
}
</style>
