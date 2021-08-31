<template>
  <div class="about-page">
    <div class="section">
      <span class="bold">{{ $tc('global.promoter', 2) }} : </span>Inetum
    </div>
    <div class="section">
      <span class="bold">{{ $tc('global.contributor', 2) }} : </span>
      <div class="entry">
        <div v-for="(contributor, index) in contributorList" :key="index">
          <a-popover>
            <template slot="content">
              <p>{{ contributor[1] }}</p>
            </template>
            <span>{{ contributor[0] }} <a-icon type="mail" /></span>
          </a-popover>
        </div>
      </div>
    </div>
    <div class="section">
      <span class="bold" @click="timmy">{{ $t('global.license') }} : </span> {{ license }}
    </div>
    <div class="section"><span class="bold" @click="timmy">Version : </span> {{ version }}</div>
    <div class="section center">
      <a-button @click="showFeedback = true">{{ $t('global.feedback') }}</a-button>
      <a-modal v-model="showFeedback" :title="$t('global.feedback')" :footer="null">
        <feedback v-if="showFeedback" />
      </a-modal>
    </div>
    <div class="section center">
      <span class="bold">{{ $tc('global.dependency', 2) }} :</span>
    </div>
    <div class="dependencies">
      <a target="_blank" href="https://www.antdv.com/">
        <div class="dependency block">
          <div class="bold">ant-design-vue</div>
          <div>An enterprise-class UI design language and Vue-based implementation.</div>
        </div>
      </a>
      <a target="_blank" href="https://www.chartjs.org">
        <div class="dependency block">
          <div class="bold">chart.js</div>
          <div>Simple HTML5 charts using the canvas element.</div>
        </div>
      </a>
      <a target="_blank" href="https://github.com/date-fns/date-fns#readme">
        <div class="dependency block">
          <div class="bold">date-fns</div>
          <div>Modern JavaScript date utility library.</div>
        </div>
      </a>
      <a target="_blank" href="https://eslint.org">
        <div class="dependency block">
          <div class="bold">eslint</div>
          <div>An AST-based pattern checker for JavaScript.</div>
        </div>
      </a>
      <a target="_blank" href="http://fusejs.io">
        <div class="dependency block">
          <div class="bold">fuse.js</div>
          <div>Lightweight fuzzy-search.</div>
        </div>
      </a>
      <a target="_blank" href="https://mochajs.org/">
        <div class="dependency block">
          <div class="bold">mocha</div>
          <div>Simple, flexible, fun test framework.</div>
        </div>
      </a>

      <a target="_blank" href="https://github.com/airbnb/lottie-web#readme">
        <div class="dependency block">
          <div class="bold">lottie-web</div>
          <div>After Effects plugin for exporting animations to SVG + JavaScript or canvas + JavaScript.</div>
        </div>
      </a>
      <a target="_blank" href="https://nodemon.io">
        <div class="dependency block">
          <div class="bold">nodemon</div>
          <div>Simple monitor script for use during development of a node.js app.</div>
        </div>
      </a>
      <a target="_blank" href="https://github.com/nuxt/nuxt.js#readme">
        <div class="dependency block">
          <div class="bold">nuxt</div>
          <div>A minimalistic framework for server-rendered Vue.js applications (inspired by Next.js).</div>
        </div>
      </a>
      <a target="_blank" href="https://istanbul.js.org/">
        <div class="dependency block">
          <div class="bold">nyc</div>
          <div>the Istanbul command line interface.</div>
        </div>
      </a>
      <a target="_blank" href="https://prettier.io">
        <div class="dependency block">
          <div class="bold">prettier</div>
          <div>Prettier is an opinionated code formatter.</div>
        </div>
      </a>
      <a target="_blank" href="https://github.com/Shuunen/repo-checker">
        <div class="dependency block">
          <div class="bold">repo-check</div>
          <div>Repo cleaning made easy.</div>
        </div>
      </a>
      <a target="_blank" href="https://github.com/Shuunen/shuutils#readme">
        <div class="dependency block">
          <div class="bold">shuutils</div>
          <div>Utils collection.</div>
        </div>
      </a>
      <a target="_blank" href="https://stylelint.io">
        <div class="dependency block">
          <div class="bold">stylelint</div>
          <div>A mighty, modern CSS linter.</div>
        </div>
      </a>
      <a target="_blank" href="https://typestrong.org/ts-node">
        <div class="dependency block">
          <div class="bold">ts-node</div>
          <div>TypeScript execution environment and REPL for node.js, with source map support.</div>
        </div>
      </a>
      <a target="_blank" href="https://www.typescriptlang.org/">
        <div class="dependency block">
          <div class="bold">typescript</div>
          <div>TypeScript is a language for application scale JavaScript development.</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { emit, on } from 'shuutils'
import Vue from 'vue'
import { version, contributors, license } from '../../package.json'
import { Navbar } from '../../models'
import { CLOSE_CONTENT, NAVBAR_SETTINGS } from '../../plugins'

export default Vue.extend({
  data() {
    return {
      version,
      license,
      versionCount: 0,
      contributors,
      contributorList: [] as any[],
      showFeedback: false,
    }
  },
  beforeMount() {
    on(CLOSE_CONTENT, () => (this.showFeedback = false))

    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('global.about').toString(), backButton: true }))
    this.parseContributors(this.contributors)
  },
  methods: {
    parseContributors(contributors: string[]) {
      for (const contributor of contributors) this.contributorList.push(contributor.replace('>', '').split('<'))
    },
    timmy() {
      this.versionCount++
      if (this.versionCount === 10) {
        this.versionCount = 0
        const audio = new Audio('../timmy.wav')
        audio.play()
      }
    },
  },
})
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.section {
  margin-top: 1rem;
  margin-left: 1rem;
}

.entry {
  display: inline-grid;
}

.center {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.dependencies {
  height: 100%;
  overflow-x: auto;
  margin: 0 0.5rem;
}

.dependency {
  border: 0.1rem solid var(--secondary, black);
  background-color: aliceblue<;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
