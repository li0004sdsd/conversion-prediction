import http from './http'

export const behaviorsApi = {
  list(userId) {
    return http.get('/behaviors', { params: userId ? { user_id: userId } : {} })
  },
  get(id) {
    return http.get(`/behaviors/${id}`)
  },
  create(data) {
    return http.post('/behaviors', data)
  },
  update(id, data) {
    return http.put(`/behaviors/${id}`, data)
  },
  remove(id) {
    return http.delete(`/behaviors/${id}`)
  },
}
