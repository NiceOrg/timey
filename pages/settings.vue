<template>
  <div class="page-option">
    <h1>Settings</h1>
    <img v-show="src.length > 0" :src="src" alt="loule" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

const endpoint = '/breeds/image/random'

export default Vue.extend({
  data() {
    return {
      src: '',
    }
  },
  async created() {
    // TODO : utiliser plutôt https://fr.nuxtjs.org/docs/2.x/features/data-fetching/
    const response = await fetch(process.env.api + endpoint)
    const { message } = await response.json()
    this.src = message
  },
})
</script>

<style scoped>
img {
  width: 100%;
}
</style>
