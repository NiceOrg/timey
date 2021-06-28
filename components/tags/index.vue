<template>
  <div class="comp-tag">
    <div class="tag-infos">
      <div class="tag-infos-name" :style="{ background: tag.color }">
        <span :style="{ background: tag.color, color: tag.isColorBright() ? 'black' : 'white' }">{{ tag.name }}</span>
      </div>
      <div class="tag-infos-menu">
        <div v-if="showEdit" class="tag-edit" @click="showEdit = !showEdit">{{ $t('global.edit') }}</div>
        <div class="tag-delete" @click="deleteTag(tag)">{{ $t('global.delete') }}</div>
      </div>
    </div>
    <tags-edit v-if="!showEdit" class="tag-edit" :tag="tag" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on } from 'shuutils'
import { Tag } from '~/models'
import { CLOSE_CONTENT } from '~/plugins'
import { tagsPlugin } from '~/plugins/tags.client'
export default Vue.extend({
  props: {
    tag: Tag,
  },
  data() {
    return {
      tags: [] as Tag[],
      tagsPlugin,
      showEdit: true,
    }
  },
  beforeMount() {
    on(CLOSE_CONTENT, () => (this.showEdit = true))
  },
  methods: {
    deleteTag(tag: Tag) {
      tagsPlugin.delete(tag)
    },
  },
})
</script>

<style>
.comp-tag {
  font-weight: 500;
  font-size: 1rem;
}

.tag-infos {
  display: flex;
}

.tag-infos-name {
  display: inline;
  padding: 0.2rem 0.6rem;
  border-radius: 1.2rem;
}

.tag-infos-menu {
  margin-left: auto;
  margin-right: 0.8rem;
}

.tag-edit,
.tag-delete {
  display: inline;
}

.tag-edit {
  margin-top: 0.6rem;
}

.tag-edit-submit {
  display: block;
}

.ant-form-item-label {
  padding: 0;
}
</style>
