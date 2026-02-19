<template>
  <div class="app-container">
    <header class="top-nav" v-if="!isLoginPage">
      <div class="nav-content">
        <div class="logo-area">
          <div class="logo-icon">玄</div>
          <span class="logo-text">玄遇</span>
        </div>

        <nav class="nav-links">
          <router-link to="/" class="nav-item">数据看板</router-link>
          <router-link to="/users" class="nav-item">用户管理</router-link>
          <router-link to="/teacher" class="nav-item">名师审核</router-link>
          <router-link to="/content" class="nav-item">内容审核</router-link>
          <router-link to="/orders" class="nav-item">财务管理</router-link>
          <router-link to="/report" class="nav-item">举报风控</router-link>
          <div class="nav-divider"></div>
          <router-link to="/ai-prompts" class="nav-item">AI提示词</router-link>
          <router-link to="/config" class="nav-item">系统配置</router-link>
        </nav>

        <div class="user-action">
          <button class="btn-logout" @click="logout">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            退出
          </button>
        </div>
      </div>
    </header>

    <main class="main-body" :class="{ 'no-nav': isLoginPage }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path === '/login')

function logout() {
  if (confirm('确定退出登录吗？')) {
    localStorage.removeItem('admin_token')
    router.replace('/login')
  }
}
</script>

<style>
:root {
  --primary: #B91C1C;
  --primary-light: #FEE2E2;
  --bg-body: #F8FAFC;
  --bg-nav: #FFFFFF;
  --text-main: #334155;
  --text-muted: #64748B;
  --nav-height: 64px;
  --card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --radius: 12px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Top Nav Styles - Centered */
.top-nav {
  height: var(--nav-height);
  background-color: var(--bg-nav);
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center; /* Center everything */
  padding: 0 24px;
  gap: 32px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1E293B;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: #F8FAFC;
  color: var(--text-main);
}

.nav-item.router-link-active {
  color: var(--primary);
  background-color: var(--primary-light);
}

.nav-divider {
  width: 1px;
  height: 20px;
  background-color: #E2E8F0;
  margin: 0 12px;
}

.user-action {
  display: flex;
  align-items: center;
}

.btn-logout {
  background: transparent;
  border: 1px solid #E2E8F0;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.btn-logout:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Main Body */
.main-body {
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px;
}

.main-body.no-nav {
  max-width: none;
  padding: 0;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Global Component Overrides for Light Theme */
.card-common {
  background: white;
  border: 1px solid #E2E8F0;
  box-shadow: var(--card-shadow);
}

h2.page-title {
  color: #1E293B;
}
</style>
