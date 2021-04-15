<template>
  <div class="app">
    <navbar />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { tasksService } from '~/services/tasks.service'
export default Vue.extend({
  beforeDestroy() {
    tasksService.clearTimer()
  },
})
</script>

<style>
.app {
  display: flex;
  flex-flow: column;
  overflow: hidden;
  height: 100%;
}
</style>
