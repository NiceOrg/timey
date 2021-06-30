<template>
  <div class="comp-filters">
    <a-button v-if="tags.length > 0" class="filters" @click="showModal = true">{{ $t('global.filter-tags') }}</a-button>
    <a-modal v-model="showModal" :title="$t('global.filter-tags')" :footer="null">
      <a-input v-model="tagSearched" class="search font" type="text" :placeholder="$t('filters.search-tag')" />
      <a-list class="list" item-layout="horizontal" :data-source="filteredTagList">
        <a-list-item slot="renderItem" slot-scope="tag" @click="updateFilteredTag(tag)">
          <a-list-item-meta>
            <a slot="title" class="name font">{{ tag.name }}</a>
            <a-avatar slot="avatar" size="large" :style="{ background: tag.color }" />
          </a-list-item-meta>
          <div v-if="isTagChecked(tag)"><a-icon type="check" /></div>
        </a-list-item>
      </a-list>
    </a-modal>
    <div class="all-avatar ellipsis">
      <div v-for="tag in filters.tags" :key="tag.id" class="avatar">
        <div class="avatar-name" :style="{ background: tag.color }" @click="updateFilteredTag(tag)">
          <span :style="{ background: tag.color, color: tagColor(tag.color) ? 'black' : 'white' }">{{ tag.name }} <a-icon type="close" /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Filters, Tag } from '~/models'
import { emit, on } from '~/node_modules/shuutils/dist/src'
import { FILTERS_GET, FILTERS_SEND, TAG_GET, TAG_SEND, FILTERED_TAG_DELETE, FILTERED_TAG_ADD } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      showModal: false,
      filters: {} as Filters,
      tags: [] as Tag[],
      tagSearched: '',
    }
  },
  computed: {
    filteredTagList(): Tag[] {
      return this.tags.filter((tag: Tag) => tag.name.toLowerCase().includes(this.tagSearched.toLowerCase()))
    },
  },
  beforeMount() {
    on(TAG_SEND, (tags: Tag[]) => (this.tags = tags))
    on(FILTERS_SEND, (filters: Filters) => (this.filters = filters))
    emit(TAG_GET)
    emit(FILTERS_GET)
  },
  methods: {
    tagColor(color: string) {
      return new Tag(0, '', color).isColorBright()
    },
    updateFilteredTag(tag: Tag) {
      if (this.isTagChecked(tag)) {
        emit(FILTERED_TAG_DELETE, tag)
        return
      }
      emit(FILTERED_TAG_ADD, tag)
    },
    isTagChecked(tag: Tag) {
      return (this.filters.tags as Tag[]).find((t: Tag) => t.id === tag.id) !== undefined
    },
  },
})
</script>

<style scoped>
.filters {
  margin: 0.5rem 0 0 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-dark, lightblue);
}

.tag-filter {
  display: inline;
}

.filter {
  margin-left: 1rem;
  font-size: 1rem;
}

.all-avatar {
  padding: 0.5rem 1.2rem;
}

.avatar {
  display: inline;
  padding-right: 0.5rem;
}

.avatar-name {
  display: inline;
  padding: 0.2rem 0.6rem;
  border-radius: 1.2rem;
}

.list {
  overflow: auto;
  padding-right: 0.5rem;
  height: 12rem;
}

.name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.search {
  height: 2.5rem;
  box-shadow: 0 0 0.2rem;
  z-index: 1;
}

.font {
  font-weight: 500;
  font-size: 1rem;
  color: var(--dark-gray-blue, gray);
}

.no-tags-message {
  text-align: center;
}
</style>
