<template>
  <div class="comp-task" :style="taskStatusStyling">
    <template v-if="task">
      <div class="task-name">{{ task.name }}</div>
      <div class="time-passed">{{ tasksPlugin.getTime(task.seconds) }}</div>
      <tag-list :task="task" />
      <div class="more-options" @click="stopPropagation($event)">
        <a-popover trigger="click" placement="leftTop">
          <a slot="content">Edit <br /></a>
          <a slot="content" @click="emit(TASK_DELETE, task)">Delete<br /></a>
          <a slot="content">Archive</a>
          <a-icon type="more" />
        </a-popover>
      </div>
      <div class="estimation" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Task } from '~/models/task/task.model'
import { stopPropagation } from '~/utils/event'
import { TASK_DELETE, tasksPlugin } from '~/plugins/tasks.client'
import { TaskStatus } from '~/models/task/task-status.enum'

export default Vue.extend({
  props: {
    task: {
      default: () => new Task(),
      type: Task,
      required: true,
    },
  },
  data() {
    return {
      stopPropagation,
      emit,
      TASK_DELETE,
      tasksPlugin,
      TaskStatus,
    }
  },
  computed: {
    taskStatusStyling(): any {
      let color = 'white'
      switch (this.task.started) {
        case TaskStatus.started:
          color = 'lightgreen'
          break
        case TaskStatus.paused:
          color = 'yellow'
          break
      }
      return { background: color }
    },
  },
})
</script>

<style scoped>
.comp-task {
  border: 1px solid black;
  margin-bottom: 0.3rem;
  padding-top: 0.3rem;
}

.task-name {
  display: inline;
  float: left;
  width: 60%;
  padding-left: 0.3rem;
}

.time-passed,
.comp-tag {
  display: inline;
  position: relative;
  left: 5%;
}

.more-options {
  display: inline;
  float: right;
}

.estimation {
  height: 0.3rem;
}
</style>
