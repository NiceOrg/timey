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
import { on, sleep } from 'shuutils'
import Vue from 'vue'
import { AnalyseError, SpeechRequest } from '~/models'
import { speechToTextPlugin, STT_RESULT, analyse } from '~/plugins'
export default Vue.extend({
  data() {
    return {
      visible: false,
      requests: [] as SpeechRequest[],
    }
  },
  beforeMount() {
    on(STT_RESULT, (request: SpeechRequest) => {
      let response = ''
      try {
        response = speechToTextPlugin.execute(request.sentence)
      } catch (error) {
        response = error.message
        if (error instanceof AnalyseError) this.restartRecognition()
      }
      this.requests.push({ sentence: request.sentence, response })
    })
  },
  methods: {
    showDrawer() {
      this.visible = true
      this.startRecognition()
    },
    onClose() {
      this.stopRecognition()
      analyse.resetAnalyse()
      this.visible = false
    },
    async startRecognition() {
      await sleep(200)
      speechToTextPlugin.start()
    },
    stopRecognition() {
      speechToTextPlugin.end()
    },
    restartRecognition() {
      this.stopRecognition()
      this.startRecognition()
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