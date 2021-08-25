<template>
  <div class="page-dashboard">
    <filters v-if="filteredTask.length > 0 || filtersPlugin.isFilter()" />
    <div v-if="filteredTask.length === 0 && !filtersPlugin.isFilter()" class="text-info">{{ $t('dashboard.no-task-message') }}</div>
    <div v-if="filteredTask.length === 0 && filtersPlugin.isFilter()" class="text-info">{{ $t('dashboard.no-task-found') }}</div>
    <tasks-list v-if="filteredTask.length > 0" :tasks="filteredTask" />
    <div class="footer">
      <div class="comp-task-add">
        <a-button class="button-add" shape="circle" icon="plus" @click="showEdit = true" />
        <a-modal v-model="showEdit" :title="$t('dashboard.add-task')" :footer="null">
          <tasks-edit v-if="showEdit" />
        </a-modal>
      </div>
      <div class="foot">
        <div class="speech-icon">
          <speech-recognition />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Filters, Languages, Navbar, Task } from '~/models'
import {
  NAVBAR_SETTINGS,
  CLOSE_CONTENT,
  NAVBAR_SEARCH,
  FILTERS_SET_TITLE,
  filtersPlugin,
  FILTERS_GET,
  FILTERS_SEND,
  parametersPlugin,
} from '~/plugins'
export default Vue.extend({
  data() {
    return {
      showEdit: false,
      filters: {} as Filters,
      filtersPlugin,
      filteredTask: [] as Task[],
    }
  },
  beforeMount() {
    parametersPlugin.updateLanguage(this.$i18n.locale as Languages)
    on(CLOSE_CONTENT, () => (this.showEdit = false))
    on(NAVBAR_SEARCH, (search: string) => emit(FILTERS_SET_TITLE, search))
    on(FILTERS_SEND, () => (this.filteredTask = filtersPlugin.getTasksFiltered()))

    emit(FILTERS_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('global.dashboard').toString(), isSearch: true }))
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

.speech-icon {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: inherit;
  align-items: center;
  margin-right: 1rem;
  font-size: 1.3rem;
}
</style>
