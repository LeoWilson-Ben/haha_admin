<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo-container">
        <div class="logo-icon">玄</div>
        <h1 class="logo-text">玄遇管理后台</h1>
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>数据看板</span>
        </router-link>
        <router-link to="/users" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>用户管理</span>
        </router-link>
        <router-link to="/teacher" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          <span>名师审核</span>
        </router-link>
        <router-link to="/content" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>内容审核</span>
        </router-link>
        <router-link to="/orders" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>财务管理</span>
        </router-link>
        <router-link to="/report" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>举报风控</span>
        </router-link>
        <div class="nav-divider"></div>
        <router-link to="/ai-prompts" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span>AI 提示词</span>
        </router-link>
        <router-link to="/config" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>系统配置</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <p>© 2024 玄遇灵枢</p>
      </div>
    </aside>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
:root {
  --primary: #B91C1C;
  --primary-hover: #991B1B;
  --bg-main: #F8FAFC;
  --bg-sidebar: #0F172A;
  --text-main: #1E293B;
  --text-muted: #64748B;
  --text-light: #94A3B8;
  --accent: #B91C1C;
  --accent-light: #FEE2E2;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --card-bg: #FFFFFF;
  --card-border: #E2E8F0;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.5;
}

.app-layout { display: flex; min-height: 100vh; }

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: var(--bg-sidebar);
  color: #fff;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo-container {
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background-color: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
}

.nav-menu {
  flex: 1;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-light);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.router-link-active {
  background-color: var(--primary);
  color: #fff;
}

.nav-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 16px 16px;
}

.sidebar-footer {
  padding: 24px;
  font-size: 0.75rem;
  color: var(--text-light);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
}

h2.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}

p.page-hint {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

/* Common UI Elements */
.btn-primary {
  background-color: var(--primary);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.card-common {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
