<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">平台公告</h2>
      <p class="page-hint">管理 APP 首页「平台公告」入口展示的公告，支持上架/下架与排序</p>
    </div>

    <div class="toolbar-card card-common">
      <div class="filter-group">
        <label>状态</label>
        <div class="status-tabs">
          <button :class="['status-tab', { active: statusFilter === null }]" @click="statusFilter = null; load()">全部</button>
          <button :class="['status-tab', { active: statusFilter === 1 }]" @click="statusFilter = 1; load()">展示中</button>
          <button :class="['status-tab', { active: statusFilter === 0 }]" @click="statusFilter = 0; load()">已下架</button>
        </div>
      </div>
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input v-model="keyword" placeholder="搜索标题" @keyup.enter="load" />
      </div>
      <button class="btn-primary" @click="load">搜索</button>
      <button class="btn-primary" @click="openForm()">新增公告</button>
    </div>

    <div class="table-wrap card-common">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>正文摘要</th>
            <th>状态</th>
            <th>排序</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="9">加载中...</td></tr>
          <tr v-else-if="!list.length"><td colspan="9">暂无公告</td></tr>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td class="title-cell">{{ item.title || '-' }}</td>
            <td class="content-cell">{{ (item.content || '').slice(0, 60) }}{{ (item.content && item.content.length > 60) ? '…' : '' }}</td>
            <td><span :class="['status-badge', item.status === 1 ? 'on' : 'off']">{{ item.status === 1 ? '展示' : '下架' }}</span></td>
            <td>{{ item.sortOrder }}</td>
            <td>{{ item.startAt ? item.startAt.replace('T', ' ').slice(0, 16) : '-' }}</td>
            <td>{{ item.endAt ? item.endAt.replace('T', ' ').slice(0, 16) : '-' }}</td>
            <td>{{ item.createdAt ? item.createdAt.replace('T', ' ').slice(0, 16) : '-' }}</td>
            <td class="actions-cell">
              <button type="button" class="btn-link" @click="openForm(item.id)">编辑</button>
              <template v-if="item.status === 1">
                <button type="button" class="btn-link danger" @click="setStatus(item.id, 0)">下架</button>
              </template>
              <template v-else>
                <button type="button" class="btn-link success" @click="setStatus(item.id, 1)">上架</button>
              </template>
              <button type="button" class="btn-link danger" @click="doDelete(item.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑弹层 -->
    <div v-if="formVisible" class="modal-overlay" @click.self="formVisible = false">
      <div class="modal-card card-common">
        <div class="modal-header">
          <h3>{{ formId ? '编辑公告' : '新增公告' }}</h3>
          <button type="button" class="modal-close" @click="formVisible = false" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label>标题 <span class="required">*</span></label>
            <input v-model="form.title" placeholder="公告标题" maxlength="128" />
          </div>
          <div class="form-row">
            <label>正文</label>
            <textarea v-model="form.content" placeholder="公告正文（选填）" rows="4"></textarea>
          </div>
          <div class="form-row">
            <label>跳转链接</label>
            <input v-model="form.linkUrl" placeholder="https://..." maxlength="512" />
          </div>
          <div class="form-row row-inline">
            <label class="inline">
              <input type="checkbox" v-model="form.statusCheck" /> 上架展示
            </label>
          </div>
          <div class="form-row">
            <label>排序（数字越大越靠前）</label>
            <input v-model.number="form.sortOrder" type="number" placeholder="0" />
          </div>
          <div class="form-row">
            <label>开始时间（选填，留空则立即生效）</label>
            <input v-model="form.startAt" type="datetime-local" />
          </div>
          <div class="form-row">
            <label>结束时间（选填，留空则长期有效）</label>
            <input v-model="form.endAt" type="datetime-local" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-outline" @click="formVisible = false">取消</button>
          <button type="button" class="btn-primary" @click="submitForm">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const statusFilter = ref(null)
const keyword = ref('')
const list = ref([])
const loading = ref(false)
const formVisible = ref(false)
const formId = ref(null)
const form = ref({
  title: '',
  content: '',
  linkUrl: '',
  statusCheck: true,
  sortOrder: 0,
  startAt: '',
  endAt: '',
})

