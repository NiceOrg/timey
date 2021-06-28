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
            <NuxtLink :to="localePath('/dashboard')"><a-icon type="home" />{{ $t('global.dashboard') }}</NuxtLink>
          </a-menu-item>
          <a-sub-menu>
            <span slot="title" class="submenu-title-wrapper"><a-icon type="message" />{{ $t('global.report') }}</span>
            <a-menu-item key="report-task" @click="closeNavbar">
              <NuxtLink :to="localePath('/report-task')"><a-icon type="message" />{{ $t('reports.task.by task') }}</NuxtLink>
            </a-menu-item>
            <a-menu-item key="report-tag" @click="closeNavbar">
              <NuxtLink :to="localePath('/report-tag')"><a-icon type="message" />{{ $t('reports.tag.by tag') }}</NuxtLink>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="settings" @click="closeNavbar">
            <NuxtLink :to="localePath('/settings')"><a-icon type="setting" />{{ $t('global.settings') }}</NuxtLink>
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
import { NAVBAR_SETTINGS, NAVBAR_TOGGLE_MENU } from '~/plugins'

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
    this.navbarSettings = new Navbar({})
    this.current = [this.$route.name || DEFAULT_MENU]
    on(NAVBAR_SETTINGS, (settings: Navbar) => (this.navbarSettings = settings))
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
