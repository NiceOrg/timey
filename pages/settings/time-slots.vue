<template>
  <div class="page-time-slots">
    <p>Définir une plage horaire de pause fixe</p>
    <div class="grid-container">
      <div class="pause">
        Pause
        <a-button type="primary" size="small" @click="pauseTimeStamp.push('00h00')">add</a-button>
        <div v-for="(pause, index) in pauseTimeStamp" :key="'pause' + index">
          <a-input v-model="pauseTimeStamp[index]" class="input" />
          <a-icon type="close" @click="pauseTimeStamp.splice(index, 1)" />
        </div>
      </div>
      <div class="resume">
        Reprise
        <a-button type="primary" size="small" @click="resumeTimeStamp.push('00h00')">add</a-button>
        <div v-for="(resume, index) in resumeTimeStamp" :key="'resume' + index">
          <a-input v-model="resumeTimeStamp[index]" class="input" />
          <a-icon type="close" @click="resumeTimeStamp.splice(index, 1)" />
        </div>
      </div>
    </div>
    <br />
    <a-button type="primary" size="small" @click="save">Save</a-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Navbar, TimeSlots } from '~/models'
import { NAVBAR_SETTINGS, timeSlotsPlugin, TIME_SLOT_GET, TIME_SLOT_SEND } from '~/plugins'
import { hours, minutes } from '~/utils'

export default Vue.extend({
  data() {
    return {
      timeSlots: {} as TimeSlots,
      pauseTimeStamp: [] as string[],
      resumeTimeStamp: [] as string[],
    }
  },
  beforeMount() {
    on(TIME_SLOT_SEND, (timeSlots: TimeSlots) => (this.timeSlots = timeSlots))
    emit(TIME_SLOT_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: 'Plage horaire', backButton: true }))

    this.pauseTimeStamp = this.convertTimestampsToStrings(this.timeSlots.pause)
    this.resumeTimeStamp = this.convertTimestampsToStrings(this.timeSlots.resume)
  },
  methods: {
    save() {
      this.timeSlots.pause = this.convertStringsToTimestamps(this.pauseTimeStamp)
      this.timeSlots.resume = this.convertStringsToTimestamps(this.resumeTimeStamp)
      timeSlotsPlugin.update(this.timeSlots)
    },
    // Convert a list of timestamp to a list of string in format 00h00
    convertTimestampsToStrings(timestamps: number[]) {
      const times = [] as string[]
      for (const timestamp of timestamps) {
        times.push(hours(timestamp) + 'h' + minutes(timestamp))
      }
      return times
    },
    // Convert a list of string in format 00h00 to a list of timestamp
    convertStringsToTimestamps(times: string[]) {
      const timestamps = [] as number[]
      for (const time of times) {
        const [hours, minutes] = time.split('h')
        timestamps.push((Number(hours) * 3600 + Number(minutes) * 60) * 1000)
      }
      return timestamps
    },
  },
})
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}

.input {
  text-align: center;
  width: 4.5rem;
}
</style>
