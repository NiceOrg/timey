<template>
  <div class="page-settings">
    <div class="parameter highlight" @click="$router.push(localePath('/settings/time-slots'))">
      <div class="flex heading">
        <div><a-icon type="clock-circle" /> {{ $t('global.time-slots') }}</div>
        <div class="switch" @click="stopPropagation($event)">
          <a-switch :checked="timeSlots.isActive" size="small" @change="changeTimeSlots" />
        </div>
      </div>
      <p>{{ $t('settings.time-slots-submessage') }}</p>
    </div>
    <div class="parameter" @click="$router.push(localePath('/tags-edition'))">
      <div class="heading"><a-icon type="tag" /> {{ $t('settings.tags-edition.tags-edition') }}</div>
      <p>{{ $t('settings.tag-edition-submessage') }}</p>
    </div>
    <a-popconfirm :title="$t('settings.data-export-confirmation-message')" ok-text="Oui" cancel-text="Non" @confirm="exportPlugin.downloadCSV()">
      <div class="parameter highlight">
        <div class="heading"><a-icon type="database" /> {{ $t('settings.data-export') }}</div>
        <p>{{ $t('settings.export-data-submessage') }}</p>
      </div>
    </a-popconfirm>
    <div class="parameter" @click="showLanguages = true">
      <div class="heading"><a-icon type="global" /> {{ $t('global.language') }}</div>
      <p>{{ $t('settings.change-application-language') }}</p>
      <a-modal v-model="showLanguages" :title="$t('settings.select-language')" :footer="null">
        <language v-if="showLanguages" />
      </a-modal>
    </div>
    <div v-if="connected" class="parameter highlight" @click="$router.push(localePath('/update-account'))">
      <div class="flex heading">{{ $t('settings.manage-account') }}</div>
      <p>{{ $t('settings.manage-account-submessage') }}</p>
    </div>
    <div v-if="!connected" class="parameter highlight" @click="$router.push(localePath('/'))">
      <div class="flex heading">{{ $t('global.connection') }}</div>
      <p>{{ $t('global.sign-in') }}</p>
    </div>
    <div v-if="connected" class="parameter" @click="disconnects">
      <div class="flex heading">{{ $t('global.disconnect') }}</div>
      <p>{{ $t('global.log-out') }}</p>
    </div>
    <div class="about heading">{{ $t('global.about') }}</div>
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
  font-weight: 500;
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

.highlight {
  background: var(--accent-light, gray);
}

.about {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}
</style>
