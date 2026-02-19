<template>
  <div class="login-container">
    <div class="login-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="login-card card-common">
      <div class="login-header">
        <div class="brand">
          <div class="logo-box">玄</div>
          <span class="brand-name">玄遇灵枢</span>
        </div>
        <h1>管理后台登录</h1>
        <p>请输入管理员密钥以访问系统</p>
      </div>

      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label>管理端密钥</label>
          <div class="input-wrapper">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input
              v-model="token"
              type="password"
              placeholder="请输入 ADMIN_API_KEY"
              required
            />
          </div>
        </div>

        <div v-if="error" class="error-msg">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ error }}
        </div>

        <button type="submit" class="btn-login-submit" :disabled="loading">
          <span v-if="!loading">立即登录</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </form>

      <div class="login-footer">
        <p>© 2024 玄遇灵枢 · 数字化命理管理中心</p>
      </div>
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
    error.value = '请填写管理密钥'
    return
  }
  error.value = ''
  loading.value = true
  try {
    localStorage.setItem('admin_token', t)
    await api.getStats()
    router.replace('/')
  } catch (e) {
    localStorage.removeItem('admin_token')
    if (e.response?.status === 401) {
      error.value = '认证密钥无效，请重新输入'
    } else {
      error.value = '连接服务器失败，请检查网络'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F8FAFC;
  position: relative;
  overflow: hidden;
}

.login-decoration .circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(185, 28, 28, 0.05);
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(185, 28, 28, 0.03);
  bottom: -50px;
  left: -50px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 48px;
  background: white;
  z-index: 1;
  position: relative;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1E293B;
  letter-spacing: 1px;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748B;
  font-size: 0.875rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper svg {
  position: absolute;
  left: 14px;
  color: #94A3B8;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #F8FAFC;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 4px var(--primary-light);
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--danger);
  font-size: 0.8125rem;
  font-weight: 500;
  background: #FEF2F2;
  padding: 10px 14px;
  border-radius: 8px;
}

.btn-login-submit {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.btn-login-submit:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(185, 28, 28, 0.2);
}

.btn-login-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  margin-top: 40px;
  text-align: center;
}

.login-footer p {
  font-size: 0.75rem;
  color: #94A3B8;
}
</style>
