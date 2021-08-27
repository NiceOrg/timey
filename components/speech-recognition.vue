<template>
  <div class="comp-speech-recognition">
    <a-icon type="audio" @click="showDrawer" />
    <a-drawer
      class="speech-recognition-drawer"
      :title="$t('dashboard.speak-to-interact')"
      placement="bottom"
      :closable="false"
      :destroy-on-close="true"
      :visible="visible"
      @close="closeDrawer"
    >
      <div class="toggle-mic" @click="toggleRecognition()" />
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
import lottie, { AnimationItem } from 'lottie-web/build/player/lottie'
import { SpeechRequest } from '~/models'
import { speechToTextPlugin, STT_RESULT, STT_END, analysis } from '~/plugins'
import { off, on } from '~/utils'
export default Vue.extend({
  data() {
    return {
      visible: false,
      started: false,
      requests: [] as SpeechRequest[],
      micAnimation: {} as AnimationItem,
    }
  },
  beforeMount() {
    on(STT_RESULT, this.onSTTResult)
    on(STT_END, this.onEnd)
  },
  beforeDestroy() {
    off(STT_RESULT, this.onSTTResult)
    off(STT_END, this.onEnd)
  },
  methods: {
    async showDrawer() {
      this.visible = true
      await sleep(10)
      this.micAnimation = this.loadAnimation()
      this.toggleRecognition()
    },
    closeDrawer() {
      analysis.reset()
      this.visible = false
      speechToTextPlugin.end()
    },
    toggleRecognition() {
      this.started = !this.started
      if (this.started) {
        this.micAnimation.play()
        speechToTextPlugin.start()
      } else {
        this.micAnimation.stop()
        speechToTextPlugin.end()
      }
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
    onEnd() {
      this.started = false
      this.micAnimation.stop()
    },
    loadAnimation() {
      const container = document.querySelector('.toggle-mic')
      if (!container) throw new Error('The element toggle-mic was not found')
      return lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'microphone.json',
      })
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

.toggle-mic {
  position: absolute;
  top: 0;
  width: 3.5rem;
  height: 3.5rem;
  right: 0.4rem;
}
</style>
