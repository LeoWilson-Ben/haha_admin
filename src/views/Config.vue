<template>
  <div>
    <h2>系统配置</h2>
    <p class="hint">管理端 API 鉴权：请求头 X-Admin-Token 需与后端 ADMIN_API_KEY 一致</p>
    <div class="form">
      <div class="row">
        <label>管理端密钥 (X-Admin-Token)</label>
        <input v-model="adminToken" type="password" placeholder="与服务器 ADMIN_API_KEY 一致" />
        <span class="muted">保存到本地，仅本机使用。生产环境请设置环境变量 ADMIN_API_KEY</span>
      </div>
      <button class="primary" @click="save">保存</button>
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
.hint { color: #718096; margin-bottom: 16px; }
.form { max-width: 480px; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.row { margin-bottom: 16px; }
.row label { display: block; margin-bottom: 6px; color: #4a5568; font-weight: 500; }
.row input { width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; }
.muted { color: #a0aec0; font-size: 0.875rem; display: block; margin-top: 6px; }
.primary { margin-top: 8px; padding: 10px 20px; background: #E53E3E; color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px; }
.saved { color: #38a169; font-size: 0.875rem; }
</style>
