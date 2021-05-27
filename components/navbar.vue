<template>
  <div class="comp-navbar">
    <div v-if="!searchBar" class="navigation">
      <a-button v-show="!settings.backButton" class="navbar-button" @click="emit(NAVBAR_TOGGLE_MENU)">
        <a-icon :type="open ? 'menu-unfold' : 'menu-fold'" />
      </a-button>
      <a-button v-show="settings.backButton" class="navbar-button" @click="() => $router.go(-1)">
        <a-icon type="caret-left" />
      </a-button>
      <h2 class="top-title">{{ settings.title }}</h2>
      <a-icon v-show="settings.isSearch" type="search" class="search-buton" @click="searchBar = true" />
      <div v-show="!settings.isSearch" />
    </div>
    <div v-if="searchBar" class="search">
      <a-icon type="arrow-left" class="return-arrow" @click="closeSearchBar()" />
      <a-input v-model="filter" type="text" class="input-filter" placeholder="Rechercher une tâche" @change="emit(NAVBAR_SEARCH, filter)"></a-input>
      <div v-show="settings.isSearch" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Navbar } from '../models/'
import { NAVBAR_TOGGLE_MENU, NAVBAR_SEARCH } from '~/plugins'

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
      NAVBAR_SEARCH,
      emit,
      searchBar: false,
      filter: '',
    }
  },
  methods: {
    closeSearchBar() {
      this.searchBar = false
      this.filter = ''
      this.emit(NAVBAR_SEARCH, this.filter)
    },
  },
})
</script>

<style scoped>
.navbar-button {
  margin: 0 0 0 0.5rem;
  color: var(--primary, grey);
  border-color: var(--primary, grey);
}

.comp-navbar {
  padding: 0.5rem 0 0.5rem 0;
  box-shadow: 0.1rem -0.1rem 0.4rem;
  z-index: 3;
}

.navigation {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.search {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.search-buton {
  margin-right: 1rem;
  font-size: 1.7rem;
}

.input-filter {
  font-size: 1.3rem;
  font-weight: 500;
  width: 80%;
}

.return-arrow {
  margin: 0 0.5rem;
  font-size: 1.6rem;
}
</style>
