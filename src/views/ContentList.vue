<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">内容审核</h2>
      <p class="page-hint">管理社区帖子，下架违规或不当内容以维护社区氛围</p>
    </div>

    <div class="toolbar-card card-common">
      <div class="filter-group">
        <label>状态筛选</label>
        <div class="status-tabs">
          <button :class="['status-tab', { active: statusFilter === 1 }]" @click="statusFilter = 1; load()">正常展示</button>
          <button :class="['status-tab', { active: statusFilter === 0 }]" @click="statusFilter = 0; load()">已下架</button>
        </div>
      </div>
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input v-model="keyword" placeholder="搜索帖子关键字、作者..." @keyup.enter="load" />
      </div>
      <button class="btn-primary" @click="load">搜索</button>
    </div>

    <div class="content-grid">
      <div v-if="loading" class="loading-full">正在检索内容...</div>
      <div v-else-if="!list.length" class="empty-full">暂无符合条件的内容</div>

      <div v-for="item in list" :key="item.id" class="content-card card-common">
        <div class="post-header">
          <div class="author">
            <div class="author-avatar">{{ (item.nickname || '?')[0] }}</div>
            <div class="author-info">
              <span class="name">{{ item.nickname }}</span>
              <span class="time">{{ item.createdAt?.replace('T', ' ').slice(0, 16) }}</span>
            </div>
          </div>
          <div :class="['type-tag', item.mediaType]">
            {{ item.mediaType === 'video' ? '视频' : '图文' }}
          </div>
        </div>

        <div class="post-body">
          <p class="post-content">{{ item.content || '（无文字内容）' }}</p>
          <div v-if="item.images && item.images.length" class="post-images">
             <img v-for="(img, idx) in item.images.slice(0, 3)" :key="idx" :src="img" class="thumb" />
             <div v-if="item.images.length > 3" class="more-imgs">+{{ item.images.length - 3 }}</div>
          </div>
        </div>

        <div class="post-footer">
          <div class="stats">
            <span title="点赞"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> {{ item.likeCount }}</span>
            <span title="评论"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> {{ item.commentCount }}</span>
          </div>
          <div class="actions">
            <button v-if="item.status === 1" class="btn-outline-danger" @click="setStatus(item.id, 0)">下架内容</button>
            <button v-else class="btn-outline-success" @click="setStatus(item.id, 1)">恢复上架</button>
          </div>
        </div>
      </div>
    </div>
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
  if (!confirm(`确认要${action}该帖子吗？`)) return
  try {
    await api.setPostStatus(id, status)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

onMounted(load)
</script>

<style scoped>
.toolbar-card { padding: 20px 24px; display: flex; gap: 24px; align-items: center; margin-bottom: 32px; flex-wrap: wrap; }
.filter-group { display: flex; align-items: center; gap: 12px; }
.filter-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); }
.status-tabs { display: flex; background: var(--bg-main); padding: 4px; border-radius: 8px; border: 1px solid var(--card-border); }
.status-tab { border: none; background: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 0.875rem; color: var(--text-muted); transition: all 0.2s; }
.status-tab.active { background: #fff; color: var(--accent); box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 600; }

.search-box { flex: 1; min-width: 260px; display: flex; align-items: center; background: var(--bg-main); border: 1px solid var(--card-border); border-radius: 8px; padding: 0 12px; }
.search-box input { flex: 1; border: none; background: transparent; padding: 10px 0; outline: none; font-size: 0.875rem; }
.search-box svg { color: var(--text-muted); margin-right: 8px; }

.content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
.content-card { padding: 0; display: flex; flex-direction: column; }
.post-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--bg-main); }
.author { display: flex; align-items: center; gap: 10px; }
.author-avatar { width: 32px; height: 32px; background: var(--bg-main); color: var(--text-muted); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.875rem; }
.author-info { display: flex; flex-direction: column; }
.author-info .name { font-size: 0.875rem; font-weight: 600; }
.author-info .time { font-size: 0.75rem; color: var(--text-light); }
.type-tag { font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: #F1F5F9; color: #475569; }
.type-tag.video { background: #FDF2F8; color: #DB2777; }

.post-body { padding: 16px 20px; flex: 1; }
.post-content { font-size: 0.9375rem; line-height: 1.6; color: var(--text-main); margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.post-images { display: flex; gap: 8px; align-items: center; }
.post-images img { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; }
.more-imgs { font-size: 0.75rem; color: var(--text-muted); background: var(--bg-main); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }

.post-footer { padding: 12px 20px; background: #F8FAFC; border-top: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; }
.stats { display: flex; gap: 16px; color: var(--text-muted); font-size: 0.8125rem; }
.stats span { display: flex; align-items: center; gap: 4px; }

.btn-outline-danger { border: 1px solid var(--danger); background: transparent; color: var(--danger); padding: 6px 16px; border-radius: 6px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-outline-danger:hover { background: var(--danger); color: #fff; }
.btn-outline-success { border: 1px solid var(--success); background: transparent; color: var(--success); padding: 6px 16px; border-radius: 6px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-outline-success:hover { background: var(--success); color: #fff; }

.loading-full, .empty-full { grid-column: 1 / -1; padding: 100px; text-align: center; color: var(--text-muted); background: #fff; border-radius: 12px; border: 1px dashed var(--card-border); }
</style>
