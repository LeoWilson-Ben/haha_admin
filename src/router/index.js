import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import UserList from '../views/UserList.vue'
import TeacherAudit from '../views/TeacherAudit.vue'
import ContentList from '../views/ContentList.vue'
import OrderList from '../views/OrderList.vue'
import ReportList from '../views/ReportList.vue'
import Config from '../views/Config.vue'
import AiPrompts from '../views/AiPrompts.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard, meta: { title: '核心数据看板' } },
    { path: '/users', component: UserList, meta: { title: '用户管理' } },
    { path: '/teacher', component: TeacherAudit, meta: { title: '名师认证审核' } },
    { path: '/content', component: ContentList, meta: { title: '内容审核' } },
    { path: '/orders', component: OrderList, meta: { title: '订单与财务' } },
    { path: '/report', component: ReportList, meta: { title: '举报与风控' } },
    { path: '/ai-prompts', component: AiPrompts, meta: { title: 'AI 提示词' } },
    { path: '/config', component: Config, meta: { title: '系统配置' } },
  ],
})
