<template>
  <div class="page-report-tag">
    <pie-chart v-if="dataLoaded" class="chart" :chart-data="dataCollection" :options="options" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TagExtended } from '~/models/tag-extended.models'
import { Task } from '~/models/task.model'
import { emit, on } from '~/node_modules/shuutils/dist/src'
import { reportPlugin } from '~/plugins/report.client'
import { tasksPlugin, TASK_GET, TASK_SEND } from '~/plugins/tasks.client'

export default Vue.extend({
  data() {
    return {
      dataCollection: {} as Object,
      options: {} as Object,
      reportData: new Map<string, TagExtended>(),
      tasks: [] as Task[],
      dataLoaded: false,
    }
  },
  created() {
    on(TASK_SEND, (tasks: Task[]) => (this.tasks = tasks))
  },
  mounted() {
    emit(TASK_GET)
    this.reportData = reportPlugin.generateReportData(this.tasks)
    this.fillOptions()
    this.fillData(this.reportData)
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
      this.dataCollection = {
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
      this.options = {
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
