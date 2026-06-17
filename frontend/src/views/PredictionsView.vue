<template>
  <div class="predictions-page">
    <div class="page-header">
      <h1 class="page-title">Conversion Predictions</h1>
      <el-button type="primary" :icon="MagicStick" @click="scoreDialogVisible = true">Score a Behavior</el-button>
    </div>

    <el-card>
      <el-table :data="predictionsStore.items" v-loading="predictionsStore.loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="user_id" label="User ID" width="90" />
        <el-table-column prop="behavior_id" label="Behavior ID" width="110" />
        <el-table-column prop="score" label="Score" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round(row.score * 100)"
              :color="scoreColor(row.score)"
              :stroke-width="10"
            />
          </template>
        </el-table-column>
        <el-table-column prop="segment" label="Segment" width="140">
          <template #default="{ row }">
            <el-tag :type="segmentTagType(row.segment)" size="small">
              {{ segmentLabel(row.segment) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="predicted_at" label="Predicted At" min-width="160">
          <template #default="{ row }">{{ new Date(row.predicted_at).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="Feature Weights" min-width="200">
          <template #default="{ row }">
            <el-popover placement="left" :width="320" trigger="click">
              <template #reference>
                <el-button size="small" text>View Weights</el-button>
              </template>
              <div class="weights-grid">
                <div v-for="(val, key) in row.feature_weights" :key="key" class="weight-item">
                  <span class="weight-key">{{ key }}</span>
                  <el-progress :percentage="Math.abs(val) * 1000" :stroke-width="6" />
                  <span class="weight-val">{{ val.toFixed(4) }}</span>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="scoreDialogVisible" title="Score Behavior" width="360px">
      <el-form label-width="120px">
        <el-form-item label="Behavior ID">
          <el-input-number v-model="behaviorIdToScore" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scoreDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleScore" :loading="scoring">Score</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick } from '@element-plus/icons-vue'
import { usePredictionsStore } from '../stores/predictions'

const predictionsStore = usePredictionsStore()
const scoreDialogVisible = ref(false)
const behaviorIdToScore = ref(1)
const scoring = ref(false)

function scoreColor(score) {
  if (score >= 0.7) return '#67c23a'
  if (score >= 0.4) return '#e6a23c'
  return '#f56c6c'
}

function segmentTagType(segment) {
  if (segment === 'high_intent') return 'success'
  if (segment === 'medium_intent') return 'warning'
  return 'danger'
}

function segmentLabel(segment) {
  return { high_intent: 'High Intent', medium_intent: 'Medium', low_intent: 'Low Intent' }[segment] ?? segment
}

async function handleScore() {
  scoring.value = true
  try {
    await predictionsStore.score(behaviorIdToScore.value)
    ElMessage.success('Prediction generated')
    scoreDialogVisible.value = false
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || 'Scoring failed')
  } finally {
    scoring.value = false
  }
}

onMounted(() => predictionsStore.fetchAll())
</script>

<style scoped>
.predictions-page { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 700; color: #303133; }
.weights-grid { display: flex; flex-direction: column; gap: 8px; }
.weight-item { display: flex; align-items: center; gap: 8px; }
.weight-key { font-size: 12px; color: #606266; min-width: 120px; }
.weight-val { font-size: 12px; color: #303133; min-width: 54px; text-align: right; }
</style>
