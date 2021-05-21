<template>
  <div class="page-dashboard">
    <tasksList />
    <div class="footer">
      <div class="comp-task-add">
        <a-button class="button-add" shape="circle" icon="plus" @click="showEdit = true" />
        <a-modal v-model="showEdit" title="Ajouter une tâche" :footer="null">
          <tasksEdit v-if="showEdit" />
        </a-modal>
      </div>
      <div class="foot" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Navbar } from '~/models'
import { NAVBAR, CLOSE_CONTENT } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      showEdit: false,
    }
  },
  beforeMount() {
    emit(NAVBAR, new Navbar({ title: 'Dashboard', isSearch: true }))
    on(CLOSE_CONTENT, () => (this.showEdit = false))
  },
})
</script>

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

.comp-task-add {
  position: absolute;
  bottom: 1rem;
  left: 44%;
}

.button-add {
  box-shadow: 0px 0px 8px;
  color: grey;
  width: 60px;
  height: 60px;
}

.footer {
  z-index: 1;
}
</style>
