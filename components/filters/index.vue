<template>
  <div class="comp-filters">
    <div class="filters" @click="showFilters = !showFilters"><a-icon :rotate="90" class="filter-icon" type="control" /> FILTRES</div>
    <div v-show="showFilters" class="filters-list">
      <div class="filter">
        <div class="tag-filter" :style="tagFiltered" @click="tagShow = true">Tag</div>
        <a-icon v-if="filters.tags.length > 0" type="close" @click="removeTags()" />
      </div>
      <a-modal v-model="tagShow" title="Filtrer les tags" :footer="null">
        <filters-tags v-if="tagShow" :tags-filtered="filters.tags" />
      </a-modal>
    </div>
    <div class="divider">
      <a-divider />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Filters } from '~/models'
import { emit, on } from '~/node_modules/shuutils/dist/src'
import { FILTERS_GET, FILTERS_SEND, FILTERED_TAG_DELETE_ALL } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      tagShow: false,
      showFilters: false,
      filters: {} as Filters,
    }
  },
  computed: {
    tagFiltered(): any {
      if (this.filters.tags.length > 0) {
        return { fontWeight: 800 }
      }
      return { fontWeight: 400 }
    },
  },
  beforeMount() {
    on(FILTERS_SEND, (filters: Filters) => (this.filters = filters))
    emit(FILTERS_GET)
  },
  methods: {
    removeTags() {
      emit(FILTERED_TAG_DELETE_ALL)
      this.tagShow = false
      this.showFilters = false
    },
  },
})
</script>

<style>
.filters {
  margin: 0.5rem 0 0 1rem;
  font-size: 18px;
  font-weight: 500;
  color: var(--dark-blue);
}

.divider {
  margin-top: 0.5rem;
}

.tag-filter {
  font-family: 'Source Serif Pro';
  display: inline;
}

.filter {
  margin-left: 1rem;
  font-size: 17px;
}
</style>
