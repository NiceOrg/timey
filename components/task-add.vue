<template>
  <div class="comp-task-add">
    <a-form v-if="show" v-model="newTask" layout="inline" @submit="addTask">
      <a-input v-model="newTask.name" style="width: 25%" size="small" placeholder="Nom tâche"> </a-input>
      <a-button type="primary" html-type="submit" shape="circle" size="small"> OK </a-button>
    </a-form>
    <a-button v-if="show == false" type="primary" shape="circle" icon="plus" @click="show = true" />
    <a-button v-else type="danger" shape="circle" icon="minus" @click="show = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Task } from '~/models/task.model'
import { emit } from '~/node_modules/shuutils/dist/src'
import { TASK_ADD } from '~/plugins/tasks.client'

export default Vue.extend({
  data() {
    return {
      show: false,
      newTask: new Task(),
    }
  },
  methods: {
    addTask(event: Event) {
      event.preventDefault()
      emit(TASK_ADD, this.newTask)
      this.show = false
      this.newTask = new Task()
    },
  },
})
</script>
