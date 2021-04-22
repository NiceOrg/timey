<template>
  <div class="comp-task" :style="[task.started ? { backgroundColor: 'lightgreen' } : { backgroundColor: '' }]">
    <template v-if="task">
      <div class="task-name">{{ task.name }}</div>
      <div class="time-passed">{{ task.getTime() }}</div>
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
import { Task } from '~/models/task.model'
import { stopPropagation } from '~/utils/event'
import { emit } from '~/node_modules/shuutils/dist/src'
import { TASK_DELETE } from '~/plugins/tasks.client'

export default Vue.extend({
  props: {
    task: Task,
  },
  data() {
    return {
      stopPropagation,
      emit,
      TASK_DELETE,
    }
  },
})
</script>

<style scoped>
.comp-task {
  border: 1px solid black;
  margin-bottom: 5px;
  padding-top: 5px;
}

.task-name {
  display: inline;
  float: left;
  width: 60%;
  padding-left: 5px;
}

.time-passed {
  display: inline;
  position: relative;
  left: 5%;
}

.more-options {
  display: inline;
  float: right;
}

.estimation {
  height: 5px;
}
</style>
