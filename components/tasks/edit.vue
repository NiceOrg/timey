<template>
  <div class="comp-task-edit">
    <a-form :form="form" layout="inline" @submit="updateTask">
      <a-form-item>
        <div class="name">
          {{ $t('global.name') }}
          <a-input v-decorator="['name', { rules: [{ required: true, message: $t('dashboard.no-task-entered') }] }]" class="name-input" auto-focus />
        </div>
      </a-form-item>
      <div class="spacer" />
      <div class="add-tags">
        tag : <tags-list :task="task" :edit="true" />
        <div />
      </div>
      <div class="spacer" />
      <a-collapse accordion>
        <a-collapse-panel key="estimation" :header="$tc('global.estimation')">
          <a-form-item> <a-input-number v-decorator="['days']" :min="0" size="small" class="input" /> {{ $tc('global.day', 2) }} </a-form-item>
          <br />
          <a-form-item>
            <a-input-number v-decorator="['hours']" :min="0" :max="23" size="small" class="input" /> {{ $tc('global.hour', 2) }}
          </a-form-item>
          <br />
          <a-form-item>
            <a-input-number v-decorator="['minutes']" :min="0" :max="59" size="small" class="input" /> {{ $tc('global.minute', 2) }}
          </a-form-item>
        </a-collapse-panel>
      </a-collapse>
      <div class="spacer"></div>
      <div>
        <div class="spacer"></div>
        <div class="task-edit-submit">
          <a-button @click="close()">{{ $t('global.cancel') }}</a-button>
          <a-button class="accent-light" html-type="submit">{{ $t('global.save') }}</a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Tag, Task } from '~/models'
import { CLOSE_CONTENT, TAG_LIST, TASK_UPDATE } from '~/plugins'
import { ONE_DAY } from '~/utils'

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
      tags: [] as Tag[],
    }
  },
  mounted() {
    this.initialiseForm()
    on(TAG_LIST, (tagList: Tag[]) => (this.tags = tagList))
  },
  methods: {
    updateTask(event: Event) {
      event.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          const estimation = Number(values.days) * ONE_DAY + Number(values.hours) * 3600 + Number(values.minutes) * 60 || 0
          const task = new Task(this.task.id, values.name, this.task.seconds, this.task.started, this.tags, estimation)
          emit(TASK_UPDATE, task)
          this.close()
        }
      })
    },
    close() {
      emit(CLOSE_CONTENT)
    },
    initialiseForm() {
      this.form.getFieldDecorator('days', { initialValue: 0 })
      this.form.getFieldDecorator('hours', { initialValue: 0 })
      this.form.getFieldDecorator('minutes', { initialValue: 0 })

      const days = Math.floor(this.task.estimation / ONE_DAY)
      let remainer = this.task.estimation % ONE_DAY
      const hours = Math.floor(remainer / 3600)
      remainer = remainer % 3600
      const minutes = Math.floor(remainer / 60)
      this.form.setFieldsValue({ name: this.newTask.name, days, hours, minutes })
    },
  },
})
</script>

<style>
.button-add {
  box-shadow: 0 0 0.5rem;
  color: grey;
  width: 3.2rem;
  height: 3.2rem;
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

.add-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list {
  overflow: auto;
  padding-right: 0.5rem;
  height: 12rem;
}
</style>
