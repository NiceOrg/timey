<template>
  <canvas ref="chart" width="400" height="400"></canvas>
</template>

<script lang="ts">
/* eslint-disable import/named */
import Vue from 'vue'
import { Chart, ChartData, ChartItem, ChartOptions, registerables } from 'chart.js'
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels'

export default Vue.extend({
  props: {
    data: {
      type: Object as () => ChartData,
      default: undefined,
    },
    options: {
      type: Object as () => ChartOptions,
      default: undefined,
    },
  },
  mounted(): void {
    Chart.register(...registerables)
    const element = this.$refs.chart as HTMLCanvasElement
    const item = element.getContext('2d') as ChartItem
    const { data, options } = this
    new Chart(item, { type: 'pie', data, options, plugins: [ChartJsPluginDataLabels] }) // eslint-disable-line no-new
  },
})
</script>
