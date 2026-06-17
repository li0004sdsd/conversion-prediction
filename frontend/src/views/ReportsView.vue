<template>
  <div class="reports-page">
    <div class="page-header">
      <h1 class="page-title">Statistical Reports</h1>
      <el-button :icon="Refresh" @click="reportsStore.fetchAll()" :loading="reportsStore.loading">Refresh</el-button>
    </div>

    <div v-if="reportsStore.loading" class="loading-wrap">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else>
      <el-row :gutter="20" class="summary-row">
        <el-col :span="4" v-for="item in summaryCards" :key="item.label">
          <el-card shadow="hover" class="summary-card">
            <p class="sum-label">{{ item.label }}</p>
            <p class="sum-value" :style="{ color: item.color }">{{ item.value }}</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-card shadow="hover">
            <template #header><span class="card-title">Segment Distribution</span></template>
            <SegmentChart :data="reportsStore.segments" />
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card shadow="hover">
            <template #header><span class="card-title">Conversion Score Trend</span></template>
            <ConversionTrendChart :data="reportsStore.trend" />
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="segment-table">
        <template #header><span class="card-title">Segment Details</span></template>
        <el-table :data="reportsStore.segments" stripe>
          <el-table-column prop="segment" label="Segment">
            <template #default="{ row }">
              <el-tag :type="tagType(row.segment)">{{ segmentLabel(row.segment) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="Count" />
          <el-table-column prop="avg_score" label="Avg Score">
            <template #default="{ row }">
              <el-progress :percentage="Math.round(row.avg_score * 100)" :color="scoreColor(row.avg_score)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import SegmentChart from '../components/SegmentChart.vue'
import ConversionTrendChart from '../components/ConversionTrendChart.vue'
import { useReportsStore } from '../stores/reports'

const reportsStore = useReportsStore()
const s = computed(() => reportsStore.summary)

const summaryCards = computed(() => [
  { label: 'Total Users', value: s.value?.total_users ?? 0, color: '#409eff' },
  { label: 'Predictions', value: s.value?.total_predictions ?? 0, color: '#909399' },
  { label: 'Avg Score', value: s.value ? `${(s.value.avg_score * 100).toFixed(1)}%` : '-', color: '#e6a23c' },
  { label: 'High Intent', value: s.value?.high_intent_count ?? 0, color: '#67c23a' },
  { label: 'Medium Intent', value: s.value?.medium_intent_count ?? 0, color: '#e6a23c' },
  { label: 'Low Intent', value: s.value?.low_intent_count ?? 0, color: '#f56c6c' },
])

function tagType(segment) {
  return { high_intent: 'success', medium_intent: 'warning', low_intent: 'danger' }[segment] ?? 'info'
}

function segmentLabel(segment) {
  return { high_intent: 'High Intent', medium_intent: 'Medium Intent', low_intent: 'Low Intent' }[segment] ?? segment
}

function scoreColor(score) {
  if (score >= 0.7) return '#67c23a'
  if (score >= 0.4) return '#e6a23c'
  return '#f56c6c'
}

onMounted(() => reportsStore.fetchAll())
</script>

<style scoped>
.reports-page { max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 700; color: #303133; }
.summary-row { margin-bottom: 20px; }
.summary-card { text-align: center; }
.sum-label { font-size: 12px; color: #909399; margin-bottom: 6px; }
.sum-value { font-size: 28px; font-weight: 700; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; }
.segment-table { margin-top: 20px; }
.loading-wrap { padding: 40px 0; }
</style>
