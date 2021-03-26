<template>
  <div class="comp-task" :style="[task.started ? { backgroundColor: 'lightgreen' } : { backgroundColor: '' }]">
    <template v-if="task">
      <div class="main-info">
        <div class="task-name">{{ task.name }}</div>
        <div class="time-passed">{{ task.seconds }}</div>
        <!-- <tag-list :task="task" /> -->
        <div class="more-options">
          <a-popover trigger="click" placement="leftTop">
            <a slot="content">Edit <br /></a>
            <a slot="content" @click="deleteTask">Delete<br /></a>
            <a slot="content">Archive</a>
            <a-icon type="more" />
          </a-popover>
        </div>
      </div>
      <div class="estimation" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Task } from '~/models/task.model'
import { tasksService } from '~/services/tasks.service'
export default Vue.extend({
  props: {
    task: Task,
  },
  methods: {
    deleteTask() {
      //   tasksService.deleteTask(this.task)
    },
  },
})
</script>

<style>
.task-name,
.time-passed,
.more-options {
  display: inline;
}

.comp-task {
  border: 1px solid black;
  margin-bottom: 5px;
}

.task-name {
  float: left;
  width: 60%;
}

.time-passed {
  position: relative;
  left: 5%;
}

.more-options {
  float: right;
}

.main-info {
  padding-top: 5px;
  padding-left: 5px;
}

.estimation {
  height: 12px;
}

.comp-tag {
  display: inline;
  position: relative;
  left: 5%;
}
</style>
