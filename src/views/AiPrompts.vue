<template>
  <div>
    <h2 class="page-title">AI 提示词配置</h2>
    <p class="page-hint">自定义各场景的 AI 提示词，支持占位符如 {today}、{birth_date}、{direction}、{item_name}；今日养生还支持 {today_fmt}、{constitution}、{solar_term}、{weather}（当地天气）等</p>
    <template v-if="loading">
      <p>加载中...</p>
    </template>
    <template v-else>
      <p v-if="loadError" class="error">{{ loadError }}</p>
      <p v-else-if="list.length === 0" class="hint">暂无数据。若接口报错，请确认后端数据库已执行：<code>mysql -u root -p lingshu &lt; server/sql/migrate_ai_prompt.sql</code></p>
      <div class="list" v-else>
        <div class="item" v-for="p in list" :key="p.key">
          <div class="item-head">
            <strong>{{ p.name || p.key }}</strong>
            <span class="key">{{ p.key }}</span>
          </div>
          <textarea v-model="p._content" rows="6" class="textarea" placeholder="提示词内容"></textarea>
          <button class="btn-save" @click="save(p)">保存</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const loading = ref(false)
const list = ref([])
const loadError = ref('')

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await api.getAiPrompts()
    const rows = (res.data && res.data.list) ? res.data.list : []
    rows.forEach(r => { r._content = r.content || '' })
    list.value = rows
  } catch (e) {
    list.value = []
    const msg = e.response?.data?.message || e.response?.data?.data || e.message || '请求失败'
    loadError.value = '加载失败：' + (typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  loading.value = false
}

async function save(p) {
  if (!(p._content || '').trim()) {
    alert('内容不能为空')
    return
  }
  try {
    await api.updateAiPrompt(p.key, { name: p.name || p.key, content: p._content.trim() })
    alert('已保存')
  } catch (e) {
    alert(e.response?.data?.message || '保存失败')
  }
}

onMounted(load)
</script>

<style scoped>
.page-hint code { font-size: 0.85em; background: #f7f7f8; padding: 2px 6px; border-radius: 4px; }
.error { color: var(--danger); margin-bottom: 16px; }
.list { display: flex; flex-direction: column; gap: 24px; }
.item { background: var(--card-bg); padding: 22px; border-radius: var(--radius); border: 1px solid var(--card-border); }
.item-head { margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
.item-head .key { font-size: 0.8125rem; color: var(--text-muted); }
.textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--card-border); border-radius: var(--radius-sm); font-family: inherit; font-size: 0.875rem; resize: vertical; }
.textarea:focus { outline: none; border-color: var(--accent); }
.btn-save { margin-top: 12px; padding: 10px 20px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 500; }
.btn-save:hover { background: var(--accent-hover); }
</style>
