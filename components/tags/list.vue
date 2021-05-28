<template>
  <div class="comp-tag" @click="stopPropagation($event)">
    <a-popover trigger="click" placement="bottomRight" arrow-point-at-center>
      <a slot="content">
        <a-input v-model="tagSearched" class="tag-input font" type="text" placeholder="filter tags" />
        <a-list class="tag-list" item-layout="horizontal" :data-source="filteredTagList">
          <a-list-item slot="renderItem" slot-scope="item" @click="updateTaskTags(item)">
            <a-list-item-meta>
              <a slot="title" class="ellipsis font">{{ item.name }}</a>
              <a-avatar slot="avatar" size="large" :style="{ background: item.color }" />
            </a-list-item-meta>
            <div v-if="isTagChecked(item)"><a-icon type="check" /></div>
          </a-list-item>
        </a-list>
        <div class="tag-options">
          <div v-if="showCreateTag" class="font wrap-overflow" @click="addTag()">Créer nouveau tag '{{ tagSearched }}'</div>
          <NuxtLink to="/tags-edition"><div class="font">Éditer les tags</div></NuxtLink>
        </div>
      </a>
      <a-icon v-if="firstTag === undefined" type="plus" />
      <a-avatar v-else class="tag-logo font" :style="tagStyling"> {{ firstTag.name.charAt(0).toUpperCase() }}</a-avatar>
    </a-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { on, emit } from 'shuutils'
import { Tag, Task } from '~/models'
import { stopPropagation } from '~/utils'
import { tagsPlugin, TAG_ADD, TAG_GET, TAG_SEND, TASK_ADD_TAG, TASK_DELETE_TAG } from '~/plugins'

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
      const tag = new Tag(-1, this.tagSearched, tagsPlugin.generateRandomColor())
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
