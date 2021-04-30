<script lang="ts">
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    chartData: {
      default: () => {},
      type: Object,
    },
    options: {
      default: () => {},
      type: Object,
    },
  },
  mounted(): void {
    this.renderChart(this.chartData, this.options)
  },
}
</script>
