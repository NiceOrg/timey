<template>
  <div class="comp-navbar">
    <div class="top-menu">
      <a-button v-show="!settings.isSetting" class="navbar-button" @click="emit(NAVBAR_TOGGLE_MENU)">
        <a-icon :type="open ? 'menu-unfold' : 'menu-fold'" />
      </a-button>
      <a-button v-show="settings.isSetting" class="navbar-button" @click="() => $router.go(-1)">
        <a-icon type="caret-left" />
      </a-button>
      <h2 class="top-title">{{ settings.title }}</h2>
      <a-icon v-show="settings.isSearch" type="search" class="search-buton" @click="$emit('toggleContent')" />
      <div v-show="!settings.isSearch" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Navbar } from '../models/'
import { NAVBAR_TOGGLE_MENU } from '~/plugins'

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
  data() {
    return {
      NAVBAR_TOGGLE_MENU,
      emit,
    }
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

.search-buton {
  margin-right: 1rem;
  font-size: 25px;
}
</style>
