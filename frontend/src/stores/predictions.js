import { defineStore } from 'pinia'
import { ref } from 'vue'
import { predictionsApi } from '../api/predictions'

export const usePredictionsStore = defineStore('predictions', () => {
  const items = ref([])
  const loading = ref(false)

  async function fetchAll(userId) {
    loading.value = true
    try {
      const res = await predictionsApi.list(userId)
      items.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function score(behaviorId) {
    const res = await predictionsApi.score(behaviorId)
    items.value.unshift(res.data)
    return res.data
  }

  return { items, loading, fetchAll, score }
})
