<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <p class="page-hint">查看、搜索、管理平台所有注册用户及其账号状态</p>
    </div>

    <div class="toolbar-card card-common">
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input v-model="keyword" placeholder="搜索手机号或用户昵称..." @keyup.enter="load" />
      </div>
      <button class="btn-primary" @click="load" :disabled="loading">
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>

    <div class="table-container card-common">
      <table class="modern-table">
        <thead>
          <tr>
            <th>用户 ID</th>
            <th>手机号码</th>
            <th>昵称</th>
            <th>当前状态</th>
            <th>注册时间</th>
            <th class="actions-col">管理操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="status-cell">正在载入用户数据...</td>
          </tr>
          <tr v-else-if="!list.length">
            <td colspan="6" class="status-cell">未找到匹配的用户数据</td>
          </tr>
          <tr v-for="item in list" :key="item.id">
            <td class="id-col">#{{ item.id }}</td>
            <td class="mobile-col">{{ item.mobile }}</td>
            <td class="nickname-col">
              <div class="user-avatar-mini">{{ (item.nickname || '?')[0] }}</div>
              <span>{{ item.nickname }}</span>
            </td>
            <td>
              <span :class="['status-tag', item.status === 1 ? 'active' : 'blocked']">
                {{ item.status === 1 ? '正常' : '已禁用' }}
              </span>
            </td>
            <td class="date-col">{{ item.createdAt ? item.createdAt.slice(0, 16).replace('T', ' ') : '-' }}</td>
            <td class="actions-col">
              <div class="action-buttons">
                <button v-if="item.status === 1" class="btn-action danger" @click="setStatus(item.id, 0)">
                  禁用账号
                </button>
                <button v-else class="btn-action success" @click="setStatus(item.id, 1)">
                  解除禁用
                </button>
                <button class="btn-action gray" @click="deleteUser(item)">
                  注销
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const keyword = ref('')
const list = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await api.getUsers({ keyword: keyword.value })
    list.value = (res.data && res.data.list) ? res.data.list : []
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

async function setStatus(id, status) {
  const action = status === 0 ? '禁用' : '启用'
  if (!confirm(`确定要${action}该用户账号吗？`)) return
  try {
    await api.setUserStatus(id, status)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

async function deleteUser(item) {
  if (!confirm(`⚠️ 警告：确认注销用户「${item.nickname}」吗？\n注销后将清空所有隐私信息，此操作不可逆！`)) return
  try {
    await api.deleteUser(item.id)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

onMounted(load)
</script>

<style scoped>
.toolbar-card {
  padding: 16px 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
  background: var(--bg-main);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--primary);
}

.search-box svg {
  color: var(--text-muted);
  margin-right: 8px;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 0;
  outline: none;
  font-size: 0.9375rem;
}

.table-container {
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  background-color: #F8FAFC;
  padding: 16px 24px;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--card-border);
}

.modern-table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--card-border);
  font-size: 0.9375rem;
}

.status-cell {
  text-align: center;
  padding: 48px;
  color: var(--text-muted);
}

.id-col { color: var(--text-muted); font-family: monospace; }
.mobile-col { font-weight: 500; }
.nickname-col { display: flex; align-items: center; gap: 10px; }

.user-avatar-mini {
  width: 28px;
  height: 28px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-tag.active { background: #DCFCE7; color: #166534; }
.status-tag.blocked { background: #FEE2E2; color: #991B1B; }

.date-col { color: var(--text-muted); font-size: 0.875rem; }

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 6px 12px;
  border: 1px solid var(--card-border);
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
}

.btn-action.danger { color: var(--danger); }
.btn-action.danger:hover { background: var(--danger); color: #fff; border-color: var(--danger); }
.btn-action.success { color: var(--success); }
.btn-action.success:hover { background: var(--success); color: #fff; border-color: var(--success); }
.btn-action.gray:hover { background: var(--bg-main); }

.actions-col { width: 220px; }
</style>
