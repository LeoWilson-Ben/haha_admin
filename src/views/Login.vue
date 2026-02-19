<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-wrap">
        <span class="logo-icon">玄遇</span>
        <h1 class="title">管理后台</h1>
        <p class="subtitle">请输入管理端密钥登录</p>
      </div>
      <form @submit.prevent="submit" class="form">
        <div class="field">
          <label for="token">管理端密钥</label>
          <input
            id="token"
            v-model="token"
            type="password"
            autocomplete="current-password"
            placeholder="与服务器 ADMIN_API_KEY 一致"
          />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '验证中…' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const router = useRouter()
const token = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  const t = (token.value || '').trim()
  if (!t) {
    error.value = '请输入管理端密钥'
    return
  }
  error.value = ''
  loading.value = true
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('admin_token', t)
    }
    await api.getStats()
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('admin_token', t)
    }
    router.replace('/')
  } catch (e) {
    if (e.response?.status === 401) {
      error.value = '密钥错误，请检查后重试'
    } else {
      error.value = e.response?.data?.message || e.message || '验证失败，请重试'
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
  }
  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdfa 100%);
}
.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
  padding: 40px;
}
.logo-wrap {
  text-align: center;
  margin-bottom: 32px;
}
.logo-icon {
  display: inline-block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0ea5e9;
  letter-spacing: 0.05em;
}
.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 8px 0 4px;
}
.subtitle {
  font-size: 0.875rem;
  color: #64748b;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}
.error {
  font-size: 0.875rem;
  color: #dc2626;
  margin: 0;
}
.btn-login {
  padding: 12px 20px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.05s;
}
.btn-login:hover:not(:disabled) {
  opacity: 0.95;
}
.btn-login:active:not(:disabled) {
  transform: scale(0.99);
}
.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
