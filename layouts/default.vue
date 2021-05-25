<template>
  <div class="app">
    <navbar :settings="navbarSettings" :open="open" />
    <div
      class="content"
      :style="{
        position: 'relative',
      }"
    >
      <a-drawer
        class="drawer"
        title="Menu"
        placement="left"
        :closable="false"
        width="50%"
        :visible="open"
        :get-container="false"
        :wrap-style="{ position: 'absolute' }"
        @close="closeNavbar"
      >
        <a-menu v-model="current" class="menu" mode="inline">
          <a-menu-item key="dashboard" @click="closeNavbar">
            <NuxtLink to="/dashboard"><a-icon type="home" />Dashboard</NuxtLink>
          </a-menu-item>
          <a-sub-menu>
            <span slot="title" class="submenu-title-wrapper"><a-icon type="message" />Rapports</span>
            <a-menu-item key="report-task" @click="closeNavbar">
              <NuxtLink to="/report-task"><a-icon type="message" />Par tâche</NuxtLink>
            </a-menu-item>
            <a-menu-item key="report-tag" @click="closeNavbar">
              <NuxtLink to="/report-tag"><a-icon type="message" />Par tag</NuxtLink>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="settings-global" @click="closeNavbar">
            <NuxtLink to="/settings/global"><a-icon type="setting" />Options</NuxtLink>
          </a-menu-item>
        </a-menu>
      </a-drawer>
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on } from 'shuutils'
import { Navbar } from '~/models'
import { NAVBAR, NAVBAR_TOGGLE_MENU } from '~/plugins'
const DEFAULT_MENU = 'dashboard'
export default Vue.extend({
  data() {
    return {
      current: [DEFAULT_MENU],
      open: false,
      navbarSettings: {} as Navbar,
    }
  },
  beforeMount() {
    this.current = [this.$route.name || DEFAULT_MENU]
    on(NAVBAR, (settings: Navbar) => (this.navbarSettings = settings))
    on(NAVBAR_TOGGLE_MENU, () => (this.open = !this.open))
  },
  methods: {
    closeNavbar() {
      this.open = false
    },
  },
})
</script>

<style>
.app {
  display: flex;
  flex-flow: column;
  overflow: hidden;
  height: 100%;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}

.drawer {
  z-index: 2;
}
</style>
