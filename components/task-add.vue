<template>
  <div class="comp-task-add">
    <a-button type="primary" shape="circle" icon="plus" @click="visible = true" />
    <a-modal title="Ajouter une tâche" :visible="visible" @ok="add" @cancel="visible = false">
      Nom :
      <a-input v-model="newTask.name"> </a-input>
      Estimation (facultatif) :
      <a-input v-model="estimation"> </a-input>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Task } from '~/models/task.model'
import { TASK_ADD } from '~/plugins/tasks.client'

export default Vue.extend({
  data() {
    return {
      visible: false,
      estimation: '',
      newTask: new Task(),
    }
  },
  methods: {
    add() {
      const [hours, minutes] = this.estimation.split('h')
      this.newTask.estimation = Number(hours) * 3600 + Number(minutes) * 60 || -1
      emit(TASK_ADD, this.newTask)
      this.newTask = new Task()
      this.visible = false
    },
  },
})
</script>
