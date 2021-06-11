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
          <a-menu-item key="settings" @click="closeNavbar">
            <NuxtLink to="/settings"><a-icon type="setting" />Options</NuxtLink>
          </a-menu-item>
        </a-menu>
        <div class="connection drawer" @click="disconnect">{{ connected ? 'Déconnexion' : 'Se connecter' }}</div>
      </a-drawer>
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Authentication, Navbar } from '~/models'
import { NAVBAR, NAVBAR_TOGGLE_MENU, authenticationPlugin, AUTHENTICATION_SEND, AUTHENTICATION_GET, userPlugin } from '~/plugins'

const DEFAULT_MENU = 'dashboard'
export default Vue.extend({
  data() {
    return {
      current: [DEFAULT_MENU],
      open: false,
      navbarSettings: {} as Navbar,
      connected: false,
    }
  },
  beforeMount() {
    this.navbarSettings = new Navbar({})
    this.current = [this.$route.name || DEFAULT_MENU]
    on(NAVBAR, (settings: Navbar) => (this.navbarSettings = settings))
    on(NAVBAR_TOGGLE_MENU, () => (this.open = !this.open))
    on(AUTHENTICATION_SEND, (authentication: Authentication) => (this.connected = authentication.authenticated))

    emit(AUTHENTICATION_GET)
  },
  methods: {
    closeNavbar() {
      this.open = false
    },
    async disconnect() {
      authenticationPlugin.disconnect()
      await userPlugin.load()
      this.$router.push('/')
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

.connection {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--secondary-light, lightgray);
  border-top: 0.1rem solid var(--accent-light, lightgray);
  padding: 0.3rem;
  text-align: center;
  font-family: var(--font-family-submenu, serif);
}
</style>
