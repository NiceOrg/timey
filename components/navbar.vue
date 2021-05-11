<template>
  <div class="comp-navbar">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="dashboard">
        <NuxtLink to="/dashboard"><a-icon type="home" />Dashboard</NuxtLink>
      </a-menu-item>
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper"><a-icon type="message" />Rapports</span>
        <a-menu-item key="report-task">
          <NuxtLink to="/report-task"><a-icon type="message" />Par tâche</NuxtLink>
        </a-menu-item>
        <a-menu-item key="report-tag">
          <NuxtLink to="/report-tag"><a-icon type="message" />Par tag</NuxtLink>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="settings">
        <NuxtLink to="/settings"><a-icon type="setting" />Options</NuxtLink>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
const DEFAULT_MENU = 'dashboard'
export default Vue.extend({
  data() {
    return {
      current: [DEFAULT_MENU],
    }
  },
  created() {
    this.current = [this.$route.name || DEFAULT_MENU]
  },
})
</script>

<style scoped>
.comp-navbar {
  top: 0;
  width: 100%;
}
</style>
