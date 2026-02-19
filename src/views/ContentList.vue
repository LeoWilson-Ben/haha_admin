<template>
  <div>
    <h2 class="page-title">内容审核</h2>
    <p class="page-hint">社区帖子列表，可下架违规内容（status=0 后前端不展示）</p>
    <div class="toolbar">
      <select v-model="statusFilter" @change="load">
        <option :value="1">正常</option>
        <option :value="0">已下架</option>
      </select>
      <input v-model="keyword" placeholder="搜索内容" @keyup.enter="load" />
      <button class="btn-primary" @click="load">搜索</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>作者</th>
          <th>内容摘要</th>
          <th>类型</th>
          <th>点赞/评论</th>
          <th>发布时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td colspan="7">加载中...</td></tr>
        <tr v-else-if="!list.length"><td colspan="7">暂无数据</td></tr>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.nickname }}</td>
          <td>{{ item.content || '-' }}</td>
          <td>{{ item.mediaType === 'video' ? '视频' : '图文' }}</td>
          <td>{{ item.likeCount }} / {{ item.commentCount }}</td>
          <td>{{ item.createdAt ? item.createdAt.slice(0, 19) : '-' }}</td>
          <td>
            <template v-if="item.status === 1">
              <button class="btn-danger" @click="setStatus(item.id, 0)">下架</button>
            </template>
            <template v-else>
              <button class="btn-ok" @click="setStatus(item.id, 1)">恢复</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const statusFilter = ref(1)
const keyword = ref('')
const list = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await api.getPosts({ status: statusFilter.value, keyword: keyword.value })
    list.value = (res.data && res.data.list) ? res.data.list : []
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

async function setStatus(id, status) {
  const action = status === 0 ? '下架' : '恢复'
  if (!confirm(`确认${action}该帖子？`)) return
  try {
    await api.setPostStatus(id, status)
    alert('操作成功')
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
.toolbar input { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 200px; }
.toolbar button.btn-primary { padding: 8px 16px; }
.table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f7fafc; color: #4a5568; font-weight: 600; }
.btn-ok { padding: 4px 10px; background: #38a169; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.btn-danger { padding: 4px 10px; background: #c53030; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
</style>
