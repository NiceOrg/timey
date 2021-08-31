<template>
  <div class="page-settings">
    <div class="parameter highlight" @click="$router.push(localePath('/settings/time-slots'))">
      <div class="flex heading bold">
        <div><a-icon type="clock-circle" /> {{ $t('global.time-slots') }}</div>
        <div class="switch" @click="stopPropagation($event)">
          <a-switch :checked="timeSlots.isActive" size="small" @change="changeTimeSlots" />
        </div>
      </div>
      <p>{{ $t('settings.time-slots-submessage') }}</p>
    </div>
    <div class="parameter highlight" @click="$router.push(localePath('/tags-edition'))">
      <div class="heading bold"><a-icon type="tag" /> {{ $t('settings.tags-edition.tags-edition') }}</div>
      <p>{{ $t('settings.tag-edition-submessage') }}</p>
    </div>
    <a-popconfirm
      :title="$t('settings.data-export-confirmation-message')"
      :ok-text="$t('global.yes')"
      :cancel-text="$t('global.no')"
      @confirm="exportPlugin.downloadCSV()"
    >
      <div class="parameter highlight">
        <div class="heading bold"><a-icon type="database" /> {{ $t('settings.data-export') }}</div>
        <p>{{ $t('settings.export-data-submessage') }}</p>
      </div>
    </a-popconfirm>
    <div class="parameter highlight" @click="showLanguages = true">
      <div class="heading bold"><a-icon type="global" /> {{ $t('global.language') }}</div>
      <p>{{ $t('settings.change-application-language') }}</p>
      <a-modal v-model="showLanguages" :title="$t('settings.select-language')" :footer="null">
        <languages v-if="showLanguages" />
      </a-modal>
    </div>
    <div v-if="connected" class="parameter highlight" @click="$router.push(localePath('/update-account'))">
      <div class="heading bold"><a-icon type="tool" /> {{ $t('settings.manage-account') }}</div>
      <p>{{ $t('settings.manage-account-submessage') }}</p>
    </div>
    <div v-if="!connected" class="parameter highlight" @click="$router.push(localePath('/'))">
      <div class="heading bold"><a-icon type="user" /> {{ $t('global.connection') }}</div>
      <p>{{ $t('global.sign-in') }}</p>
    </div>
    <div v-if="connected" class="parameter highlight" @click="disconnects">
      <div class="heading bold"><a-icon type="disconnect" /> {{ $t('global.disconnect') }}</div>
      <p>{{ $t('global.log-out') }}</p>
    </div>
    <a-popconfirm
      :title="$t('settings.delete-data-confirmation-message')"
      :ok-text="$t('global.yes')"
      :cancel-text="$t('global.no')"
      @confirm="deleteData"
    >
      <div v-if="!connected" class="parameter highlight">
        <div class="heading bold"><a-icon type="delete" /> {{ $t('settings.delete-data') }}</div>
        <p>{{ $t('settings.delete-data-submessage') }}</p>
      </div>
    </a-popconfirm>
    <div class="about">
      <a-button class="heading bold" @click="$router.push(localePath('/settings/about'))">{{ $t('global.about') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { stopPropagation } from '~/utils'
import { timeSlotsPlugin, exportPlugin, NAVBAR_SETTINGS, authenticationPlugin, userPlugin } from '~/plugins'
import { Navbar, TimeSlots } from '~/models'

export default Vue.extend({
  data() {
    return {
      timeSlots: {} as TimeSlots,
      stopPropagation,
      exportPlugin,
      showLanguages: false,
      connected: false,
      userPlugin,
      aboutCount: 0,
    }
  },
  beforeMount() {
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('global.settings').toString() }))
    this.connected = authenticationPlugin.get().authenticated
    this.timeSlots = timeSlotsPlugin.getTimeSlots()
  },
  methods: {
    changeTimeSlots(value: boolean) {
      timeSlotsPlugin.activate(value)
    },
    async disconnects() {
      authenticationPlugin.disconnect()
      await userPlugin.load()
      this.$router.push(this.localePath('/'))
    },
    async deleteData() {
      await this.userPlugin.delete()
    },
    timmy() {
      this.aboutCount++
      if (this.aboutCount === 10) {
        this.aboutCount = 0
        const audio = new Audio('timmy.wav')
        audio.play()
      }
    },
  },
})
</script>

<style>
.parameter {
  padding-left: 1rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}

.heading {
  align-items: center;
}

.parameter > p {
  margin-bottom: 0;
}

.flex {
  display: flex;
}

.switch {
  margin-left: auto;
  margin-right: 1rem;
}

.highlight:nth-child(2n + 1) {
  background: var(--accent-light, gray);
}

.about {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}
</style>
