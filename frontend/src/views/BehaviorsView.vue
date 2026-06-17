<template>
  <div class="behaviors-page">
    <div class="page-header">
      <h1 class="page-title">User Behaviors</h1>
      <el-button type="primary" :icon="Plus" @click="openCreate">Add Record</el-button>
    </div>

    <el-card>
      <el-table :data="behaviorsStore.items" v-loading="behaviorsStore.loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="user_id" label="User ID" width="90" />
        <el-table-column prop="page_views" label="Page Views" width="110" />
        <el-table-column prop="session_duration" label="Session (s)" width="110" />
        <el-table-column prop="clicks" label="Clicks" width="90" />
        <el-table-column prop="email_opens" label="Email Opens" width="120" />
        <el-table-column prop="purchases" label="Purchases" width="110" />
        <el-table-column prop="cart_adds" label="Cart Adds" width="100" />
        <el-table-column prop="search_queries" label="Searches" width="100" />
        <el-table-column prop="days_since_last_visit" label="Days Since Visit" width="140" />
        <el-table-column prop="recorded_at" label="Recorded At" min-width="160">
          <template #default="{ row }">{{ new Date(row.recorded_at).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="Actions" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Behavior' : 'Add Behavior'" width="500px">
      <el-form :model="form" label-width="160px">
        <el-form-item label="User ID" v-if="!isEdit">
          <el-input-number v-model="form.user_id" :min="1" />
        </el-form-item>
        <el-form-item label="Page Views"><el-input-number v-model="form.page_views" :min="0" /></el-form-item>
        <el-form-item label="Session Duration (s)"><el-input-number v-model="form.session_duration" :min="0" :precision="1" /></el-form-item>
        <el-form-item label="Clicks"><el-input-number v-model="form.clicks" :min="0" /></el-form-item>
        <el-form-item label="Email Opens"><el-input-number v-model="form.email_opens" :min="0" /></el-form-item>
        <el-form-item label="Purchases"><el-input-number v-model="form.purchases" :min="0" /></el-form-item>
        <el-form-item label="Cart Adds"><el-input-number v-model="form.cart_adds" :min="0" /></el-form-item>
        <el-form-item label="Search Queries"><el-input-number v-model="form.search_queries" :min="0" /></el-form-item>
        <el-form-item label="Days Since Visit"><el-input-number v-model="form.days_since_last_visit" :min="0" :precision="1" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useBehaviorsStore } from '../stores/behaviors'

const behaviorsStore = useBehaviorsStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editId = ref(null)

const defaultForm = () => ({
  user_id: 1,
  page_views: 0,
  session_duration: 0,
  clicks: 0,
  email_opens: 0,
  purchases: 0,
  cart_adds: 0,
  search_queries: 0,
  days_since_last_visit: 0,
})

const form = reactive(defaultForm())

function openCreate() {
  isEdit.value = false
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (isEdit.value) {
      const { user_id, id, recorded_at, ...updateData } = form
      await behaviorsStore.update(editId.value, updateData)
      ElMessage.success('Updated successfully')
    } else {
      await behaviorsStore.create({ ...form })
      ElMessage.success('Created successfully')
    }
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || 'Operation failed')
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('Delete this behavior record?', 'Confirm', { type: 'warning' })
  await behaviorsStore.remove(id)
  ElMessage.success('Deleted')
}

onMounted(() => behaviorsStore.fetchAll())
</script>

<style scoped>
.behaviors-page { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 700; color: #303133; }
</style>
