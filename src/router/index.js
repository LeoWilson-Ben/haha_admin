import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import UserList from '../views/UserList.vue'
import TeacherAudit from '../views/TeacherAudit.vue'
import ContentList from '../views/ContentList.vue'
import OrderList from '../views/OrderList.vue'
import ReportList from '../views/ReportList.vue'
import AnnouncementList from '../views/AnnouncementList.vue'
import Config from '../views/Config.vue'
import AiPrompts from '../views/AiPrompts.vue'
import Login from '../views/Login.vue'

function hasToken() {
  if (typeof localStorage === 'undefined') return !!import.meta.env.VITE_ADMIN_TOKEN
  return !!(localStorage.getItem('admin_token') || import.meta.env.VITE_ADMIN_TOKEN)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, meta: { title: '登录', public: true } },
    { path: '/', component: Dashboard, meta: { title: '核心数据看板' } },
    { path: '/users', component: UserList, meta: { title: '用户管理' } },
    { path: '/teacher', component: TeacherAudit, meta: { title: '名师认证审核' } },
    { path: '/content', component: ContentList, meta: { title: '内容审核' } },
    { path: '/orders', component: OrderList, meta: { title: '订单与财务' } },
    { path: '/report', component: ReportList, meta: { title: '举报与风控' } },
    { path: '/announcements', component: AnnouncementList, meta: { title: '平台公告' } },
    { path: '/ai-prompts', component: AiPrompts, meta: { title: 'AI 提示词' } },
    { path: '/config', component: Config, meta: { title: '系统配置' } },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.public) {
    if (hasToken() && to.path === '/login') return next('/')
    return next()
  }
  if (!hasToken()) return next('/login')
  next()
})

export default router
