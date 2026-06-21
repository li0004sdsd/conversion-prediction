import http from './http'

export const predictionsApi = {
  score(behaviorId) {
    return http.post(`/predictions/score/${behaviorId}`)
  },
  batchScore(behaviorIds) {
    return http.post('/predictions/batch-score', { behavior_ids: behaviorIds })
  },
  list(userId) {
    return http.get('/predictions', { params: userId ? { user_id: userId } : {} })
  },
  get(id) {
    return http.get(`/predictions/${id}`)
  },
}
