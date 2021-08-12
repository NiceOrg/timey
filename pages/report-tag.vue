<template>
  <div class="page-report-tag">
    <div v-if="reportData.size === 0" class="empty-data">{{ $t('reports.tag.no-tags-message') }}</div>
    <client-only v-else>
      <pie-chart v-if="dataLoaded" class="chart" :data="chartData" :options="chartOptions" />
      <div v-if="dataLoaded" class="information-message">{{ $t('reports.tag.information-message') }}</div>
      <div v-if="!dataLoaded" class="empty-data">{{ $t('reports.tag.not-enough-information') }}</div>
    </client-only>
  </div>
</template>

<script lang="ts">
/* eslint-disable import/named */
import Vue from 'vue'
import { emit, on } from 'shuutils'
// eslint-disable-next-line import/named
import { ChartData, ChartOptions, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js'
import { Navbar, TagExtended, Task } from '~/models'
import { NAVBAR_SETTINGS, reportPlugin, tasksPlugin, TASK_GET, TASK_SEND } from '~/plugins'

export default Vue.extend({
  data() {
    return {
      chartData: {} as ChartData,
      chartOptions: {} as ChartOptions,
      reportData: new Map<string, TagExtended>(),
      tasks: [] as Task[],
      dataLoaded: false,
    }
  },
  beforeMount() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = tasks))
    emit(TASK_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('reports.tag.tags-report').toString() }))
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
      if (data.every((value: number) => value === 0)) return

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
        plugins: {
          datalabels: {
            formatter: (value, context) => {
              let sum = 0
              const data = context.chart.data.datasets[0].data as number[]
              data.map((data: number) => (sum += data))
              return ((value * 100) / sum).toFixed(0) + '%'
            },
            color: '#fff',
            font: {
              weight: 'bolder',
            },
          },
          legend: {
            align: 'center',
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] {
                const seconds = tooltipItem.dataset.data[tooltipItem.dataIndex] as number
                return tasksPlugin.getTime(seconds)
              },
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
  height: 100%;
}

.chart {
  margin-top: 2rem;
}

.information-message {
  margin-top: 2rem;
  text-align: center;
  font-weight: 500;
}
</style>
