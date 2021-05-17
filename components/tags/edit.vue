<template>
  <div class="comp-tag-edit">
    <a-form :form="form" layout="inline" @submit="updateTag">
      <a-form-item label="Name">
        <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input a tag name!' }] }]" size="small" placeholder="tag name" />
      </a-form-item>
      <a-form-item label="Color">
        <a-button icon="redo" size="small" :style="tagStyling" @click="changeColor(newTag)" />
        <a-input v-decorator="['color']" class="tag-edit-color" size="small" placeholder="color" />
      </a-form-item>
      <div class="tag-edit-submit">
        <a-button type="primary" html-type="submit">Save</a-button>
        <a-button @click="close()">Cancel</a-button>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag } from '~/models'
import { tagsPlugin } from '~/plugins/tags.client'

export default Vue.extend({
  props: {
    tag: Tag,
  },
  data() {
    return {
      newTag: new Tag(this.tag.id, this.tag.name, this.tag.color),
      form: this.$form.createForm(this, { name: 'tagForm' }),
    }
  },
  computed: {
    tagStyling(): any {
      return { background: this.newTag.color, color: this.newTag.isColorBright() ? 'black' : 'white' }
    },
  },
  mounted() {
    this.form.setFieldsValue({ name: this.newTag.name, color: this.newTag.color })
  },
  methods: {
    updateTag(event: Event) {
      event.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          const tag = new Tag(this.tag.id, values.name, values.color)
          this.$emit('updateTag', tag)
          this.close()
        }
      })
    },
    changeColor(tag: Tag) {
      tag.color = tagsPlugin.generateRandomColor()
      this.form.setFieldsValue({ color: this.newTag.color })
    },
    close() {
      this.$emit('closeContent')
    },
  },
})
</script>

<style>
.comp-tag-edit .ant-row {
  margin-bottom: 0;
}
</style>
