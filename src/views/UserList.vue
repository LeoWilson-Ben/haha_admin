<template>
  <div>
    <h2>用户管理</h2>
    <p class="hint">用户列表、搜索、禁用/启用（禁用后该用户无法登录）</p>
    <div class="toolbar">
      <input v-model="keyword" placeholder="搜索手机号/昵称" @keyup.enter="load" />
      <button @click="load">搜索</button>
    </div>
    <table class="table">
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
.hint { color: #718096; margin-bottom: 16px; }
.toolbar { margin-bottom: 16px; display: flex; gap: 8px; }
.toolbar input { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 200px; }
.toolbar button { padding: 8px 16px; background: #E53E3E; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f7fafc; color: #4a5568; font-weight: 600; }
.btn-ok { padding: 4px 10px; background: #38a169; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.btn-danger { padding: 4px 10px; background: #c53030; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 6px; }
.btn-delete { padding: 4px 10px; background: #4a5568; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
</style>
