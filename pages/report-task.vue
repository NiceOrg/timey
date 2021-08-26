<template>
  <div class="page-report-task">
    <div v-if="orderedTasks.length === 0" class="empty-data">{{ $t('reports.task.no-task-message') }}</div>
    <div v-for="task in orderedTasks" :key="task.id">
      <div v-if="!task.seconds == 0" class="task-reported">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-infos">
          <div class="progression-bar" :style="progressionBarSize(task)">
            <div v-if="roomForTime(task)" class="task-time">{{ tasksPlugin.getTime(task.seconds) }}</div>
          </div>
          {{ timeEstimation(task.seconds) }}
        </div>
      </div>
    </div>
    <div class="task-exceeded-button" @click="increaseMaxTaskCount()">
      <a-button v-if="tasks.length > maxTaskDisplayed" class="max-tasks-exceeded">{{ $t('reports.task.tasks-exceeded-message') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import formatDistance from 'date-fns/formatDistance'
import fr from 'date-fns/locale/fr'
import enUS from 'date-fns/locale/en-US'
import { Navbar, Task } from '~/models'
import { TASK_GET, TASK_SEND, tasksPlugin, NAVBAR_SETTINGS } from '~/plugins'

export default Vue.extend({
  data() {
    return {
      orderedTasks: [] as Task[],
      tasksPlugin,
      maxTaskDisplayed: 7,
      tasks: [] as Task[],
    }
  },
  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => {
      this.tasks = tasks
      this.orderTasks(tasks)
    })
    emit(TASK_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('reports.task.tasks-report').toString() }))
  },
  methods: {
    progressionBarSize(task: Task): Record<string, string> {
      return { width: (task.seconds / this.orderedTasks[0].seconds) * 65 + '%' }
    },
    orderTasks(tasks: Task[]) {
      this.orderedTasks = tasks
        .map((task: Task) => new Task(task.id, task.name, task.seconds, task.started))
        .sort(Task.compareSeconds)
        .slice(0, this.maxTaskDisplayed)
        .filter((task: Task) => task.seconds > 0)
    },
    timeEstimation(seconds: number) {
      return formatDistance(0, seconds * 1000, { locale: this.getDateFNSLangFromI18N() })
    },
    increaseMaxTaskCount() {
      this.maxTaskDisplayed = this.tasks.length
      this.orderTasks(this.tasks)
    },
    getDateFNSLangFromI18N() {
      switch (this.$i18n.locale) {
        case 'fr':
          return fr
        case 'en':
          return enUS
        default:
          return fr
      }
    },
    roomForTime(task: Task) {
      return task.seconds / this.orderedTasks[0].seconds > 0.3
    },
  },
})
</script>

<style scoped>
.page-report-task {
  overflow-y: auto;
  height: 100%;
  margin: 0.6rem 0.6rem;
}

.task-name {
  font-weight: 500;
  font-size: 1.2rem;
}

.task-infos {
  display: flex;
  justify-content: space-between;
  margin-top: 0.6rem;
  align-items: center;
}

.task-time {
  padding-left: 1rem;
  height: inherit;
  display: grid;
  align-content: center;
}

.progression-bar {
  border-radius: 0.4rem;
  color: var(--font-color-secondary, white);
  background-color: var(--primary-dark, grey);
  border: 0.1rem solid var(--font-color-primary, black);
  height: 2rem;
}

.task-reported {
  height: 3.6rem;
  margin-bottom: 1.3rem;
}

.max-tasks-exceeded {
  margin-top: 2rem;
  text-align: center;
  font-weight: 500;
}

.task-exceeded-button {
  display: flex;
  justify-content: center;
}
</style>
