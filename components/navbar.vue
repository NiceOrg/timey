<template>
  <div class="comp-navbar">
    <div class="top-menu">
      <a-button v-show="!settings.isSetting" class="navbar-button" @click="$emit('toggleContent')">
        <a-icon :type="open ? 'menu-unfold' : 'menu-fold'" />
      </a-button>
      <a-button v-show="settings.isSetting" class="navbar-button" @click="() => $router.go(-1)">
        <a-icon type="caret-left" />
      </a-button>
      <h2 class="top-title">{{ settings.title }}</h2>
      <div class="top-right"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Navbar } from '../models/'

export default Vue.extend({
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    settings: {
      type: Navbar,
      default: undefined,
    },
  },
})
</script>

<style scoped>
.navbar-button {
  margin: 0 0 0 0.5rem;
  color: var(--dark-gray-blue, grey);
  border-color: var(--dark-gray-blue, grey);
  box-shadow: 1px 1px 4px;
}

.menu {
  width: 100%;
}

.comp-navbar {
  padding: 0.5rem 0 0.5rem 0;
  box-shadow: 1px -1px 6px;
  z-index: 3;
}

.top-menu {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.drawer {
  z-index: 3000;
}
</style>
