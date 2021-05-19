<template>
  <div class="comp-task" :style="taskStatusStyling">
    <div class="task">
      <div class="task-name">{{ task.name }}</div>
      <div class="time-passed">{{ tasksPlugin.getTime(task.seconds) }}</div>
      <tags-list :task="task" />
      <div class="more-options" @click="stopPropagation($event)">
        <a-popover v-model="visibleOptions" trigger="click" placement="bottomRight" arrow-point-at-center>
          <a slot="content" class="options-style font" @click="visibleOptions = false">
            <div @click="showEdit = true">Edit</div>
            <a-modal v-model="showEdit" title="Éditer une tâche" :footer="null">
              <tasksEdit v-if="showEdit" :task="task" @closeContent="showEdit = false" />
            </a-modal>
            <a-divider class="block" />
            Archiver
            <a-divider class="block" />
            <div @click="emit(TASK_DELETE, task)">Supprimer</div>
          </a>
          <a-icon type="more" />
        </a-popover>
      </div>
    </div>
    <div class="estimation">
      <div class="progression" :style="{ width: estimation }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Task, TaskStatus } from '~/models'
import { stopPropagation } from '~/utils'
import { TASK_DELETE, tasksPlugin } from '~/plugins'

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
    estimation(): string {
      if (this.task.estimation < 1) {
        return '0%'
      }
      const ratio = this.task.seconds / this.task.estimation
      if (ratio > 1) {
        return '100%'
      }
      return ratio * 100 + '%'
    },
    taskStatusStyling(): any {
      let color = '#e8f4f8;'
      switch (this.task.started) {
        case TaskStatus.started:
          color = '#86c5da'
          break
        case TaskStatus.paused:
          color = '#ffff99'
          break
        case TaskStatus.stopped:
          color = '#e8f4f8'
          break
      }
      return { background: color }
    },
  },
})
</script>

<style scoped>
.comp-task {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #e8f4f8;
  border: 1px solid grey;
  border-radius: 13px;
  box-shadow: 1px 1px 5px;
  margin-bottom: 1rem;
  font-size: 20px;
  overflow: hidden;
}

.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}

.task-name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  font-size: 20px;
}

.block {
  margin: 0.5rem 0;
}

.estimation {
  height: 0.3rem;
}

.progression {
  background-color: var(grey, grey);
  height: inherit;
}

.font {
  font-weight: 700;
}

.more-options a {
  color: var(--gray-blue, gray);
}
</style>
