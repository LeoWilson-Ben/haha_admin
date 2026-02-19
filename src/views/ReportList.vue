<template>
  <div>
    <h2>举报与风控</h2>
    <p class="hint">用户举报列表，处理后可填写处理结果</p>
    <div class="toolbar">
      <select v-model="statusFilter" @change="load">
        <option value="pending">待处理</option>
        <option value="handled">已处理</option>
      </select>
      <button @click="load">刷新</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>举报人</th>
          <th>对象类型</th>
          <th>对象ID</th>
          <th>原因</th>
          <th>状态</th>
          <th>处理结果</th>
          <th>举报时间</th>
          <th v-if="statusFilter === 'pending'">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td :colspan="statusFilter === 'pending' ? 10 : 9">加载中...</td></tr>
        <tr v-else-if="!list.length"><td :colspan="statusFilter === 'pending' ? 10 : 9">暂无数据</td></tr>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.reporterNickname }}</td>
          <td>{{ item.targetType }}</td>
          <td>{{ item.targetId }}</td>
          <td>{{ item.reason || '-' }}</td>
          <td>{{ item.status === 'handled' ? '已处理' : '待处理' }}</td>
          <td>{{ item.handleResult || '-' }}</td>
          <td>{{ item.createdAt ? item.createdAt.slice(0, 19) : '-' }}</td>
          <td v-if="statusFilter === 'pending'">
            <input v-model="item._result" placeholder="处理结果" class="input-inline" />
            <label class="checkbox"><input type="checkbox" v-model="item._punishPost" /> 下架帖子</label>
            <label class="checkbox"><input type="checkbox" v-model="item._punishUser" /> 禁用用户</label>
            <button class="btn-ok" @click="handle(item)">标记已处理</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const statusFilter = ref('pending')
const list = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await api.getReports({ status: statusFilter.value })
    const rows = (res.data && res.data.list) ? res.data.list : []
    rows.forEach(r => { r._result = r.handleResult || ''; r._punishPost = false; r._punishUser = false })
    list.value = rows
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

async function handle(item) {
  try {
    await api.handleReport(item.id, {
      handleResult: item._result || '',
      punishPost: !!item._punishPost,
      punishUser: !!item._punishUser,
    })
    alert('已处理')
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

onMounted(load)
</script>

<style scoped>
.hint { color: #718096; margin-bottom: 16px; }
.toolbar { margin-bottom: 16px; display: flex; gap: 8px; align-items: center; }
.toolbar select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; }
.toolbar button { padding: 8px 16px; background: #E53E3E; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f7fafc; color: #4a5568; font-weight: 600; }
.input-inline { padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px; width: 120px; margin-right: 8px; }
.checkbox { margin-right: 12px; font-size: 0.875rem; color: #4a5568; }
.btn-ok { padding: 4px 10px; background: #38a169; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
</style>
