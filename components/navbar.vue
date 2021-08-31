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
      <div class="navbar-right-buttons">
        <a-icon v-show="settings.isSearch" type="search" class="search-buton" @click="searchBar = true" />
        <div @click="stopPropagation($event)">
          <a-popover v-model="visibleAccountParams" trigger="click" placement="bottomRight" arrow-point-at-center>
            <a slot="content" @click="visibleAccountParams = false">
              <p v-if="authentication.authenticated" class="account-param separator">
                <NuxtLink :to="localePath('/update-account')">{{ $t('user-account.manage-account') }}</NuxtLink>
              </p>
              <p class="account-param" @click="disconnect">{{ authentication.authenticated ? $t('global.log-out') : $t('global.sign-in') }}</p>
            </a>
            <a-avatar v-if="authentication.authenticated" shape="square">
              <div class="user-icon bold">{{ authentication.email.charAt(0).toUpperCase() }}</div>
            </a-avatar>
            <a-avatar v-else shape="square" icon="user" size="large" />
          </a-popover>
        </div>
      </div>
    </div>
    <div v-if="searchBar" class="search">
      <a-icon type="arrow-left" class="return-arrow" @click="closeSearchBar()" />
      <a-input
        v-model="filter"
        auto-focus
        class="input-filter bold"
        :placeholder="$t('dashboard.search-task')"
        @change="emit(NAVBAR_SEARCH, filter)"
      ></a-input>
      <div v-show="settings.isSearch" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Authentication, Navbar } from '../models/'
import { NAVBAR_TOGGLE_MENU, NAVBAR_SEARCH, authenticationPlugin, userPlugin, AUTHENTICATION_SEND, AUTHENTICATION_GET } from '~/plugins'
import { stopPropagation } from '~/utils'

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
      stopPropagation,
      authentication: {} as Authentication,
      visibleAccountParams: false,
    }
  },
  beforeMount() {
    this.closeSearchBar()
    on(AUTHENTICATION_SEND, (authentication: Authentication) => (this.authentication = authentication))
    emit(AUTHENTICATION_GET)
  },
  methods: {
    closeSearchBar() {
      this.searchBar = false
      this.filter = ''
      this.emit(NAVBAR_SEARCH, this.filter)
    },
    async disconnect() {
      authenticationPlugin.disconnect()
      await userPlugin.load()
      this.$router.push(this.localePath('/'))
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
  width: 80%;
}

.return-arrow {
  margin: 0 0.5rem;
  font-size: 1.6rem;
}

.navbar-right-buttons {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.account-param {
  padding: 0.3rem;
  text-align: center;
}

.separator {
  border-bottom: 0.1rem solid var(--accent-light, lightgray);
}

.user-icon {
  font-size: 1.7rem;
}
</style>
