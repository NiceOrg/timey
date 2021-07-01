<template>
  <div class="comp-languages-flags">
    <div @click="updateLanguage(Languages.fr)">
      <flag iso="fr" />
    </div>
    <div class="space" />
    <div @click="updateLanguage(Languages.en)">
      <flag iso="gb" />
    </div>
  </div>
</template>

<script lang="ts">
import { Languages } from '~/models'
export default {
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
}
</script>

<style>
.comp-languages-flags {
  display: flex;
  font-size: 2rem;
  width: 100%;
  margin-left: 1rem;
}

.space {
  margin-left: 0.5rem;
}
</style>
