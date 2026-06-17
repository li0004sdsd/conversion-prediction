<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Avg Score', 'Count'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: props.data.map(d => d.date) },
  yAxis: [
    { type: 'value', name: 'Score', min: 0, max: 1, axisLabel: { formatter: (v) => `${(v * 100).toFixed(0)}%` } },
    { type: 'value', name: 'Count' },
  ],
  series: [
    {
      name: 'Avg Score',
      type: 'line',
      smooth: true,
      data: props.data.map(d => d.avg_score),
      itemStyle: { color: '#409eff' },
      areaStyle: { opacity: 0.1 },
    },
    {
      name: 'Count',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      data: props.data.map(d => d.count),
      itemStyle: { color: '#67c23a' },
    },
  ],
}))
</script>

<style scoped>
.chart { width: 100%; height: 300px; }
</style>
