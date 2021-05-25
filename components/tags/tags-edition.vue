<template>
  <div class="tags">
    <div class="tags-filter">
      <a-input v-model="filter" type="text" placeholder="filter tags" />
    </div>
    <div class="tags-add">
      <a-button type="primary" @click="showNewTag = !showNewTag">Add new tag </a-button>
    </div>
    <tags-edit v-if="showNewTag" :tag="newTag" />
    <div class="tags-table">
      <div class="tags-table-header">
        <div class="tags-table-header-title">{{ tags.length }} tags</div>
        <div class="tags-table-header-sort">Sort</div>
      </div>
      <tags-tag v-for="tag in filteredTagList" :key="tag.id" :tag="tag" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Navbar, Tag } from '~/models'
import { TAG_SEND, TAG_GET, tagsPlugin, TAG_EDITION_UPDATE, CLOSE_CONTENT, NAVBAR } from '~/plugins'

export default Vue.extend({
  data() {
    return {
      tags: [] as Tag[],
      tagsPlugin,
      filter: '',
      newTag: new Tag() as Tag,
      showNewTag: false,
    }
  },
  computed: {
    filteredTagList(): Tag[] {
      if (this.filter.length === 0) {
        return this.tags
      }
      return this.tags.filter((tag: Tag) => tag.name.toLowerCase().includes(this.filter.toLowerCase()))
    },
  },
  beforeMount() {
    on(TAG_SEND, (tags: Tag[]) => (this.tags = [...tags]))
    on(TAG_EDITION_UPDATE, (tag: Tag) => tagsPlugin.update(tag))
    on(CLOSE_CONTENT, () => (this.showNewTag = false))
    emit(TAG_GET)
    emit(NAVBAR, new Navbar({ title: 'Édition des tags', backButton: true }))
  },
})
</script>

<style>
.tags {
  overflow-y: auto;
}

.tags-add {
  display: inline;
}

.tags > .comp-tag-edit {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 14px;
  margin: 5px 10px 20px 10px;
  padding: 10px 10px;
}

.tags-filter {
  display: inline-block;
  margin: 10px 0px 10px 10px;
  width: 50%;
}

.tags-table {
  margin: 5px 10px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.tags-table-header {
  display: flex;
  font-size: 14px;
  background-color: #f6f8fa;
  padding: 10px 0;
}

.tags-table-header-title {
  padding-left: 15px;
  font-weight: 600;
}

.tags-table-header-sort {
  margin-left: auto;
  margin-right: 15px;
}

.tags-table > .comp-tag {
  border-top: 1px solid #e1e4e8;
  padding: 15px 0 15px 15px;
}
</style>
