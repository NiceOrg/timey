<template>
  <div class="comp-navbar">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="dashboard">
        <NuxtLink to="/dashboard"><a-icon type="home" />Dashboard</NuxtLink>
      </a-menu-item>
      <a-menu-item key="report">
        <NuxtLink to="/report"><a-icon type="message" />Rapport</NuxtLink>
      </a-menu-item>
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

<style>
.ant-menu-item {
  text-align: center;
  width: 33%;
}
</style>
