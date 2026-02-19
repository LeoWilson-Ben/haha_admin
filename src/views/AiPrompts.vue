<template>
  <div>
    <h2>AI 提示词配置</h2>
    <p class="hint">自定义各场景的 AI 提示词，支持占位符如 {today}、{birth_date}、{direction}、{item_name} 等</p>
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
.hint { color: #718096; margin-bottom: 20px; }
.hint code { font-size: 0.85em; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
.error { color: #c53030; margin-bottom: 16px; }
.list { display: flex; flex-direction: column; gap: 24px; }
.item { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.item-head { margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
.item-head .key { font-size: 0.75rem; color: #718096; }
.textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-size: 0.875rem; resize: vertical; }
.btn-save { margin-top: 12px; padding: 8px 20px; background: #E53E3E; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
</style>
