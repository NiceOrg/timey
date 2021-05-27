<template>
  <div class="comp-task-list">
    <tasks v-for="task in tasks" :key="task.id" :task="task" @click.native="emit(TASK_TOGGLE, task)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { TASK_TOGGLE } from '~/plugins'

export default Vue.extend({
  props: {
    tasks: {
      default: () => [],
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      emit,
      TASK_TOGGLE,
    }
  },
})
</script>

<style scoped>
.comp-task-list {
  overflow-y: auto;
  height: 100%;
  padding: 0.3rem 1rem 1rem 1rem;
}
</style>
