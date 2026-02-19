<template>
  <div class="layout">
    <aside class="sidebar">
      <h1 class="logo">灵枢后台</h1>
      <nav>
        <router-link to="/">核心数据看板</router-link>
        <router-link to="/users">用户管理</router-link>
        <router-link to="/teacher">名师认证审核</router-link>
        <router-link to="/content">内容审核</router-link>
        <router-link to="/orders">订单与财务</router-link>
        <router-link to="/report">举报与风控</router-link>
        <router-link to="/ai-prompts">AI 提示词</router-link>
        <router-link to="/config">系统配置</router-link>
      </nav>
    </aside>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.sidebar { width: 220px; background: #1a202c; color: #fff; padding: 20px; }
.sidebar .logo { font-size: 1.25rem; margin-bottom: 24px; color: #E53E3E; }
.sidebar nav { display: flex; flex-direction: column; gap: 4px; }
.sidebar nav a { color: #a0aec0; text-decoration: none; padding: 10px 12px; border-radius: 6px; }
.sidebar nav a:hover { background: #2d3748; color: #fff; }
.sidebar nav a.router-link-active { background: #E53E3E; color: #fff; }
.main { flex: 1; padding: 24px; background: #f7fafc; }
</style>