async function load() {
  loading.value = true
  try {
    const params = { page: 1, page_size: 100 }
    if (statusFilter.value !== null) params.status = statusFilter.value
    if (keyword.value.trim()) params.keyword = keyword.value.trim()
    const res = await api.getAnnouncements(params)
    list.value = (res.data && res.data.list) ? res.data.list : []
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

function openForm(id) {
  formId.value = id || null
  form.value = {
    title: '',
    content: '',
    linkUrl: '',
    statusCheck: true,
    sortOrder: 0,
    startAt: '',
    endAt: '',
  }
  formVisible.value = true
  if (id) {
    api.getAnnouncement(id).then(res => {
      const d = res.data
      if (!d) return
      form.value = {
        title: d.title || '',
        content: d.content || '',
        linkUrl: d.linkUrl || '',
        statusCheck: d.status === 1,
        sortOrder: d.sortOrder ?? 0,
        startAt: d.startAt ? d.startAt.slice(0, 16) : '',
        endAt: d.endAt ? d.endAt.slice(0, 16) : '',
      }
    }).catch(() => {})
  }
}

function submitForm() {
  const title = (form.value.title || '').trim()
  if (!title) {
    alert('请填写标题')
    return
  }
  const payload = {
    title,
    content: (form.value.content || '').trim() || undefined,
    linkUrl: (form.value.linkUrl || '').trim() || undefined,
    status: form.value.statusCheck ? 1 : 0,
    sortOrder: form.value.sortOrder ?? 0,
  }
  const startAt = (form.value.startAt || '').trim()
  if (startAt) payload.startAt = startAt.replace(' ', 'T') + (startAt.length <= 16 ? ':00' : '')
  const endAt = (form.value.endAt || '').trim()
  if (endAt) payload.endAt = endAt.replace(' ', 'T') + (endAt.length <= 16 ? ':00' : '')

  if (formId.value) {
    api.updateAnnouncement(formId.value, payload).then(() => {
      formVisible.value = false
      load()
    }).catch(e => alert(e.response?.data?.message || '保存失败'))
  } else {
    api.createAnnouncement(payload).then(() => {
      formVisible.value = false
      load()
    }).catch(e => alert(e.response?.data?.message || '创建失败'))
  }
}

async function setStatus(id, status) {
  const action = status === 0 ? '下架' : '上架'
  if (!confirm(`确认要${action}该公告吗？`)) return
  try {
    await api.setAnnouncementStatus(id, status)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

async function doDelete(id) {
  if (!confirm('确认删除该公告？删除后不可恢复。')) return
  try {
    await api.deleteAnnouncement(id)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '删除失败')
  }
}

onMounted(load)
</script>

<style scoped>
.page-container { max-width: 1200px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.25rem; font-weight: 700; color: #1E293B; }
.page-hint { font-size: 0.875rem; color: var(--text-muted); margin-top: 6px; }

.toolbar-card { padding: 20px 24px; display: flex; gap: 24px; align-items: center; margin-bottom: 24px; flex-wrap: wrap; }
.filter-group { display: flex; align-items: center; gap: 12px; }
.filter-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); }
.status-tabs { display: flex; background: var(--bg-body); padding: 4px; border-radius: 8px; border: 1px solid #E2E8F0; }
.status-tab { border: none; background: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 0.875rem; color: var(--text-muted); transition: all 0.2s; }
.status-tab.active { background: #fff; color: var(--primary); box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-weight: 600; }

.search-box { flex: 1; min-width: 200px; display: flex; align-items: center; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0 12px; }
.search-box input { flex: 1; border: none; background: transparent; padding: 10px 0; outline: none; font-size: 0.875rem; }
.search-box svg { color: var(--text-muted); margin-right: 8px; }

.btn-primary { padding: 8px 20px; background: var(--primary); color: #fff; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.btn-primary:hover { opacity: 0.9; }
.btn-outline { padding: 8px 20px; background: transparent; color: var(--text-main); border: 1px solid #E2E8F0; border-radius: 8px; font-size: 0.875rem; cursor: pointer; margin-right: 12px; }

.table-wrap { overflow: auto; border-radius: var(--radius); }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #E2E8F0; font-size: 0.875rem; }
.table th { background: #F8FAFC; color: #64748B; font-weight: 600; }
.title-cell { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.content-cell { max-width: 220px; color: var(--text-muted); }
.status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.status-badge.on { background: #DCFCE7; color: #166534; }
.status-badge.off { background: #F1F5F9; color: #64748B; }
.actions-cell { white-space: nowrap; }
.btn-link { background: none; border: none; color: var(--primary); cursor: pointer; font-size: 0.8125rem; padding: 0 6px; margin-right: 8px; }
.btn-link:hover { text-decoration: underline; }
.btn-link.danger { color: #DC2626; }
.btn-link.success { color: #16A34A; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal-card { width: 100%; max-width: 560px; max-height: 90vh; overflow: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #E2E8F0; }
.modal-header h3 { font-size: 1.125rem; font-weight: 700; color: #1E293B; }
.modal-close { width: 32px; height: 32px; border: none; background: #F1F5F9; border-radius: 6px; font-size: 1.25rem; line-height: 1; cursor: pointer; color: #64748B; }
.modal-close:hover { background: #E2E8F0; }
.modal-body { padding: 24px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #E2E8F0; display: flex; justify-content: flex-end; }

.form-row { margin-bottom: 18px; }
.form-row label { display: block; margin-bottom: 6px; font-size: 0.875rem; font-weight: 600; color: #374151; }
.form-row .required { color: #DC2626; }
.form-row input[type="text"], .form-row input[type="number"], .form-row textarea { width: 100%; padding: 10px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 0.875rem; }
.form-row input:focus, .form-row textarea:focus { outline: none; border-color: var(--primary); }
.form-row textarea { resize: vertical; min-height: 80px; }
.form-row.row-inline .inline { display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; }
.form-row input[type="datetime-local"] { min-width: 200px; }
</style>
