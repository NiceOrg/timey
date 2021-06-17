<template>
  <div class="page-dashboard">
    <filters v-if="filterTask.length > 0 || filtersPlugin.isFilter()" />
    <div v-if="filterTask.length === 0 && !filtersPlugin.isFilter()" class="empty-data">Appuyer sur le bouton pour ajouter une nouvelle tâche.</div>
    <div v-if="filterTask.length === 0 && filtersPlugin.isFilter()" class="empty-data">Aucune tâche n'a été trouvée.</div>
    <tasks-list v-if="filterTask.length > 0" :tasks="filterTask" />
    <div class="footer">
      <div class="comp-task-add">
        <a-button class="button-add" shape="circle" icon="plus" @click="showEdit = true" />
        <a-modal v-model="showEdit" title="Ajouter une tâche" :footer="null">
          <tasks-edit v-if="showEdit" />
        </a-modal>
      </div>
      <div class="foot" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Filters, Navbar, Tag, Task } from '~/models'
import {
  NAVBAR_SETTINGS,
  CLOSE_CONTENT,
  NAVBAR_SEARCH,
  TASK_SEND,
  TASK_GET,
  FILTERS_SEND,
  FILTERS_GET,
  FILTERS_SET_TITLE,
  filtersPlugin,
} from '~/plugins'
export default Vue.extend({
  data() {
    return {
      showEdit: false,
      filters: {} as Filters,
      tasks: [] as Task[],
      filtersPlugin,
    }
  },
  computed: {
    filterTask(): Task[] {
      let taskFiltered = this.tasks
      if (this.filters.tags.length > 0) {
        taskFiltered = taskFiltered.filter((task: Task) => task.tags.some((tag: Tag) => this.filters.tags.find((t: Tag) => t.id === tag.id)))
      }
      if (this.filters.title !== '') {
        taskFiltered = taskFiltered.filter((task: Task) => task.name.toLowerCase().includes(this.filters.title.toLowerCase()))
      }
      return taskFiltered
    },
  },

  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = [...tasks]))
    on(FILTERS_SEND, (filters: Filters) => (this.filters = filters))
    on(CLOSE_CONTENT, () => (this.showEdit = false))
    on(NAVBAR_SEARCH, (search: string) => emit(FILTERS_SET_TITLE, search))

    emit(TASK_GET)
    emit(FILTERS_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: 'Dashboard', isSearch: true }))
  },
})
</script>

<style scoped>
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
  margin-top: auto;
}
</style>
