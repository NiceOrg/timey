<template>
  <div class="comp-filter-tags">
    <a-input v-model="tagSearched" class="tag-input font" type="text" placeholder="filtrer tags" />
    <a-list class="tag-list" item-layout="horizontal" :data-source="filteredTagList">
      <a-list-item slot="renderItem" slot-scope="item" @click="updateFilteredTag(item)">
        <a-list-item-meta>
          <a slot="title" class="tag-name font">{{ item.name }}</a>
          <a-avatar slot="avatar" size="large" :style="{ background: item.color }" />
        </a-list-item-meta>
        <div v-if="isTagChecked(item)"><a-icon type="check" /></div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Tag } from '~/models'
import { FILTERED_TAG_ADD, FILTERED_TAG_DELETE, TAG_GET, TAG_SEND } from '~/plugins'

export default Vue.extend({
  props: {
    tagsFiltered: {
      default: () => [],
      type: Array,
      required: true,
    },
  },
  data() {
    return {
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
    emit(TAG_GET)
  },
  methods: {
    updateFilteredTag(tag: Tag) {
      if (this.isTagChecked(tag)) {
        emit(FILTERED_TAG_DELETE, tag)
        return
      }
      emit(FILTERED_TAG_ADD, tag)
    },
    isTagChecked(tag: Tag) {
      return (this.tagsFiltered as Tag[]).find((t: Tag) => t.id === tag.id) !== undefined
    },
  },
})
</script>

<style scoped>
.tag-list {
  border-bottom: 0.1rem solid #e8e8e8;
  overflow: auto;
  padding-right: 0.5rem;
  height: 12rem;
}

.tag-name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 1px;
}

.tag-input {
  height: 40px;
  box-shadow: 0 0 2px;
  z-index: 1;
}

.font {
  font-weight: 500;
  font-size: 20px;
  color: var(--dark-gray-blue, gray);
}
</style>
