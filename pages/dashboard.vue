<template>
  <div class="page-dashboard">
    <task-list />
    <task-add />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'app-layout',
})
</script>
>

<style>
.no-bullets {
  list-style-type: none;
}
</style>
