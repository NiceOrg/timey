<template>
  <div class="comp-language">
    <div class="selection bold" @click="updateLanguage(Languages.fr)"><input v-model="language" :value="Languages.fr" type="radio" /> Français</div>
    <br />
    <div class="selection bold" @click="updateLanguage(Languages.en)"><input v-model="language" :value="Languages.en" type="radio" /> English</div>
  </div>
</template>

<script lang="ts">
import { emit, on } from 'shuutils'
import Vue from 'vue'
import { Languages, Parameters } from '~/models'
import { PARAMETERS_GET, PARAMETERS_SEND } from '~/plugins'
import { parametersPlugin } from '~/plugins/parameters/parameters.client'
export default Vue.extend({
  data() {
    return {
      language: Languages.fr as Languages,
      Languages,
    }
  },
  beforeMount() {
    on(PARAMETERS_SEND, (parameters: Parameters) => {
      this.language = parameters.language
    })
    emit(PARAMETERS_GET)
  },
  methods: {
    updateLanguage(languageUpdated: Languages) {
      this.language = languageUpdated
      parametersPlugin.updateLanguage(this.language)
      this.$router.push(this.switchLocalePath(languageUpdated))
    },
  },
})
</script>

<style>
.selection {
  font-size: 1.3rem;
}
</style>
