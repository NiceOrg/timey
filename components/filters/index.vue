<template>
  <div class="comp-filters">
    <filters-tags />
    <a-divider />
    <div v-if="hiddenTasks > 0" class="search-message bold">{{ hiddenTasks }} {{ $tc('filters.tasks-hidden-by-filters', hiddenTasks) }}</div>
  </div>
</template>

<script lang="ts">
import { on } from 'shuutils'
import Vue from 'vue'
import { filtersPlugin, FILTERS_SEND } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      hiddenTasks: 0,
    }
  },
  beforeMount() {
    on(FILTERS_SEND, () => (this.hiddenTasks = filtersPlugin.getHiddenTasksCount()))
  },
})
</script>

<style scoped>
.search-message {
  text-align: center;
}
</style>
