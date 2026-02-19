<template>
  <div class="board">
    <h2>核心数据看板</h2>
    <p class="hint">实时数据、业务数据与趋势，支持时间段筛选</p>

    <div class="filter">
      <label>时间范围</label>
      <input type="date" v-model="startDate" />
      <span>至</span>
      <input type="date" v-model="endDate" />
      <button @click="load">查询</button>
    </div>

    <template v-if="loading">
      <p>加载中...</p>
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
.hint { color: #718096; margin-bottom: 16px; }
.filter { margin-bottom: 24px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.filter label { margin-right: 4px; }
.filter input[type="date"] { padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
.filter button { padding: 8px 16px; background: #E53E3E; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.section { margin-bottom: 32px; }
.section h3 { font-size: 1rem; color: #4a5568; margin-bottom: 12px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.card.link { cursor: pointer; }
.card.link:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.card .label { display: block; color: #718096; font-size: 0.75rem; }
.card .value { font-size: 1.25rem; font-weight: 600; color: #E53E3E; }
.trend-table-wrap { overflow-x: auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-height: 400px; overflow-y: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f7fafc; color: #4a5568; font-weight: 600; font-size: 0.875rem; }
</style>
