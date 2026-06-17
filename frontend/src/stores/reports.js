import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportsApi } from '../api/reports'

export const useReportsStore = defineStore('reports', () => {
  const summary = ref(null)
  const segments = ref([])
  const trend = ref([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const [s, seg, t] = await Promise.all([
        reportsApi.summary(),
        reportsApi.segments(),
        reportsApi.trend(),
      ])
      summary.value = s.data
      segments.value = seg.data
      trend.value = t.data
    } finally {
      loading.value = false
    }
  }

  return { summary, segments, trend, loading, fetchAll }
})
