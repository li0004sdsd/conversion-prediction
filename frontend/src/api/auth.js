import http from './http'

export const authApi = {
  register(data) {
    return http.post('/auth/register', data)
  },
  login(username, password) {
    const form = new FormData()
    form.append('username', username)
    form.append('password', password)
    return http.post('/auth/login', form)
  },
  me() {
    return http.get('/auth/me')
  },
}
