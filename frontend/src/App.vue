<template>
  <el-config-provider>
    <div class="app-wrapper">
      <NavBar v-if="authStore.isAuthenticated" />
      <main class="main-content" :class="{ 'with-nav': authStore.isAuthenticated }">
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logout()
    }
  }
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f0f2f5; }
.app-wrapper { min-height: 100vh; }
.main-content { padding: 24px; }
.main-content.with-nav { padding-top: 88px; }
</style>
