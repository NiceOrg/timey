<template>
  <div class="page-report-tag">
    <client-only>
      <pie-chart v-if="dataLoaded" class="chart" :data="chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Navbar, TagExtended, Task } from '~/models'
import { reportPlugin, tasksPlugin, TASK_GET, TASK_SEND } from '~/plugins'

export default Vue.extend({
  data() {
    return {
      chartData: {},
      chartOptions: {},
      reportData: new Map<string, TagExtended>(),
      tasks: [] as Task[],
      dataLoaded: false,
    }
  },
  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = tasks))
    emit(TASK_GET)
    emit('navbarSettings', new Navbar('Rapport des tags', false))
    this.generateChart()
  },
  methods: {
    fillData(tagsMap: Map<string, TagExtended>) {
      const labels = []
      const backgroundColor = []
      const data = []
      for (const [key, value] of tagsMap) {
        labels.push(key)
        backgroundColor.push(value.tag.color)
        data.push(value.seconds)
      }
      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Tag Data',
            backgroundColor,
            data,
          },
        ],
      }
      this.dataLoaded = true
    },
    fillOptions() {
      this.chartOptions = {
        legend: {
          align: 'center',
          position: 'bottom',
        },
        tooltips: {
          callbacks: {
            label(tooltipItem: any, data: any) {
              const seconds = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              return tasksPlugin.getTime(seconds)
            },
          },
        },
      }
    },
    generateChart() {
      this.reportData = reportPlugin.generateReportData(this.tasks)
      this.fillOptions()
      this.fillData(this.reportData)
    },
  },
})
</script>

<style scoped>
.page-report-tag {
  overflow-y: auto;
}

.chart {
  margin-top: 2rem;
}
</style>
