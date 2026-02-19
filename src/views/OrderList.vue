<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">财务管理</h2>
      <p class="page-hint">审核用户的提现申请，管理平台资金结算记录</p>
    </div>

    <div class="toolbar-card card-common">
      <div class="filter-group">
        <label>状态筛选</label>
        <div class="status-tabs">
          <button v-for="opt in statusOptions" :key="opt.value"
                  :class="['status-tab', { active: statusFilter === opt.value }]"
                  @click="statusFilter = opt.value; load()">
            {{ opt.label }}
          </button>
        </div>
      </div>
      <button class="btn-refresh" @click="load" :disabled="loading">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        刷新数据
      </button>
    </div>

    <div class="table-container card-common">
      <table class="modern-table">
        <thead>
          <tr>
            <th>申请 ID</th>
            <th>申请用户</th>
            <th>提现金额</th>
            <th>结算账户信息</th>
            <th>当前状态</th>
            <th>申请时间</th>
            <th v-if="statusFilter === 'pending'" class="actions-col">审批操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="statusFilter === 'pending' ? 7 : 6" class="status-cell">正在载入财务数据...</td>
          </tr>
          <tr v-else-if="!list.length">
            <td :colspan="statusFilter === 'pending' ? 7 : 6" class="status-cell">暂无提现申请记录</td>
          </tr>
          <tr v-for="item in list" :key="item.id">
            <td class="id-col">#{{ item.id }}</td>
            <td class="user-col">
              <div class="user-info">
                <span class="nickname">{{ item.nickname }}</span>
                <span class="mobile">{{ item.mobile }}</span>
              </div>
            </td>
            <td class="amount-col">¥{{ item.amount }}</td>
            <td class="bank-col">
              <div class="bank-card">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                <span>{{ item.bankCardSnapshot || '未绑定' }}</span>
              </div>
            </td>
            <td>
              <span :class="['status-tag', item.status]">
                {{ statusLabel(item.status) }}
              </span>
            </td>
            <td class="date-col">{{ item.createdAt?.replace('T', ' ').slice(0, 16) }}</td>
            <td v-if="statusFilter === 'pending'" class="actions-col">
              <div class="action-buttons">
                <button class="btn-action success" @click="approve(item.id)">批准</button>
                <button class="btn-action danger" @click="reject(item)">驳回</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="rejectShow" class="modal-overlay">
      <div class="modal-card card-common">
        <h3>驳回提现申请</h3>
        <p>请说明驳回原因，该原因将反馈给提现用户：</p>
        <textarea v-model="rejectRemark" placeholder="如：银行卡信息有误、资金来源待核实等..." rows="3"></textarea>
        <div class="modal-actions">
          <button class="btn-text" @click="rejectShow = false">取消</button>
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
const rejectShow = ref(false)
const rejectRemark = ref('')
const rejectId = ref(null)

const statusOptions = [
  { label: '待审核', value: 'pending' },
  { label: '已发放', value: 'approved' },
  { label: '已驳回', value: 'rejected' }
]

function statusLabel(s) {
  const m = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
  return m[s] || s
}

async function load() {
  loading.value = true
  try {
    const res = await api.getWithdraws({ status: statusFilter.value })
    list.value = (res.data && res.data.list) ? res.data.list : []
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

async function approve(id) {
  if (!confirm('确认已完成线下转账并批准该申请吗？')) return
  try {
    await api.approveWithdraw(id)
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

function reject(item) {
  rejectId.value = item.id
  rejectRemark.value = ''
  rejectShow.value = true
}

async function confirmReject() {
  if (!rejectId.value) return
  try {
    await api.rejectWithdraw(rejectId.value, rejectRemark.value)
    rejectShow.value = false
    load()
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

onMounted(load)
</script>

<style scoped>
.toolbar-card { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.filter-group { display: flex; align-items: center; gap: 16px; }
.filter-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); }
.status-tabs { display: flex; background: var(--bg-main); padding: 4px; border-radius: 8px; border: 1px solid var(--card-border); }
.status-tab { border: none; background: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 0.875rem; color: var(--text-muted); transition: all 0.2s; }
.status-tab.active { background: #fff; color: var(--accent); box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 600; }

.btn-refresh { display: flex; align-items: center; gap: 6px; border: 1px solid var(--card-border); background: #fff; padding: 8px 16px; border-radius: 6px; cursor: pointer; color: var(--text-main); font-size: 0.875rem; }

.table-container { overflow: hidden; }
.modern-table { width: 100%; border-collapse: collapse; }
.modern-table th { background-color: #F8FAFC; padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--card-border); }
.modern-table td { padding: 16px 24px; border-bottom: 1px solid var(--card-border); font-size: 0.9375rem; }

.id-col { color: var(--text-muted); font-family: monospace; }
.user-col .user-info { display: flex; flex-direction: column; }
.user-col .nickname { font-weight: 600; color: var(--text-main); }
.user-col .mobile { font-size: 0.75rem; color: var(--text-muted); }

.amount-col { font-weight: 700; color: var(--success); font-size: 1.0625rem; }
.bank-col .bank-card { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.875rem; }

.status-tag { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.status-tag.pending { background: #FEF3C7; color: #92400E; }
.status-tag.approved { background: #DCFCE7; color: #166534; }
.status-tag.rejected { background: #FEE2E2; color: #991B1B; }

.date-col { color: var(--text-light); font-size: 0.875rem; }

.action-buttons { display: flex; gap: 8px; }
.btn-action { padding: 6px 16px; border: 1px solid var(--card-border); border-radius: 6px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; background: #fff; transition: all 0.2s; }
.btn-action.success { color: var(--success); }
.btn-action.success:hover { background: var(--success); color: #fff; border-color: var(--success); }
.btn-action.danger { color: var(--danger); }
.btn-action.danger:hover { background: var(--danger); color: #fff; border-color: var(--danger); }

.status-cell { text-align: center; padding: 60px; color: var(--text-muted); }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { width: 100%; max-width: 400px; padding: 24px; }
.modal-card h3 { margin-bottom: 12px; }
.modal-card textarea { width: 100%; padding: 12px; border: 1px solid var(--card-border); border-radius: 8px; margin: 16px 0; font-family: inherit; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-text { border: none; background: none; color: var(--text-muted); cursor: pointer; }
.btn-danger-filled { background: var(--danger); color: #fff; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
</style>
