<template>
  <div class="page-dashboard">
    <tasksList />
    <div class="footer">
      <!-- Will be changed in next MR -->
      <task-add />
      <div class="foot" />
    </div>
  </div>
</template>

<style scoped>
.no-bullets {
  list-style-type: none;
}

.page-dashboard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  height: inherit;
}

.foot {
  height: 3rem;
  width: 100%;
  border-top: 1px var(--dark-gray-blue, grey);
  box-shadow: 1px -1px 4px;
}

.footer {
  z-index: 1;
}
</style>
