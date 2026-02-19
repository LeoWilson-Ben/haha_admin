<template>
  <div>
    <h2 class="page-title">系统配置</h2>
    <p class="page-hint">管理端 API 鉴权：请求头 X-Admin-Token 需与后端 ADMIN_API_KEY 一致</p>
    <div class="form card-common">
      <div class="row">
        <label>管理端密钥 (X-Admin-Token)</label>
        <input v-model="adminToken" type="password" placeholder="与服务器 ADMIN_API_KEY 一致" />
        <span class="muted">保存到本地，仅本机使用。生产环境请设置环境变量 ADMIN_API_KEY</span>
      </div>
      <button class="btn-primary" @click="save">保存</button>
      <span v-if="saved" class="saved">已保存</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const adminToken = ref('')
const saved = ref(false)

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    adminToken.value = localStorage.getItem('admin_token') || ''
  }
})

function save() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('admin_token', adminToken.value)
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  }
}
</script>

<style scoped>
.form { max-width: 480px; padding: 28px; }
.row { margin-bottom: 18px; }
.row label { display: block; margin-bottom: 8px; color: var(--text); font-weight: 500; font-size: 0.9375rem; }
.row input { width: 100%; padding: 10px 14px; border: 1px solid var(--card-border); border-radius: var(--radius-sm); font-size: 0.9375rem; }
.row input:focus { outline: none; border-color: var(--accent); }
.muted { color: var(--text-muted); font-size: 0.875rem; display: block; margin-top: 8px; }
.btn-primary { margin-top: 8px; margin-right: 12px; }
.saved { color: var(--success); font-size: 0.875rem; }
</style>
