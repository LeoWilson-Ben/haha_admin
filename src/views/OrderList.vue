<template>
  <div>
    <h2 class="page-title">订单与财务</h2>
    <p class="page-hint">提现申请审核：通过/驳回后用户端可见状态</p>
    <div class="toolbar">
      <select v-model="statusFilter" @change="load">
        <option value="pending">待审核</option>
        <option value="approved">已通过</option>
        <option value="rejected">已驳回</option>
      </select>
      <button class="btn-primary" @click="load">刷新</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户</th>
          <th>手机号</th>
          <th>金额</th>
          <th>银行卡信息</th>
          <th>状态</th>
          <th>申请时间</th>
          <th v-if="statusFilter === 'pending'">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td :colspan="statusFilter === 'pending' ? 9 : 8">加载中...</td></tr>
        <tr v-else-if="!list.length"><td :colspan="statusFilter === 'pending' ? 9 : 8">暂无数据</td></tr>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.nickname }}</td>
          <td>{{ item.mobile }}</td>
          <td>¥ {{ item.amount }}</td>
          <td>{{ item.bankCardSnapshot || '-' }}</td>
          <td>{{ statusLabel(item.status) }}</td>
          <td>{{ item.createdAt ? item.createdAt.slice(0, 19) : '-' }}</td>
          <td v-if="statusFilter === 'pending'">
            <button class="btn-ok" @click="approve(item.id)">通过</button>
            <button class="btn-danger" @click="reject(item)">驳回</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="rejectShow" class="reject-box">
      <input v-model="rejectRemark" placeholder="驳回原因（选填）" />
      <button @click="confirmReject">确认驳回</button>
      <button @click="rejectShow = false; rejectId = null">取消</button>
    </p>
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
  if (!confirm('确认通过该提现申请？')) return
  try {
    await api.approveWithdraw(id)
    alert('已通过')
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
    alert('已驳回')
    rejectShow.value = false
    rejectId.value = null
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
.toolbar button.btn-primary { padding: 8px 16px; }
.table { width: 100%; border-collapse: collapse; background: #fff; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--card-border); }
.table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f7fafc; color: #4a5568; font-weight: 600; }
.btn-ok { padding: 4px 10px; background: #38a169; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
.btn-danger { padding: 4px 10px; background: #c53030; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.reject-box { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
.reject-box input { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 240px; }
</style>
