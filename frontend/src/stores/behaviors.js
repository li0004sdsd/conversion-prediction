import { defineStore } from 'pinia'
import { ref } from 'vue'
import { behaviorsApi } from '../api/behaviors'

export const useBehaviorsStore = defineStore('behaviors', () => {
  const items = ref([])
  const loading = ref(false)

  async function fetchAll(userId) {
    loading.value = true
    try {
      const res = await behaviorsApi.list(userId)
      items.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const res = await behaviorsApi.create(data)
    items.value.unshift(res.data)
    return res.data
  }

  async function update(id, data) {
    const res = await behaviorsApi.update(id, data)
    const idx = items.value.findIndex((b) => b.id === id)
    if (idx !== -1) items.value[idx] = res.data
    return res.data
  }

  async function remove(id) {
    await behaviorsApi.remove(id)
    items.value = items.value.filter((b) => b.id !== id)
  }

  return { items, loading, fetchAll, create, update, remove }
})
