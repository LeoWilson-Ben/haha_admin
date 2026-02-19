<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">名师认证审核</h2>
      <p class="page-hint">审核入驻申请，通过后的用户将晋升为“真人名师”并可开启私聊咨询</p>
    </div>

    <div class="filter-bar card-common">
      <div class="tabs">
        <button v-for="opt in statusOptions" :key="opt.value"
                :class="['tab-btn', { active: statusFilter === opt.value }]"
                @click="statusFilter = opt.value; load()">
          {{ opt.label }}
        </button>
      </div>
      <button class="btn-refresh" @click="load" :disabled="loading">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        刷新
      </button>
    </div>

    <div class="audit-list">
      <div v-if="loading" class="loading-full">正在获取审核列表...</div>
      <div v-else-if="!list.length" class="empty-full">暂无相关审核申请</div>

      <div v-for="item in list" :key="item.id" class="audit-card card-common">
        <div class="card-side">
          <div class="user-profile">
            <div class="avatar-lg">{{ (item.nickname || '名')[0] }}</div>
            <div class="user-meta">
              <h3>{{ item.nickname }}</h3>
              <span class="user-id">UID: {{ item.userId }}</span>
            </div>
          </div>
          <div class="contact-info">
            <div class="info-row">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              {{ item.mobile }}
            </div>
            <div class="info-row">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {{ item.realName }} (实名)
            </div>
          </div>
        </div>

        <div class="card-main">
          <div class="time-stamp">申请时间: {{ item.createdAt?.replace('T', ' ').slice(0, 16) }}</div>

          <div v-if="statusFilter === 'approved'" class="price-config">
            <label>咨询单价 (元)</label>
            <div class="price-input-group">
              <span class="unit">¥</span>
              <input v-model.number="item._consultPrice" type="number" step="0.01" />
              <button class="btn-save-sm" @click="saveConsultPrice(item)">保存</button>
            </div>
          </div>

          <div v-if="statusFilter === 'pending'" class="action-footer">
            <button class="btn-action danger-outline" @click="reject(item)">驳回申请</button>
            <button class="btn-action success-filled" @click="approve(item.id)">批准入驻</button>
          </div>

          <div v-if="statusFilter === 'rejected'" class="reject-reason">
            <div class="reason-label">驳回原因</div>
            <div class="reason-text">{{ item.rejectRemark || '未填写具体原因' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="rejectRemarkShow" class="modal-overlay">
      <div class="modal-card card-common">
        <h3>驳回名师申请</h3>
        <p>请告知用户申请被驳回的具体原因：</p>
        <textarea v-model="rejectRemark" placeholder="如：资质证明模糊、个人简介不符合要求等..." rows="4"></textarea>
        <div class="modal-actions">
          <button class="btn-text" @click="rejectRemarkShow = false">取消</button>
          <button class="btn-danger-filled" @click="confirmReject">确认驳回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const statusFilter = ref('pending')
const list = ref([])
const loading = ref(false)
const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已认证', value: 'approved' },
  { label: '已拒绝', value: 'rejected' }
]

const rejectRemarkShow = ref(false)
const rejectRemark = ref('')
const rejectTarget = ref(null)

async function load() {
  loading.value = true
  try {
    const res = await api.getTeacherApplies({ status: statusFilter.value })
    const raw = (res.data && res.data.list) ? res.data.list : []
    list.value = raw.map((item) => ({ ...item, _consultPrice: item.consultPrice ?? 10 }))
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

async function saveConsultPrice(item) {
  const price = item._consultPrice != null ? Number(item._consultPrice) : 10
  try {
    await api.setTeacherConsultPrice(item.userId, price)
    alert('单价已更新为：¥' + price)
    item.consultPrice = price
  } catch (e) {
    alert(e.response?.data?.message || '保存失败')
  }
}

async function approve(id) {
  if (!confirm('确认该申请符合入驻要求并批准通过吗？')) return
  try {
    await api.approveTeacher(id)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

function reject(item) {
  rejectTarget.value = item.id
  rejectRemark.value = ''
  rejectRemarkShow.value = true
}

async function confirmReject() {
  if (!rejectTarget.value) return
  try {
    await api.rejectTeacher(rejectTarget.value, rejectRemark.value)
    rejectRemarkShow.value = false
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

onMounted(load)
</script>

<style scoped>
.filter-bar { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.tabs { display: flex; gap: 4px; }
.tab-btn { border: none; background: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; color: var(--text-muted); font-size: 0.9375rem; font-weight: 500; transition: all 0.2s; }
.tab-btn:hover { background: var(--bg-main); }
.tab-btn.active { background: var(--accent-light); color: var(--accent); }

.btn-refresh { display: flex; align-items: center; gap: 6px; border: 1px solid var(--card-border); background: #fff; padding: 8px 16px; border-radius: 6px; cursor: pointer; color: var(--text-main); font-size: 0.875rem; }
.btn-refresh:hover { background: var(--bg-main); }

.audit-list { display: flex; flex-direction: column; gap: 16px; }
.audit-card { display: flex; overflow: hidden; }

.card-side { width: 240px; background-color: #F8FAFC; padding: 24px; border-right: 1px solid var(--card-border); }
.user-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.avatar-lg { width: 44px; height: 44px; background: var(--accent); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.25rem; }
.user-meta h3 { font-size: 1rem; color: var(--text-main); margin-bottom: 2px; }
.user-id { font-size: 0.75rem; color: var(--text-muted); font-family: monospace; }

.contact-info { display: flex; flex-direction: column; gap: 8px; }
.info-row { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--text-muted); }

.card-main { flex: 1; padding: 24px; display: flex; flex-direction: column; position: relative; }
.time-stamp { font-size: 0.75rem; color: var(--text-light); align-self: flex-end; }

.price-config { margin-top: 20px; }
.price-config label { display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
.price-input-group { display: flex; align-items: center; gap: 8px; }
.price-input-group .unit { color: var(--text-muted); font-weight: bold; }
.price-input-group input { width: 100px; padding: 8px 12px; border: 1px solid var(--card-border); border-radius: 6px; outline: none; }
.price-input-group input:focus { border-color: var(--accent); }
.btn-save-sm { background: var(--accent); color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; }

.action-footer { margin-top: auto; display: flex; justify-content: flex-end; gap: 12px; padding-top: 20px; }
.btn-action { padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.danger-outline { border: 1px solid var(--danger); background: #fff; color: var(--danger); }
.danger-outline:hover { background: var(--danger); color: #fff; }
.success-filled { background: var(--success); color: #fff; border: none; }
.success-filled:hover { opacity: 0.9; }

.reject-reason { margin-top: 20px; padding: 16px; background: #FFF5F5; border-radius: 8px; border: 1px solid #FED7D7; }
.reason-label { font-size: 0.75rem; font-weight: 700; color: #C53030; margin-bottom: 4px; }
.reason-text { font-size: 0.875rem; color: #9B2C2C; }

.loading-full, .empty-full { padding: 80px; text-align: center; color: var(--text-muted); background: #fff; border-radius: var(--radius); border: 1px dashed var(--card-border); }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { width: 100%; max-width: 440px; padding: 32px; }
.modal-card h3 { margin-bottom: 12px; }
.modal-card p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 20px; }
.modal-card textarea { width: 100%; padding: 12px; border: 1px solid var(--card-border); border-radius: 8px; margin-bottom: 24px; font-family: inherit; font-size: 0.9375rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-text { border: none; background: none; color: var(--text-muted); padding: 8px 16px; cursor: pointer; font-weight: 500; }
.btn-danger-filled { background: var(--danger); color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>
