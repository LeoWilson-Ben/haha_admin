<template>
  <div>
    <h2 class="page-title">名师认证审核</h2>
    <p class="page-hint">名师入驻申请：通过后该用户将显示在「真人名师」列表。已通过的名师可设置咨询单价（默认 10 元）。</p>
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
          <th>用户ID</th>
          <th>昵称</th>
          <th>手机号</th>
          <th>真实姓名</th>
          <th>状态</th>
          <th>申请时间</th>
          <th v-if="statusFilter === 'approved'">咨询单价（元）</th>
          <th v-if="statusFilter === 'pending'">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td :colspan="statusFilter === 'pending' ? 8 : statusFilter === 'approved' ? 9 : 7">加载中...</td></tr>
        <tr v-else-if="!list.length"><td :colspan="statusFilter === 'pending' ? 8 : statusFilter === 'approved' ? 9 : 7">暂无数据</td></tr>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.userId }}</td>
          <td>{{ item.nickname }}</td>
          <td>{{ item.mobile }}</td>
          <td>{{ item.realName }}</td>
          <td>{{ statusLabel(item.status) }}</td>
          <td>{{ item.createdAt ? item.createdAt.slice(0, 19) : '-' }}</td>
          <td v-if="statusFilter === 'approved'">
            <input v-model.number="item._consultPrice" type="number" min="0" step="0.01" style="width:72px;padding:4px 8px;border:1px solid #e2e8f0;border-radius:4px" placeholder="10" />
            <button class="btn-ok" style="margin-left:6px" @click="saveConsultPrice(item)">保存</button>
          </td>
          <td v-if="statusFilter === 'pending'">
            <button class="btn-ok" @click="approve(item.id)">通过</button>
            <button class="btn-danger" @click="reject(item)">驳回</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="rejectRemarkShow" class="reject-box">
      <input v-model="rejectRemark" placeholder="驳回原因（选填）" />
      <button @click="confirmReject">确认驳回</button>
      <button @click="rejectRemarkShow = false; rejectTarget = null">取消</button>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const statusFilter = ref('pending')
const list = ref([])
const loading = ref(false)
const rejectRemarkShow = ref(false)
const rejectRemark = ref('')
const rejectTarget = ref(null)

function statusLabel(s) {
  const m = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
  return m[s] || s
}

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
  if (isNaN(price) || price < 0 || price > 99999.99) {
    alert('请输入 0～99999.99 之间的单价')
    return
  }
  try {
    await api.setTeacherConsultPrice(item.userId, price)
    alert('已更新')
    item.consultPrice = price
  } catch (e) {
    alert(e.response?.data?.message || '操作失败')
  }
}

async function approve(id) {
  if (!confirm('确认通过该申请？')) return
  try {
    await api.approveTeacher(id)
    alert('已通过')
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
    alert('已驳回')
    rejectRemarkShow.value = false
    rejectTarget.value = null
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
.table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f7fafc; color: #4a5568; font-weight: 600; }
.btn-ok { padding: 4px 10px; background: #38a169; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
.btn-danger { padding: 4px 10px; background: #c53030; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.reject-box { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
.reject-box input { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 240px; }
</style>
