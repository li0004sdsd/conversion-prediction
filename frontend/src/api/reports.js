import http from './http'

export const reportsApi = {
  summary() {
    return http.get('/reports/summary')
  },
  segments() {
    return http.get('/reports/segments')
  },
  trend() {
    return http.get('/reports/trend')
  },
}
