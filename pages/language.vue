<template>
  <div class="page-languages">
    <nuxt-link class="selection" :to="switchLocalePath('fr')">Francais</nuxt-link>
    <nuxt-link class="selection" :to="switchLocalePath('en')">English</nuxt-link>
  </div>
</template>

<script lang="ts">
import { emit } from 'shuutils'
import Vue from 'vue'
import { Navbar } from '~/models'
import { NAVBAR_SETTINGS } from '~/plugins'
export default Vue.extend({
  beforeMount() {
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('settings.select-language').toString(), backButton: true }))
  },
})
</script>

<style scoped>
.page-languages {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selection {
  color: var(--font-color-primary, black);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 3rem;
}
</style>
