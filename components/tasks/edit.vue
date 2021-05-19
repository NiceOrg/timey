<template>
  <div class="comp-task-edit">
    <a-form :form="form" layout="inline" @submit="updateTask">
      <a-form-item>
        <div class="name">
          Nom
          <a-input v-decorator="['name', { rules: [{ required: true, message: 'Veuillez insérer un nom de tâche!' }] }]" class="name-input" />
        </div>
      </a-form-item>
      <a-checkbox v-model="activateEstimation"> Estimation</a-checkbox>
      <div v-show="activateEstimation">
        <a-form-item> <a-input-number v-decorator="['days']" :min="0" size="small" class="input" /> jours </a-form-item>
        <br />
        <a-form-item> <a-input-number v-decorator="['hours']" :min="0" :max="23" size="small" class="input" /> heures </a-form-item>
        <br />
        <a-form-item> <a-input-number v-decorator="['minutes']" :min="0" :max="59" size="small" class="input" /> minutes </a-form-item>
      </div>
      <div>
        <div class="task-edit-submit">
          <a-button @click="close()">Cancel</a-button>
          <a-button type="primary" html-type="submit">Save</a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Task } from '~/models'
import { TASK_UPDATE } from '~/plugins'

export default Vue.extend({
  props: {
    task: {
      default: () => new Task(),
      type: Task,
    },
  },
  data() {
    return {
      newTask: new Task(this.task.id, this.task.name, this.task.seconds, this.task.started, this.task.tags, this.task.estimation),
      form: this.$form.createForm(this, { name: 'taskForm' }),
      activateEstimation: false,
    }
  },
  mounted() {
    const days = Math.floor(this.task.estimation / 86400)
    let remainer = this.task.estimation % 86400
    const hours = Math.floor(remainer / 3600)
    remainer = remainer % 3600
    const minutes = Math.floor(remainer / 60)

    this.form.setFieldsValue({ name: this.newTask.name, days, hours, minutes })
    this.activateEstimation = this.task.estimation > 0
  },
  methods: {
    updateTask(event: Event) {
      event.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          const estimation = this.activateEstimation ? Number(values.days) * 86400 + Number(values.hours) * 3600 + Number(values.minutes) * 60 : 0
          const task = new Task(this.task.id, values.name, this.task.seconds, this.task.started, this.task.tags, estimation)
          emit(TASK_UPDATE, task)
          this.close()
        }
      })
    },
    close() {
      this.$emit('closeContent')
    },
  },
})
</script>

<style>
.button-add {
  box-shadow: 0px 0px 8px;
  color: grey;
  width: 60px;
  height: 60px;
}

.days,
.hours,
.minutes {
  display: inline-block;
}

.input {
  width: 3rem;
}

.task-edit-submit {
  display: flex;
  justify-content: flex-end;
}

.name {
  display: flex;
  justify-content: space-between;
}

.name-input {
  width: 60%;
  height: auto;
}
</style>
