<template>
  <div class="board">
    <h2 class="page-title">核心数据看板</h2>
    <p class="page-hint">实时数据、业务数据与趋势，支持时间段筛选</p>

    <div class="filter">
      <label>时间范围</label>
      <input type="date" v-model="startDate" />
      <span>至</span>
      <input type="date" v-model="endDate" />
      <button class="btn-primary" @click="load">查询</button>
    </div>

    <template v-if="loading">
      <p class="loading-tip">加载中…</p>
    </template>
    <template v-else-if="data.realtime">
      <section class="section">
        <h3>实时数据</h3>
        <div class="cards">
          <div class="card"><span class="label">日活 DAU</span><span class="value">{{ data.realtime.dau ?? '--' }}</span></div>
          <div class="card"><span class="label">周活 WAU</span><span class="value">{{ data.realtime.wau ?? '--' }}</span></div>
          <div class="card"><span class="label">月活 MAU</span><span class="value">{{ data.realtime.mau ?? '--' }}</span></div>
          <div class="card"><span class="label">新增用户(昨)</span><span class="value">{{ data.realtime.newUsers1d ?? '--' }}</span></div>
          <div class="card"><span class="label">新增(7日)</span><span class="value">{{ data.realtime.newUsers7d ?? '--' }}</span></div>
          <div class="card"><span class="label">新增(30日)</span><span class="value">{{ data.realtime.newUsers30d ?? '--' }}</span></div>
          <div class="card"><span class="label">次日留存%</span><span class="value">{{ data.realtime.retention1d ?? '--' }}</span></div>
          <div class="card"><span class="label">7日留存%</span><span class="value">{{ data.realtime.retention7d ?? '--' }}</span></div>
          <div class="card"><span class="label">30日留存%</span><span class="value">{{ data.realtime.retention30d ?? '--' }}</span></div>
        </div>
      </section>
      <section class="section">
        <h3>业务数据</h3>
        <div class="cards">
          <div class="card"><span class="label">订单量</span><span class="value">{{ data.business?.orderCount ?? '--' }}</span></div>
          <div class="card"><span class="label">交易额(元)</span><span class="value">{{ data.business?.gmv ?? '--' }}</span></div>
          <div class="card"><span class="label">内容发布量</span><span class="value">{{ data.business?.postCount ?? '--' }}</span></div>
          <div class="card"><span class="label">付费转化率%</span><span class="value">{{ data.business?.paidConversionRate ?? '--' }}</span></div>
        </div>
      </section>
      <section class="section">
        <h3>待办</h3>
        <div class="cards">
          <div class="card link" @click="$router.push('/teacher')"><span class="label">待审核名师</span><span class="value">{{ data.pending?.teacherPendingCount ?? '--' }}</span></div>
          <div class="card link" @click="$router.push('/orders')"><span class="label">待审核提现</span><span class="value">{{ data.pending?.withdrawPendingCount ?? '--' }}</span></div>
          <div class="card link" @click="$router.push('/report')"><span class="label">待处理举报</span><span class="value">{{ data.pending?.reportPendingCount ?? '--' }}</span></div>
        </div>
      </section>
      <section class="section" v-if="data.trend && data.trend.length">
        <h3>趋势（按日）</h3>
        <div class="trend-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>日期</th>
                <th>新增用户</th>
                <th>发帖量</th>
                <th>订单量</th>
                <th>交易额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.trend.slice().reverse()" :key="row.date">
                <td>{{ row.date }}</td>
                <td>{{ row.newUsers }}</td>
                <td>{{ row.postCount }}</td>
                <td>{{ row.orderCount }}</td>
                <td>{{ row.gmv }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const loading = ref(false)
const data = ref({})
const startDate = ref('')
const endDate = ref('')

async function load() {
  loading.value = true
  try {
    const params = { period: 'day' }
    if (startDate.value) params.start_date = startDate.value
    if (endDate.value) params.end_date = endDate.value
    const res = await api.getCoreData(params)
    data.value = (res && res.data) ? res.data : {}
    if (!startDate.value && data.value.startDate) startDate.value = data.value.startDate
    if (!endDate.value && data.value.endDate) endDate.value = data.value.endDate
  } catch (_) {
    data.value = {}
  }
  loading.value = false
}

onMounted(load)
</script>

<style scoped>
.filter { margin-bottom: 24px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filter label { margin-right: 4px; font-size: 0.875rem; color: var(--text-muted); }
.filter input[type="date"] { padding: 8px 12px; border: 1px solid var(--card-border); border-radius: var(--radius-sm); font-size: 0.875rem; }
.filter span { color: var(--text-muted); font-size: 0.875rem; }
.loading-tip { color: var(--text-muted); margin: 24px 0; }
.section { margin-bottom: 32px; }
.section h3 { font-size: 0.9375rem; font-weight: 600; color: var(--text); margin-bottom: 14px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
.card { background: var(--card-bg); padding: 18px; border-radius: var(--radius); box-shadow: var(--card-shadow); border: 1px solid var(--card-border); }
.card.link { cursor: pointer; transition: box-shadow 0.2s, border-color 0.2s; }
.card.link:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: var(--accent); }
.card .label { display: block; color: var(--text-muted); font-size: 0.8125rem; margin-bottom: 4px; }
.card .value { font-size: 1.25rem; font-weight: 600; color: var(--accent); }
.trend-table-wrap { overflow-x: auto; background: var(--card-bg); border-radius: var(--radius); box-shadow: var(--card-shadow); border: 1px solid var(--card-border); max-height: 400px; overflow-y: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--card-border); }
.table th { background: #f8fafc; color: var(--text-muted); font-weight: 600; font-size: 0.8125rem; }
.table tbody tr:hover { background: #f8fafc; }
</style>
