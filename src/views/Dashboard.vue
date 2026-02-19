<template>
  <div class="dashboard-board">
    <div class="board-header">
      <h2 class="page-title">核心数据看板</h2>
      <p class="page-hint">实时监控业务动态与核心指标，默认展示最近一周趋势</p>
    </div>

    <div class="filter-section card-common">
      <div class="filter-item">
        <label>时间跨度</label>
        <div class="date-group">
          <input type="date" v-model="startDate" class="date-input" />
          <span class="to">至</span>
          <input type="date" v-model="endDate" class="date-input" />
        </div>
      </div>
      <button class="btn-primary" @click="load" :disabled="loading">
        {{ loading ? '更新中...' : '同步数据' }}
      </button>
    </div>

    <template v-if="!loading || data.realtime">
      <section class="board-section">
        <div class="section-header">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          <h3>实时活跃概览</h3>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="m-label">日活跃 (DAU)</div>
            <div class="m-value">{{ data.realtime?.dau ?? '--' }}</div>
          </div>
          <div class="metric-card">
            <div class="m-label">周活跃 (WAU)</div>
            <div class="m-value">{{ data.realtime?.wau ?? '--' }}</div>
          </div>
          <div class="metric-card">
            <div class="m-label">次日留存</div>
            <div class="m-value">{{ data.realtime?.retention1d ? data.realtime.retention1d + '%' : '--' }}</div>
          </div>
          <div class="metric-card accent">
            <div class="m-label">昨日新增</div>
            <div class="m-value">{{ data.realtime?.newUsers1d ?? '--' }}</div>
          </div>
        </div>
      </section>

      <section class="board-section">
        <div class="section-header">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <h3>业务经营指标</h3>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="m-label">累计订单量</div>
            <div class="m-value">{{ data.business?.orderCount ?? '--' }}</div>
          </div>
          <div class="metric-card">
            <div class="m-label">成交总额 (GMV)</div>
            <div class="m-value">¥{{ data.business?.gmv ?? '--' }}</div>
          </div>
          <div class="metric-card">
            <div class="m-label">内容发布量</div>
            <div class="m-value">{{ data.business?.postCount ?? '--' }}</div>
          </div>
          <div class="metric-card">
            <div class="m-label">付费转化率</div>
            <div class="m-value">{{ data.business?.paidConversionRate ? data.business.paidConversionRate + '%' : '--' }}</div>
          </div>
        </div>
      </section>

      <div class="charts-container">
        <div class="chart-box card-common">
          <div class="chart-header">数据趋势 (新增/发帖/订单)</div>
          <div class="canvas-wrap">
            <canvas ref="barCanvas"></canvas>
          </div>
        </div>
        <div class="chart-box card-common">
          <div class="chart-header">每日新增用户走势</div>
          <div class="canvas-wrap">
            <canvas ref="lineCanvas"></canvas>
          </div>
        </div>
      </div>

      <section class="board-section">
        <div class="section-header">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <h3>历史数据明细</h3>
        </div>
        <div class="table-card card-common">
          <table class="modern-table">
            <thead>
              <tr>
                <th>统计日期</th>
                <th>新增用户</th>
                <th>发帖量</th>
                <th>订单量</th>
                <th>成交金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in trendReversed" :key="row.date">
                <td class="date-cell">{{ row.date }}</td>
                <td>{{ row.newUsers }}</td>
                <td>{{ row.postCount }}</td>
                <td>{{ row.orderCount }}</td>
                <td class="amount-cell">¥{{ row.gmv }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { api } from '../api'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const CHART_COLORS = {
  primary: '#B91C1C',
  primaryAlpha: 'rgba(185, 28, 28, 0.1)',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  text: '#64748B'
}

const loading = ref(false)
const data = ref({})
const startDate = ref('')
const endDate = ref('')
const barCanvas = ref(null)
const lineCanvas = ref(null)

let chartBar = null
let chartLine = null

const trendReversed = computed(() => {
  const t = data.value.trend
  return t && t.length ? t.slice().reverse() : []
})

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: CHART_COLORS.text, boxWidth: 12, padding: 20 } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: CHART_COLORS.text } },
    y: { grid: { color: '#F1F5F9' }, ticks: { color: CHART_COLORS.text }, beginAtZero: true },
  },
}

function initDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 7) // Default 7 days

  startDate.value = start.toISOString().split('T')[0]
  endDate.value = end.toISOString().split('T')[0]
}

function buildCharts() {
  const trend = data.value.trend || []
  const labels = trend.map((r) => r.date)

  if (chartBar) chartBar.destroy()
  if (barCanvas.value && labels.length) {
    chartBar = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: '新增用户', data: trend.map((r) => r.newUsers), backgroundColor: CHART_COLORS.info, borderRadius: 4 },
          { label: '发帖量', data: trend.map((r) => r.postCount), backgroundColor: CHART_COLORS.success, borderRadius: 4 },
          { label: '订单量', data: trend.map((r) => r.warning), backgroundColor: CHART_COLORS.primary, borderRadius: 4 },
        ],
      },
      options: defaultOptions,
    })
  }

  if (chartLine) chartLine.destroy()
  if (lineCanvas.value && labels.length) {
    chartLine = new Chart(lineCanvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '新增用户走势',
            data: trend.map((r) => r.newUsers),
            borderColor: CHART_COLORS.primary,
            backgroundColor: CHART_COLORS.primaryAlpha,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            borderWidth: 3
          },
        ],
      },
      options: defaultOptions,
    })
  }
}

async function load() {
  loading.value = true
  try {
    const params = { period: 'day', start_date: startDate.value, end_date: endDate.value }
    const res = await api.getCoreData(params)
    data.value = res?.data || {}
  } catch (_) {
    data.value = {}
  }
  loading.value = false
}

onMounted(() => {
  initDateRange()
  load()
})

watch(data, () => {
  if (data.value.trend) nextTick(buildCharts)
}, { deep: true })

onBeforeUnmount(() => {
  if (chartBar) chartBar.destroy()
  if (chartLine) chartLine.destroy()
})
</script>

<style scoped>
.dashboard-board { max-width: 1200px; margin: 0 auto; }
.board-header { margin-bottom: 24px; text-align: center; }

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  margin-bottom: 32px;
}

.filter-item { display: flex; align-items: center; gap: 16px; }
.filter-item label { font-weight: 600; color: var(--text-main); font-size: 0.875rem; }
.date-group { display: flex; align-items: center; background: var(--bg-body); padding: 4px 12px; border-radius: 8px; border: 1px solid var(--card-border); }
.date-input { border: none; background: transparent; padding: 6px; outline: none; font-size: 0.875rem; color: var(--text-main); }
.to { margin: 0 12px; color: var(--text-light); font-size: 0.8125rem; }

.board-section { margin-bottom: 40px; }
.section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: var(--text-muted); }
.section-header h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); }

.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.metric-card { background: white; padding: 24px; border-radius: var(--radius); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); transition: transform 0.2s; }
.metric-card:hover { transform: translateY(-2px); }
.metric-card.accent { border-left: 4px solid var(--primary); }
.m-label { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
.m-value { font-size: 1.75rem; font-weight: 800; color: var(--text-main); }

.charts-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
.chart-box { padding: 24px; display: flex; flex-direction: column; }
.chart-header { font-weight: 700; font-size: 0.9375rem; margin-bottom: 20px; color: var(--text-main); }
.canvas-wrap { height: 260px; position: relative; }

.table-card { overflow: hidden; }
.modern-table { width: 100%; border-collapse: collapse; }
.modern-table th { background: #F8FAFC; padding: 14px 24px; text-align: left; font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--card-border); }
.modern-table td { padding: 16px 24px; border-bottom: 1px solid var(--card-border); font-size: 0.9375rem; }
.date-cell { font-weight: 600; color: var(--text-main); }
.amount-cell { color: var(--success); font-weight: 700; }

@media (max-width: 1024px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-container { grid-template-columns: 1fr; }
}
</style>
