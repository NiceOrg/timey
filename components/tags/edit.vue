<template>
  <div class="comp-tag-edit">
    <a-form :form="form" layout="inline" @submit="updateTag">
      <a-form-item :label="$t('global.name')">
        <a-input
          v-decorator="['name', { rules: [{ required: true, message: $t('settings.tags-edition.input-tag-name') }] }]"
          size="small"
          :placeholder="$t('settings.tags-edition.tag-name')"
        />
      </a-form-item>
      <a-form-item :label="$t('global.color')">
        <a-button icon="redo" :style="tagStyling" @click="newTag.color = generateRandomColor()" />
      </a-form-item>
      <div class="tag-edit-submit">
        <a-button type="primary" html-type="submit"> {{ $t('global.save') }}</a-button>
        <a-button @click="close()">{{ $t('global.cancel') }}</a-button>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { Tag } from '~/models'
import { CLOSE_CONTENT, TAG_EDITION_UPDATE } from '~/plugins'
import { generateRandomColor } from '~/utils'

export default Vue.extend({
  props: {
    tag: {
      default: () => new Tag(),
      type: Tag,
      required: true,
    },
  },
  data() {
    return {
      newTag: new Tag(this.tag.id, this.tag.name, this.tag.color),
      form: this.$form.createForm(this, { name: 'tagForm' }),
      generateRandomColor,
    }
  },
  computed: {
    tagStyling(): Record<string, string> {
      return { background: this.newTag.color, color: this.newTag.isColorBright() ? 'black' : 'white' }
    },
  },
  mounted() {
    this.form.setFieldsValue({ name: this.newTag.name })
  },
  methods: {
    updateTag(event: Event) {
      event.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          const tag = new Tag(this.tag.id, values.name, this.newTag.color)
          emit(TAG_EDITION_UPDATE, tag)
          this.close()
        }
      })
    },
    close() {
      emit(CLOSE_CONTENT)
    },
  },
})
</script>

<style>
.comp-tag-edit .ant-row {
  margin-bottom: 0;
}

.tag-edit-color {
  width: 6rem;
}
</style>
