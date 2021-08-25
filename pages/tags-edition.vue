<template>
  <div class="tags">
    <div class="tags-filter">
      <a-input v-model="filter" type="text" :placeholder="$t('global.filter-tags')" />
    </div>
    <div class="tags-add">
      <a-button class="accent-light" @click="showNewTag = !showNewTag"> {{ $t('settings.tags-edition.add-new-tag') }} </a-button>
    </div>
    <tags-edit v-if="showNewTag" :tag="newTag" />
    <div class="table">
      <div class="table-header">{{ tags.length }} {{ $tc('global.tag', tags.length) }}</div>
      <tags v-for="tag in filteredTagList" :key="tag.id" class="table-body" :tag="tag" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Navbar, Tag } from '~/models'
import { TAG_SEND, TAG_GET, tagsPlugin, NAVBAR_SETTINGS, TAG_EDITION_UPDATE, CLOSE_CONTENT } from '~/plugins'

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
      if (this.filter.length === 0) return this.tags
      return this.tags.filter((tag: Tag) => tag.name.toLowerCase().includes(this.filter.toLowerCase()))
    },
  },
  beforeMount() {
    on(TAG_SEND, (tags: Tag[]) => (this.tags = [...tags]))
    on(TAG_EDITION_UPDATE, (tag: Tag) => tagsPlugin.update(tag))
    on(CLOSE_CONTENT, () => (this.showNewTag = false))
    emit(TAG_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('settings.tags-edition.tags-edition').toString(), backButton: true }))
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
  background-color: var(--secondary-light, gray);
  border: 0.1rem solid var(--accent, gray);
  border-radius: 0.3rem;
  margin: 0.3rem 0.7rem 1.4rem 0.7rem;
  padding: 0.7rem;
}

.tags-filter {
  display: inline-block;
  margin: 0.6rem 0 0.6rem 0.6rem;
  width: 50%;
}
</style>
