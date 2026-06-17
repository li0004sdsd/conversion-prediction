<template>
  <header class="navbar">
    <div class="navbar-brand">
      <el-icon size="22"><TrendCharts /></el-icon>
      <span>ConversionIQ</span>
    </div>
    <nav class="navbar-links">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/behaviors">Behaviors</router-link>
      <router-link to="/predictions">Predictions</router-link>
      <router-link to="/reports">Reports</router-link>
    </nav>
    <div class="navbar-user">
      <span class="username">{{ authStore.user?.username }}</span>
      <el-button type="danger" size="small" @click="handleLogout">Logout</el-button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
  text-decoration: none;
}
.navbar-links {
  display: flex;
  gap: 8px;
  flex: 1;
}
.navbar-links a {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  transition: all 0.2s;
}
.navbar-links a:hover,
.navbar-links a.router-link-active {
  background: #ecf5ff;
  color: #409eff;
}
.navbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.username {
  font-size: 14px;
  color: #606266;
}
</style>
