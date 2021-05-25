<template>
  <div class="comp-tag">
    <div class="tag-infos">
      <div class="tag-infos-name" :style="{ background: tag.color }">
        <span :style="{ background: tag.color, color: tag.isColorBright() ? 'black' : 'white' }">{{ tag.name }}</span>
      </div>
      <div class="tag-infos-menu">
        <div v-if="showEdit" class="tag-edit" @click="showEdit = !showEdit">Edit</div>
        <div class="tag-delete" @click="deleteTag(tag)">Delete</div>
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
  font-size: 12px;
}

.tag-infos {
  display: flex;
}

.tag-infos-name {
  display: inline;
  padding: 2px 10px;
  border-radius: 20px;
}

.tag-infos-menu {
  margin-left: auto;
  margin-right: 15px;
}

.tag-edit,
.tag-delete {
  display: inline;
}

.tag-edit {
  margin-top: 10px;
}

.tag-edit-color {
  width: 100px;
}

.tag-edit-submit {
  display: block;
}

.ant-form-item-label {
  padding: 0;
}
</style>
