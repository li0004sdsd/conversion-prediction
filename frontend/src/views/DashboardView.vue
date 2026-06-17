<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>
    <div v-if="reportsStore.loading" class="loading-wrap">
      <el-skeleton :rows="4" animated />
    </div>
    <template v-else>
      <el-row :gutter="20" class="stat-cards">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <p class="stat-label">Total Users</p>
              <p class="stat-value primary">{{ summary?.total_users ?? 0 }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <p class="stat-label">Total Predictions</p>
              <p class="stat-value info">{{ summary?.total_predictions ?? 0 }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <p class="stat-label">Avg. Score</p>
              <p class="stat-value warning">{{ summary ? (summary.avg_score * 100).toFixed(1) + '%' : '-' }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <p class="stat-label">High Intent</p>
              <p class="stat-value success">{{ summary?.high_intent_count ?? 0 }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="gauge-row">
        <el-col :span="8" v-for="seg in gaugeData" :key="seg.label">
          <el-card shadow="hover">
            <p class="gauge-label">{{ seg.label }}</p>
            <ScoreGauge :score="seg.score" :title="seg.label" />
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ScoreGauge from '../components/ScoreGauge.vue'
import { useReportsStore } from '../stores/reports'

const reportsStore = useReportsStore()
const summary = computed(() => reportsStore.summary)

const gaugeData = computed(() => {
  const segs = reportsStore.segments
  return [
    { label: 'High Intent', score: segs.find(s => s.segment === 'high_intent')?.avg_score ?? 0 },
    { label: 'Medium Intent', score: segs.find(s => s.segment === 'medium_intent')?.avg_score ?? 0 },
    { label: 'Low Intent', score: segs.find(s => s.segment === 'low_intent')?.avg_score ?? 0 },
  ]
})

onMounted(() => reportsStore.fetchAll())
</script>

<style scoped>
.dashboard { max-width: 1200px; margin: 0 auto; }
.page-title { font-size: 24px; font-weight: 700; color: #303133; margin-bottom: 24px; }
.stat-cards { margin-bottom: 24px; }
.stat-item { text-align: center; padding: 8px 0; }
.stat-label { font-size: 13px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 32px; font-weight: 700; }
.stat-value.primary { color: #409eff; }
.stat-value.info { color: #909399; }
.stat-value.warning { color: #e6a23c; }
.stat-value.success { color: #67c23a; }
.gauge-row { margin-top: 0; }
.gauge-label { text-align: center; font-size: 14px; font-weight: 600; color: #606266; margin-bottom: 4px; }
.loading-wrap { padding: 40px 0; }
</style>
