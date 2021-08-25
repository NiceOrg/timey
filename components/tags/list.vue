<template>
  <div class="comp-tag" @click="stopPropagation($event)">
    <a-popover trigger="click" :placement="edit ? 'bottom' : 'bottomRight'" arrow-point-at-center>
      <a slot="content">
        <a-input v-model="tagSearched" class="tag-input font" type="text" :placeholder="$t('settings.tags-edition.add-new-tag')" />
        <a-list class="tag-list" item-layout="horizontal" :data-source="filteredTagList">
          <a-list-item slot="renderItem" slot-scope="tag" @click="edit ? changeTagsEditMode(tag) : changeTags(tag)">
            <a-list-item-meta>
              <a slot="title" class="ellipsis font">{{ tag.name }}</a>
              <a-avatar slot="avatar" size="large" :style="{ background: tag.color }" />
            </a-list-item-meta>
            <div v-if="edit ? isTagCheckedEditMode(tag) : isTagChecked(tag)"><a-icon type="check" /></div>
          </a-list-item>
        </a-list>
        <div class="tag-options">
          <div v-if="showCreateTag" class="font wrap-overflow" @click="edit ? addTagEditMode() : addTag()">
            {{ $t('dashboard.create-new-tag') }} '{{ tagSearched }}'
          </div>
          <NuxtLink :to="localePath('/tags-edition')"
            ><div class="font">{{ $t('dashboard.edit-tags') }}</div></NuxtLink
          >
        </div>
      </a>
      <div v-if="edit">
        <a-icon v-if="!firstTagEditMode" type="plus" />
        <a-avatar v-else class="tag-logo font" :style="tagStylingEditMode"> {{ firstTagEditMode.name.charAt(0).toUpperCase() }}</a-avatar>
      </div>
      <div v-else>
        <a-icon v-if="!firstTag" type="plus" />
        <a-avatar v-else class="tag-logo font" :style="tagStyling"> {{ firstTag.name.charAt(0).toUpperCase() }}</a-avatar>
      </div>
    </a-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Tag, Task } from '~/models'
import { generateRandomColor, stopPropagation } from '~/utils'
import { TAG_ADD, TAG_GET, TAG_LIST, TAG_SEND, TASK_ADD_TAG, TASK_DELETE_TAG } from '~/plugins'

export default Vue.extend({
  props: {
    task: {
      default: () => new Task(),
      type: Task,
      required: true,
    },
    edit: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      tags: [] as Tag[],
      tagSearched: '',
      stopPropagation,
      tagsSelected: [] as Tag[],
    }
  },
  computed: {
    firstTag(): Tag | undefined {
      return this.tags.find((tag: Tag) => tag.id === this.task.tags[0]?.id)
    },
    firstTagEditMode(): Tag | undefined {
      return this.tags.find((tag: Tag) => tag.id === this.tagsSelected[0]?.id)
    },
    tagStyling(): Record<string, string> {
      return this.firstTag ? { background: this.firstTag.color, color: this.firstTag.isColorBright() ? 'black' : 'white' } : {}
    },
    tagStylingEditMode(): Record<string, string> {
      return this.firstTagEditMode
        ? { background: this.firstTagEditMode.color, color: this.firstTagEditMode.isColorBright() ? 'black' : 'white' }
        : {}
    },
    filteredTagList(): Tag[] {
      return this.tags.filter((tag: Tag) => tag.name.toLowerCase().includes(this.tagSearched.toLowerCase()))
    },
    showCreateTag(): boolean {
      return !(this.tags.some((tag) => tag.name === this.tagSearched) || this.tagSearched === '')
    },
  },
  beforeMount() {
    on(TAG_SEND, (tags: Tag[]) => (this.tags = tags))
    emit(TAG_GET)
    this.tagsSelected = [...this.task.tags]
  },
  methods: {
    changeTags(tag: Tag) {
      this.isTagChecked(tag) ? emit(TASK_DELETE_TAG, { task: this.task, tag }) : emit(TASK_ADD_TAG, { task: this.task, tag })
    },
    isTagChecked(tag: Tag) {
      return this.task.tags.some((t: Tag) => t.id === tag.id)
    },
    addTag() {
      const tag = new Tag(-1, this.tagSearched, generateRandomColor())
      emit(TAG_ADD, tag)
      emit(TASK_ADD_TAG, { task: this.task, tag })
      this.tagSearched = ''
    },
    addTagEditMode() {
      const tag = new Tag(-1, this.tagSearched, generateRandomColor())
      emit(TAG_ADD, tag)
      this.tagsSelected.push(tag)
      emit(TAG_LIST, this.tagsSelected)
      this.tagSearched = ''
    },
    changeTagsEditMode(tag: Tag) {
      this.isTagCheckedEditMode(tag) ? this.tagsSelected.splice(this.tagsSelected.indexOf(tag), 1) : this.tagsSelected.push(tag)
      emit(TAG_LIST, this.tagsSelected)
    },
    isTagCheckedEditMode(tag: Tag) {
      return this.tagsSelected.some((t: Tag) => t.id === tag.id)
    },
  },
})
</script>

<style scoped>
.tag-list {
  border-bottom: 0.1rem solid var(--accent, gray);
  overflow: auto;
  padding-right: 0.5rem;
  height: 12rem;
}

.tag-logo {
  box-shadow: 0 0 0.2rem var(--font-color-primary, black);
}

.tag-input {
  height: 2.2rem;
  box-shadow: 0 0 0.2rem;
  z-index: 1;
}

.font {
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--primary, gray);
}

.tag-options {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wrap-overflow {
  overflow-wrap: anywhere;
}
</style>
