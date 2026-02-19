/**
 * 管理后台 API：所有请求自动带 X-Admin-Token（本地存储 admin_token 或环境变量 VITE_ADMIN_TOKEN）
 */
import axios from 'axios'

const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null
  || import.meta.env.VITE_ADMIN_TOKEN || ''

const client = axios.create({
  baseURL: '/api/admin',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Token': token(),
  },
})

client.interceptors.request.use(config => {
  const t = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null
    || import.meta.env.VITE_ADMIN_TOKEN || ''
  config.headers['X-Admin-Token'] = t
  return config
})

client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location?.pathname || ''
      if (path !== '/login') {
        window.localStorage?.removeItem('admin_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const api = {
  getStats: () => client.get('/stats').then(r => r.data),
  getCoreData: (params) => client.get('/core-data', { params }).then(r => r.data),
  getTeacherApplies: (params) => client.get('/teacher-applies', { params }).then(r => r.data),
  approveTeacher: (id) => client.post(`/teacher-applies/${id}/approve`).then(r => r.data),
  rejectTeacher: (id, remark) => client.post(`/teacher-applies/${id}/reject`, { remark }).then(r => r.data),
  setTeacherConsultPrice: (userId, consultPrice) => client.post(`/teachers/${userId}/consult-price`, { consultPrice }).then(r => r.data),
  getPosts: (params) => client.get('/posts', { params }).then(r => r.data),
  setPostStatus: (id, status) => client.post(`/posts/${id}/status`, { status }).then(r => r.data),
  getReports: (params) => client.get('/reports', { params }).then(r => r.data),
  handleReport: (id, body) => client.post(`/reports/${id}/handle`, body).then(r => r.data),
  getWithdraws: (params) => client.get('/withdraws', { params }).then(r => r.data),
  approveWithdraw: (id) => client.post(`/withdraws/${id}/approve`).then(r => r.data),
  rejectWithdraw: (id, remark) => client.post(`/withdraws/${id}/reject`, { remark }).then(r => r.data),
  getUsers: (params) => client.get('/users', { params }).then(r => r.data),
  setUserStatus: (id, status) => client.post(`/users/${id}/status`, { status }).then(r => r.data),
  deleteUser: (id) => client.post(`/users/${id}/delete`).then(r => r.data),
  getAiPrompts: () => client.get('/ai-prompts').then(r => r.data),
  getAiPrompt: (key) => client.get(`/ai-prompts/${key}`).then(r => r.data),
  updateAiPrompt: (key, body) => client.put(`/ai-prompts/${key}/update`, body).then(r => r.data),
}
