<template>
  <div class="comp-tag" @click="stopPropagation($event)">
    <a-popover trigger="click" placement="leftTop">
      <a slot="content">
        <a-input v-model="tagSearched" type="text" placeholder="filter tags" /> <br />
        <a-list class="tag-list" item-layout="horizontal" :data-source="filteredTagList">
          <a-list-item slot="renderItem" slot-scope="item" @click="updateTaskTags(item)">
            <a-list-item-meta>
              <a slot="title">{{ item.name }}</a>
              <a-avatar slot="avatar" :style="{ background: item.color }" />
            </a-list-item-meta>
            <div v-if="isTagChecked(item)"><a-icon type="check" /></div>
          </a-list-item>
        </a-list>
        <span v-if="showCreateTag" @click="addTag()">Créer nouveau tag '{{ tagSearched }}'<br /></span>
        <span>Éditer les tags</span>
      </a>
      <a-icon v-if="firstTag === undefined" type="plus" />
      <a-avatar v-else class="tag-logo" size="small" :style="tagStyling"> {{ firstTag.name.charAt(0).toUpperCase() }}</a-avatar>
    </a-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Tag } from '~/models/tag.model'
import { Task } from '~/models/task.model'
import { stopPropagation } from '~/utils/event'
import { TAG_ADD, TAG_GET, TAG_SEND } from '~/plugins/tags.client'
import { TASK_ADD_TAG, TASK_DELETE_TAG } from '~/plugins/tasks.client'

export default Vue.extend({
  props: {
    task: {
      default: () => new Task(),
      type: Task,
      required: true,
    },
  },
  data() {
    return {
      tags: [] as Tag[],
      tagSearched: '',
      stopPropagation,
    }
  },
  computed: {
    firstTag(): Tag | undefined {
      return this.tags.find((tag: Tag) => tag.id === this.task.tags[0]?.id)
    },
    tagStyling(): any {
      return { background: this.firstTag!.color, color: this.firstTag!.isColorBright() ? 'black' : 'white' }
    },
    filteredTagList(): Tag[] {
      return this.tags.filter((tag: Tag) => tag.name.toLowerCase().includes(this.tagSearched.toLowerCase()))
    },
    showCreateTag(): boolean {
      if (this.tags.some((tag) => tag.name === this.tagSearched) || this.tagSearched === '') {
        return false
      }
      return true
    },
  },
  beforeMount() {
    on(TAG_SEND, (tags: Tag[]) => (this.tags = tags))
    emit(TAG_GET)
  },
  methods: {
    updateTaskTags(tag: Tag) {
      const task = this.task
      if (this.isTagChecked(tag)) {
        emit(TASK_DELETE_TAG, { task, tag })
      } else {
        emit(TASK_ADD_TAG, { task, tag })
      }
    },
    isTagChecked(tag: Tag) {
      if (this.task.tags.find((t: Tag) => t.id === tag.id) !== undefined) {
        return true
      }
      return false
    },
    addTag() {
      const tag = new Tag(-1, this.tagSearched)
      const task = this.task
      emit(TAG_ADD, tag)
      emit(TASK_ADD_TAG, { task, tag })
      this.tagSearched = ''
    },
  },
})
</script>

<style scoped>
.tag-list {
  border-bottom: 0.1rem solid #e8e8e8;
  overflow: auto;
  padding-right: 0.5rem;
  height: 10.5rem;
}

.tag-logo {
  font-weight: 500;
}
</style>
