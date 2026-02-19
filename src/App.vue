<template>
  <div class="app-root">
    <template v-if="isLoginPage">
      <router-view />
    </template>
    <template v-else>
      <aside class="sidebar">
        <div class="logo-wrap">
          <span class="logo-text">玄遇</span>
          <span class="logo-sub">管理后台</span>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-item">
            <span class="nav-icon" v-html="icons.dashboard"></span>
            <span>核心数据看板</span>
          </router-link>
          <router-link to="/users" class="nav-item">
            <span class="nav-icon" v-html="icons.users"></span>
            <span>用户管理</span>
          </router-link>
          <router-link to="/teacher" class="nav-item">
            <span class="nav-icon" v-html="icons.teacher"></span>
            <span>名师认证审核</span>
          </router-link>
          <router-link to="/content" class="nav-item">
            <span class="nav-icon" v-html="icons.content"></span>
            <span>内容审核</span>
          </router-link>
          <router-link to="/orders" class="nav-item">
            <span class="nav-icon" v-html="icons.orders"></span>
            <span>订单与财务</span>
          </router-link>
          <router-link to="/report" class="nav-item">
            <span class="nav-icon" v-html="icons.report"></span>
            <span>举报与风控</span>
          </router-link>
          <router-link to="/ai-prompts" class="nav-item">
            <span class="nav-icon" v-html="icons.ai"></span>
            <span>AI 提示词</span>
          </router-link>
          <router-link to="/config" class="nav-item">
            <span class="nav-icon" v-html="icons.config"></span>
            <span>系统配置</span>
          </router-link>
        </nav>
        <div class="sidebar-footer">
          <button type="button" class="btn-logout" @click="logout">
            <span class="nav-icon" v-html="icons.logout"></span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>
      <main class="main">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path === '/login')

const icons = {
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  teacher: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/><path d="M12 13v6"/><path d="M9 16h6"/></svg>',
  content: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  orders: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  report: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
  ai: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  config: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
}

function logout() {
  if (typeof localStorage !== 'undefined') localStorage.removeItem('admin_token')
  router.push('/login')
}
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background: var(--page-bg);
}
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.logo-wrap {
  padding: 24px 20px;
  border-bottom: 1px solid var(--card-border);
}
.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
}
.logo-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: 6px;
  font-weight: 400;
}
.nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: background 0.12s, color 0.12s;
}
.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text);
}
.nav-item.router-link-active {
  background: rgba(16, 163, 127, 0.08);
  color: var(--accent);
  font-weight: 500;
}
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
  opacity: 0.9;
}
.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid var(--card-border);
}
.btn-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.btn-logout:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text);
}
.main {
  margin-left: 260px;
  min-height: 100vh;
  padding: 32px 40px;
  max-width: 1200px;
}
</style>
