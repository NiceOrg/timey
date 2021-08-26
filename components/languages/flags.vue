<template>
  <div class="comp-languages-flags">
    <img src="~assets/icons/fr.svg" @click="updateLanguage(Languages.fr)" />
    <img src="~assets/icons/en.svg" @click="updateLanguage(Languages.en)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Languages } from '~/models'
export default Vue.extend({
  data() {
    return {
      Languages,
    }
  },
  methods: {
    updateLanguage(languageUpdated: Languages) {
      this.$router.push(this.switchLocalePath(languageUpdated))
    },
  },
})
</script>

<style>
.comp-languages-flags {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: 5rem;
  align-self: flex-start;
}

.comp-languages-flags img {
  display: inline-block;
  height: 100%;
}
</style>
