<template>
  <div>
    <h2 class="page-title">用户管理</h2>
    <p class="page-hint">用户列表、搜索、禁用/启用（禁用后该用户无法登录）</p>
    <div class="toolbar">
      <input v-model="keyword" placeholder="搜索手机号/昵称" @keyup.enter="load" />
      <button class="btn-primary" @click="load">搜索</button>
    </div>
    <div class="table-wrap card-common">
    <table class="table table-common">
      <thead>
        <tr>
          <th>ID</th>
          <th>手机号</th>
          <th>昵称</th>
          <th>状态</th>
          <th>注册时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td colspan="6">加载中...</td></tr>
        <tr v-else-if="!list.length"><td colspan="6">暂无数据</td></tr>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.mobile }}</td>
          <td>{{ item.nickname }}</td>
          <td>{{ item.status === 1 ? '正常' : '已禁用' }}</td>
          <td>{{ item.createdAt ? item.createdAt.slice(0, 19) : '-' }}</td>
          <td>
            <template v-if="item.status === 1">
              <button class="btn-danger" @click="setStatus(item.id, 0)">禁用</button>
            </template>
            <template v-else>
              <button class="btn-ok" @click="setStatus(item.id, 1)">启用</button>
            </template>
            <button class="btn-delete" @click="deleteUser(item)">删除</button>
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
  if (!confirm(`确认${action}该用户？`)) return
  try {
    await api.setUserStatus(id, status)
    alert('操作成功')
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

async function deleteUser(item) {
  if (!confirm(`确认删除用户「${item.nickname}」？删除后将清空手机号等敏感信息，不可恢复。`)) return
  try {
    await api.deleteUser(item.id)
    alert('已删除')
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

onMounted(load)
</script>

<style scoped>
.toolbar { margin-bottom: 18px; display: flex; gap: 10px; align-items: center; }
.toolbar input { padding: 8px 12px; border: 1px solid var(--card-border); border-radius: var(--radius-sm); width: 200px; font-size: 0.9375rem; }
.table-wrap { overflow-x: auto; border-radius: var(--radius); }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--card-border); }
.table th { background: #fafafa; color: var(--text-muted); font-weight: 500; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; }
.table tbody tr:hover { background: #fafafa; }
.btn-ok { padding: 6px 12px; background: var(--success); color: #fff; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.875rem; }
.btn-danger { padding: 6px 12px; background: var(--danger); color: #fff; border: none; border-radius: var(--radius-sm); cursor: pointer; margin-right: 6px; font-size: 0.875rem; }
.btn-delete { padding: 6px 12px; background: var(--text-muted); color: #fff; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.875rem; }
</style>
