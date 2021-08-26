<template>
  <div class="comp-speech-recognition">
    <a-icon type="audio" @click="showDrawer" />
    <a-drawer :title="$t('dashboard.speak-to-interact')" placement="bottom" :closable="false" :visible="visible" @close="onClose">
      <!--TODO : add a button to start record and show if mic is on/off -->
      <div v-for="(request, index) in requests" :key="index" class="discussion overflow">
        <p class="from-me">{{ request.sentence }}</p>
        <p class="from-them">{{ request.response }}</p>
      </div>
      <div class="discussion-footer" />
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { sleep } from 'shuutils'
import Vue from 'vue'
import { SpeechRequest } from '~/models'
import { speechToTextPlugin, STT_RESULT, analysis } from '~/plugins'
import { off, on } from '~/utils'
export default Vue.extend({
  data() {
    return {
      visible: false,
      requests: [] as SpeechRequest[],
    }
  },
  beforeMount() {
    on(STT_RESULT, this.onSTTResult)
  },
  beforeDestroy() {
    off(STT_RESULT, this.onSTTResult)
  },
  methods: {
    showDrawer() {
      this.visible = true
      speechToTextPlugin.start()
    },
    onClose() {
      analysis.reset()
      this.visible = false
      speechToTextPlugin.end('closed drawer')
    },
    async onSTTResult(event: CustomEvent): Promise<void> {
      const request = event.detail
      let response = ''
      try {
        response = speechToTextPlugin.executeIntents(request.sentence)
      } catch (error) {
        response = error.message
      }
      this.requests.push({ sentence: request.sentence, response })
      await sleep(100)
      document.querySelector('.discussion-footer')?.scrollIntoView()
    },
  },
})
</script>

<style scoped>
.listening {
  text-align: center;
}

.discussion-footer {
  height: 3rem;
}

.overflow {
  overflow-y: auto;
}
</style>
