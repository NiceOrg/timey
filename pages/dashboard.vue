<template>
  <div class="page-dashboard">
    <tasksList :tasks="tasks" />
    <div class="footer">
      <div class="comp-task-add">
        <a-button class="button-add" shape="circle" icon="plus" @click="showEdit = true" />
        <a-modal v-model="showEdit" title="Ajouter une tâche" :footer="null">
          <tasksEdit v-if="showEdit" />
        </a-modal>
      </div>
      <div class="foot" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Task } from '~/models'
import { CLOSE_CONTENT, TASK_SEND, TASK_GET } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      showEdit: false,
      tasks: [] as Task[],
    }
  },
  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = [...tasks]))
    on(CLOSE_CONTENT, () => (this.showEdit = false))

    emit(TASK_GET)
  },
})
</script>

<style scoped>
.no-bullets {
  list-style-type: none;
}

.page-dashboard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  height: inherit;
}

.foot {
  height: 3rem;
  width: 100%;
  border-top: 1px var(--dark-gray-blue, grey);
  box-shadow: 1px -1px 4px;
}

.comp-task-add {
  position: absolute;
  bottom: 1rem;
  left: 44%;
}

.button-add {
  box-shadow: 0px 0px 8px;
  color: grey;
  width: 60px;
  height: 60px;
}

.footer {
  z-index: 1;
}
</style>
