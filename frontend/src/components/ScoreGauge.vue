<template>
  <v-chart class="gauge-chart" :option="option" autoresize />
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

use([GaugeChart, CanvasRenderer])

const props = defineProps({
  score: { type: Number, default: 0 },
  title: { type: String, default: 'Score' },
})

const option = computed(() => ({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 1,
    splitNumber: 5,
    radius: '90%',
    axisLine: {
      lineStyle: {
        width: 20,
        color: [[0.4, '#f56c6c'], [0.7, '#e6a23c'], [1, '#67c23a']],
      },
    },
    pointer: { itemStyle: { color: 'auto' } },
    axisTick: { distance: -25, length: 6, lineStyle: { color: '#fff', width: 1 } },
    splitLine: { distance: -30, length: 15, lineStyle: { color: '#fff', width: 2 } },
    axisLabel: { color: 'inherit', distance: 28, fontSize: 11 },
    detail: {
      valueAnimation: true,
      formatter: (v) => `${(v * 100).toFixed(1)}%`,
      color: 'inherit',
      fontSize: 20,
      fontWeight: 700,
    },
    data: [{ value: props.score, name: props.title }],
  }],
}))
</script>

<style scoped>
.gauge-chart { width: 100%; height: 200px; }
</style>
