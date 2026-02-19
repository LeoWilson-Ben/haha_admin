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
  background: #ffffff;
}
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 0;
}
.logo-wrap {
  text-align: left;
  margin-bottom: 32px;
}
.logo-icon {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0d0d0d;
  letter-spacing: -0.02em;
}
.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0d0d0d;
  margin: 12px 0 4px;
  letter-spacing: -0.02em;
}
.subtitle {
  font-size: 0.875rem;
  color: #6e6e80;
  margin: 0;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.field label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #0d0d0d;
  margin-bottom: 8px;
}
.field input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9375rem;
  background: #fff;
  transition: border-color 0.15s;
}
.field input:focus {
  outline: none;
  border-color: #10a37f;
}
.field input::placeholder {
  color: #8e8ea0;
}
.error {
  font-size: 0.8125rem;
  color: #c53030;
  margin: 0;
}
.btn-login {
  padding: 12px 20px;
  background: #10a37f;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-login:hover:not(:disabled) {
  background: #0d8c6d;
}
.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
