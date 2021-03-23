<template>
  <div class="comp-task-add">
    <a-form v-if="show" v-model="newTask" layout="inline" @submit="addTask">
      <a-input v-model="newTask.name" style="width: 25%" size="small" placeholder="Nom tâche"> </a-input>
      <a-time-picker style="width: 30%" size="small" placeholder="Temps passé" />
      <a-time-picker style="width: 30%" size="small" placeholder="Estimation" />
      <a-button type="primary" html-type="submit" shape="circle" size="small"> OK </a-button>
    </a-form>
    <a-button type="primary" shape="circle" icon="plus" @click="showForm" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Task } from '~/models/task.model'
import { Timestamp } from '~/models/timestamp.model'
import { tasksService } from '~/services/tasks.service'

export default Vue.extend({
  data() {
    return {
      show: false,
      newTask: new Task(-1, '', new Timestamp(0, 0, 0, 0, 0)),
    }
  },
  methods: {
    showForm() {
      this.show = true
    },
    addTask(e) {
      e.preventDefault()
      tasksService.addTask(this.newTask)
      this.show = false
    },
  },
})
</script>

<style></style>
