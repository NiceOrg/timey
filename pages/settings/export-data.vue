<template>
  <div class="page-export-data">
    <a-button @click="exportPlugin.generateCSV()">Generate CSV</a-button>
    <a-button @click="exportPlugin.generateExcel()">Generate Excel</a-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { exportPlugin } from '~/plugins/parameters/export.client'

export default Vue.extend({
  layout: 'settings',
  data() {
    return {
      exportPlugin,
    }
  },
  beforeMount() {
    emit('parameter-name', 'Exporter données')
  },
})
</script>

<style></style>
