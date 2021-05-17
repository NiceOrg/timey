<template>
  <div class="app">
    <a-page-header class="comp-settings-navbar" :title="name" @back="() => $router.go(-1)"> </a-page-header>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on } from 'shuutils'
import { PARAMETER_NAME } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      name: '',
    }
  },
  created() {
    on(PARAMETER_NAME, (name: string) => {
      this.name = name
    })
  },
})
</script>

<style>
.comp-settings-navbar {
  top: 0;
  border: 0.1rem solid rgb(235, 237, 240);
}

.comp-settings-navbar.ant-page-header {
  margin: unset;
  padding: unset;
}

.comp-settings-navbar .ant-page-header-heading-title {
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 576px) {
  .ant-page-header-heading-extra {
    float: right;
    display: unset;
    width: unset;
    padding-top: unset;
  }
}
</style>
