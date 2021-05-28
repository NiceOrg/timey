<template>
  <div class="page-dashboard">
    <a-input v-if="showFilter" v-model="filter" type="text" class="task-filter" placeholder="Filtrer tâches" />
    <tasksList :tasks="filterTask" />
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
import { Navbar, Task } from '~/models'
import { NAVBAR, CLOSE_CONTENT, NAVBAR_SEARCH, TASK_SEND, TASK_GET } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      showEdit: false,
      showFilter: false,
      filter: '',
      tasks: [] as Task[],
    }
  },
  computed: {
    filterTask(): Task[] {
      if (this.filter.length === 0) {
        return this.tasks
      }
      return this.tasks.filter((task: Task) => task.name.toLowerCase().includes(this.filter.toLowerCase()))
    },
  },

  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = [...tasks]))
    on(CLOSE_CONTENT, () => (this.showEdit = false))
    on(NAVBAR_SEARCH, (search: string) => (this.filter = search))

    emit(TASK_GET)
    emit(NAVBAR, new Navbar({ title: 'Dashboard', isSearch: true }))
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

.task-filter {
  width: 40%;
  margin: 0.6rem 0.5rem 0 auto;
}

.foot {
  height: 3rem;
  width: 100%;
  border-top: 0.1rem var(--primary, grey);
  box-shadow: 0.1rem -0.1rem 0.2rem;
}

.comp-task-add {
  position: absolute;
  bottom: 1rem;
  left: 44%;
}

.button-add {
  box-shadow: 0 0 0.4rem;
  color: grey;
  width: 3.8rem;
  height: 3.8rem;
}

.footer {
  z-index: 1;
}
</style>
