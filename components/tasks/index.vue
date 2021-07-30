<template>
  <div class="comp-task" :class="taskStatusClass">
    <div class="task">
      <div class="task-name ellipsis">{{ task.name }}</div>
      <div class="time-passed">{{ tasksPlugin.getTime(task.seconds) }}</div>
      <tags-list :task="task" />
      <div class="more-options" @click="stopPropagation($event)">
        <a-popover v-model="visibleOptions" trigger="click" placement="bottomRight" arrow-point-at-center>
          <a slot="content" class="options-style font" @click="visibleOptions = false">
            <div @click="showEdit = true">{{ $t('global.edit') }}</div>
            <a-modal v-model="showEdit" :title="$t('dashboard.edit-task')" :footer="null">
              <tasks-edit v-if="showEdit" :task="task" />
            </a-modal>
            <a-divider class="block" />
            <div @click="emit(TASK_DELETE, task)">{{ $t('global.delete') }}</div>
          </a>
          <a-icon type="more" />
        </a-popover>
      </div>
    </div>
    <div class="estimation">
      <div class="progression" :class="estimationClass" :style="estimationStyling"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Task, TaskStatus } from '~/models'
import { stopPropagation } from '~/utils'
import { TASK_DELETE, tasksPlugin, CLOSE_CONTENT } from '~/plugins'

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
      visibleOptions: false,
      showEdit: false,
    }
  },
  computed: {
    estimation(): number {
      return this.task.estimation < 1 ? 0 : (this.task.seconds / this.task.estimation) * 100
    },
    taskStatusClass(): any {
      if (this.task.started === TaskStatus.started) return 'accent'
      else if (this.task.started === TaskStatus.stopped) return 'secondary-light'

      return 'warning-light'
    },
    estimationStyling(): any {
      const estimation = this.estimation
      if (estimation < 100) return { width: estimation + '%' }

      return {}
    },
    estimationClass(): any {
      const estimation = this.estimation
      if (estimation < 100) return 'transition'
      else if (estimation < 120) return 'complete success'
      else if (estimation < 166) return 'complete warn'
      else if (estimation < 200) return 'complete warn-dark'

      return 'complete danger'
    },
  },
  beforeMount() {
    on(CLOSE_CONTENT, () => (this.showEdit = false))
  },
})
</script>

<style scoped>
.comp-task {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 0.1rem solid grey;
  border-radius: 0.7rem;
  box-shadow: 0.1rem 0.1rem 0.3rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  overflow: hidden;
}

.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}

.task-name {
  width: 50%;
  padding-left: 1rem;
  font-weight: 500;
}

.more-options {
  display: inline;
  float: right;
  padding-right: 0.5rem;
}

.options-style {
  font-size: 1.2rem;
}

.block {
  margin: 0.5rem 0;
}

.estimation {
  height: 0.3rem;
}

.progression {
  height: inherit;
}

.transition {
  transition: width 1s;
  background-color: var(--primary, grey);
}

.font {
  font-weight: 700;
}

.more-options a {
  color: var(--secondary, gray);
}

.complete {
  width: '100%';
  transition: background-color 5s;
}
</style>
