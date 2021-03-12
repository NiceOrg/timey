<template>
  <div class="page-dashboard">
    <a-popover v-model="visible" trigger="click">
      <a slot="content" @click="hide"
        ><NuxtLink to="/task">Create new task</NuxtLink></a
      >
      <a slot="content" @click="hide"
        ><NuxtLink to="/category">Create new category</NuxtLink></a
      >
      <a-button type="primary"> <a-icon type="plus" /> </a-button>
    </a-popover>
  </div>
</template>

<script>
export default {
  layout:'app-layout',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    hide() {
      console.log(111);
      this.visible = false;
    },
  },
}
</script>

<style>
</style>