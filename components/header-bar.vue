<template>
  <div class="head">
    <div class="title">{{ headerData }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props:{
    headerData:String
  }
})
</script>