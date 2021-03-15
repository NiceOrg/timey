<template>
  <a-layout>
    <a-layout-header><header-bar :header-data="header.title" @setHeader="header.title="/></a-layout-header>
    <a-layout-content><Nuxt /></a-layout-content>
    <a-layout-footer></a-layout-footer>
  </a-layout>
</template>

<style scoped>
.ant-layout-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(){
    return{
      header: {
        title:'test1',
      }
    }
  },
  methods:{
    setHeader(title:string){
      this.header.title=title;
    }
  }
})
</script>