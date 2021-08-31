<template>
  <div class="comp-feedback">
    <div v-if="!sent">
      <div class="foreword bold">
        <p>{{ $t('settings.about.feedback-message') }}</p>
      </div>
      <a-form :form="form" layout="inline" class="block" @submit="send">
        <a-form-item>
          <a-input v-decorator="['feedback']" type="textarea" auto-focus />
        </a-form-item>
        <div class="tag-edit-submit block">
          <a-button class="accent-light" html-type="submit"> {{ $t('global.send') }}</a-button>
          <a-button @click="close()">{{ $t('global.cancel') }}</a-button>
        </div>
      </a-form>
    </div>
    <div v-else>
      <div class="foreword bold">{{ $t('settings.about.feedback-thanks') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { CLOSE_CONTENT } from '~/plugins'
import { Feedback } from '~/models'
import { feedbackService } from '~/services'

export default Vue.extend({
  data() {
    return {
      form: this.$form.createForm(this, { name: 'feedbackForm' }),
      sent: false,
    }
  },
  mounted() {
    this.form.setFieldsValue({ feedback: '' })
  },
  methods: {
    close() {
      emit(CLOSE_CONTENT)
    },
    send(event: Event) {
      event.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          feedbackService.add(new Feedback({ feedback: values.feedback }))
          this.sent = true
        }
      })
    },
  },
})
</script>

<style scoped>
.foreword {
  text-align: justify;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
