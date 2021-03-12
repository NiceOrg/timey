<template>
  <div class="navbar">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="dashboard">
        <NuxtLink to="/dashboard"><a-icon type="home" />Dashboard</NuxtLink>
      </a-menu-item>
      <a-menu-item key="chatbot">
        <NuxtLink to="/chatbot"><a-icon type="message" />chatbot</NuxtLink>
      </a-menu-item>
      <a-menu-item key="options">
        <NuxtLink to="/settings"><a-icon type="setting" />Settings</NuxtLink>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: ['dashboard'],
    };
  },
};
</script>

<style>
a {
  text-decoration: none;
  color: inherit;
}

.navbar {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>