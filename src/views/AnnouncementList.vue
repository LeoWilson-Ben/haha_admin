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
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="formVisible" class="modal-overlay" @click.self="formVisible = false">
          <div class="modal-card card-common" @click.stop>
            <div class="modal-header">
              <div class="modal-title-wrap">
                <span class="modal-icon">📢</span>
                <h3>{{ formId ? '编辑公告' : '新增公告' }}</h3>
              </div>
              <button type="button" class="modal-close" @click="formVisible = false" aria-label="关闭">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div class="modal-body">
              <section class="form-section">
                <h4 class="form-section-title">基本信息</h4>
                <div class="form-row">
                  <label>标题 <span class="required">*</span><span class="form-hint">{{ (form.title || '').length }}/128</span></label>
                  <input v-model="form.title" placeholder="请输入公告标题" maxlength="128" class="input-title" />
                </div>
                <div class="form-row">
                  <label>正文</label>
                  <textarea v-model="form.content" placeholder="公告正文内容，支持多行（选填）" rows="4"></textarea>
                </div>
                <div class="form-row">
                  <label>跳转链接</label>
                  <input v-model="form.linkUrl" placeholder="选填，如 https://..." maxlength="512" type="url" />
                </div>
              </section>
              <section class="form-section">
                <h4 class="form-section-title">展示设置</h4>
                <div class="form-row form-row-switch">
                  <label class="switch-label">
                    <span class="switch-text">上架展示</span>
                    <span class="switch-desc">开启后 APP 端可见</span>
                  </label>
                  <label class="switch-wrap">
                    <input type="checkbox" v-model="form.statusCheck" class="switch-input" />
                    <span class="switch-slider"></span>
                  </label>
                </div>
                <div class="form-row form-row-inline">
                  <div class="form-half">
                    <label>排序</label>
                    <input v-model.number="form.sortOrder" type="number" placeholder="0" min="0" />
                    <span class="field-hint">数值越大越靠前</span>
                  </div>
                </div>
                <div class="form-row form-row-inline">
                  <div class="form-half">
                    <label>开始时间</label>
                    <input v-model="form.startAt" type="datetime-local" />
                    <span class="field-hint">留空则立即生效</span>
                  </div>
                  <div class="form-half">
                    <label>结束时间</label>
                    <input v-model="form.endAt" type="datetime-local" />
                    <span class="field-hint">留空则长期有效</span>
                  </div>
                </div>
              </section>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-outline" @click="formVisible = false">取消</button>
              <button type="button" class="btn-primary btn-save" @click="submitForm">
                <span class="btn-save-text">保存</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

/* 弹层 */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card { transition: transform 0.2s ease; }
.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card { transform: scale(0.96); }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px;
}
.modal-card {
  width: 100%; max-width: 560px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
  border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid #E2E8F0; background: #FAFAFA; flex-shrink: 0;
}
.modal-title-wrap { display: flex; align-items: center; gap: 10px; }
.modal-icon { font-size: 1.25rem; }
.modal-header h3 { font-size: 1.125rem; font-weight: 700; color: #1E293B; margin: 0; }
.modal-close {
  width: 36px; height: 36px; border: none; background: #F1F5F9; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B;
}
.modal-close:hover { background: #E2E8F0; color: #1E293B; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; min-height: 0; }
.modal-footer {
  padding: 18px 24px; border-top: 1px solid #E2E8F0; background: #FAFAFA;
  display: flex; justify-content: flex-end; gap: 12px; flex-shrink: 0;
}

/* 表单分区 */
.form-section { margin-bottom: 28px; }
.form-section:last-child { margin-bottom: 0; }
.form-section-title {
  font-size: 0.8125rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;
  margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #F1F5F9;
}

.form-row { margin-bottom: 18px; }
.form-row:last-child { margin-bottom: 0; }
.form-row > label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 0.875rem; font-weight: 600; color: #374151; }
.form-row .required { color: #DC2626; }
.form-hint { font-weight: 400; color: #94A3B8; font-size: 0.8125rem; }
.form-row input[type="text"],
.form-row input[type="number"],
.form-row input[type="url"],
.form-row textarea {
  width: 100%; padding: 12px 14px; border: 1px solid #E2E8F0; border-radius: 10px; font-size: 0.9375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-row input::placeholder,
.form-row textarea::placeholder { color: #94A3B8; }
.form-row input:focus,
.form-row textarea:focus {
  outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
}
.form-row .input-title { font-weight: 500; }
.form-row textarea { resize: vertical; min-height: 100px; line-height: 1.5; }

/* 上架开关 */
.form-row-switch { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.switch-label { display: flex; flex-direction: column; gap: 2px !important; margin-bottom: 0 !important; cursor: default; }
.switch-text { font-size: 0.875rem; font-weight: 600; color: #374151; }
.switch-desc { font-size: 0.8125rem; font-weight: 400; color: #94A3B8; }
.switch-wrap { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; cursor: pointer; }
.switch-input { opacity: 0; width: 0; height: 0; }
.switch-slider {
  position: absolute; inset: 0; background: #E2E8F0; border-radius: 24px; transition: 0.25s;
}
.switch-slider::before {
  content: ''; position: absolute; width: 20px; height: 20px; left: 2px; bottom: 2px;
  background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: 0.25s;
}
.switch-input:checked + .switch-slider { background: var(--primary); }
.switch-input:checked + .switch-slider::before { transform: translateX(20px); }

/* 并排与提示 */
.form-row-inline { display: flex; gap: 16px; flex-wrap: wrap; }
.form-half { flex: 1; min-width: 180px; }
.form-half label { display: block; margin-bottom: 8px; font-size: 0.875rem; font-weight: 600; color: #374151; }
.form-half input { width: 100%; padding: 12px 14px; border: 1px solid #E2E8F0; border-radius: 10px; font-size: 0.875rem; }
.form-half input[type="datetime-local"] { min-width: 0; }
.form-half input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12); }
.field-hint { display: block; font-size: 0.75rem; color: #94A3B8; margin-top: 6px; }

.btn-save { padding: 10px 24px; border-radius: 10px; font-weight: 600; }
</style>
