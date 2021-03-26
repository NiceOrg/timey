<template>
  <div class="comp-tag" @click="stopPropagation($event)">
    <a-popover trigger="click" placement="leftTop">
      <a slot="content"> <a-input v-model="search" type="text" placeholder="filter tags" /> <br /></a>
      <a slot="content">
        <a-list class="tag-list" item-layout="horizontal" :data-source="filteredTagList">
          <a-list-item slot="renderItem" slot-scope="item" @click="updateTagToTask(item)">
            <a-list-item-meta>
              <a slot="title">{{ item.name }}</a>
              <a-avatar slot="avatar" :style="{ background: item.color }" />
            </a-list-item-meta>
            <div v-if="item.taskList.includes(task.id)"><a-icon type="check" /></div>
          </a-list-item>
        </a-list>
      </a>
      <a v-if="showCreateTag" slot="content" @click="addTag()">create new tag '{{ search }}'<br /></a>
      <a slot="content">Edit tags</a>
      <a-icon type="plus" />
    </a-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag } from '~/models/tag.model'
import { Task } from '~/models/task.model'
import { tagsService } from '~/services/tags.service'
import { stopPropagation } from '~/utils/event'

export default Vue.extend({
  props: {
    task: Task,
  },
  data() {
    return {
      tagList: [],
      search: '',
      stopPropagation,
    }
  },
  computed: {
    filteredTagList() {
      return this.tagList.filter((tag: Tag) => {
        return tag.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    showCreateTag() {
      if (this.tagList.some((tag) => tag.name === this.search) || this.search === '') return false
      return true
    },
  },
  mounted() {
    this.tagList = tagsService.getTags()
    this.detectTagChanges()
  },
  methods: {
    updateTagToTask(tag: Tag) {
      if (!tagsService.removeIDFromTasklist(tag, this.task)) tagsService.addIDToTasklist(tag, this.task)
    },
    isTagChecked(tag: Tag) {
      if (tag.taskList.includes(this.task.id)) return true
      return false
    },
    detectTagChanges() {
      window.addEventListener('tags-changed', (event) => {
        this.tagList = event.detail.storage
      })
    },
    addTag() {
      const tag = new Tag(0, this.search, [])
      tagsService.addTag(tag)
      this.updateTagToTask(tag)
      this.search = ''
    },
  },
})
</script>
>

<style>
.ant-list-empty-text {
  display: none;
}
</style>
