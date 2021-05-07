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
import { TimeSlots } from '~/models/parameters/time-slots.model'
import { timeSlotsPlugin, TIME_SLOT_GET, TIME_SLOT_SEND } from '~/plugins/parameters/time-slots.client'
import { hours, minutes } from '~/utils/time'

export default Vue.extend({
  layout: 'settings',
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
    emit('parameter-name', this.timeSlots.name)
    this.pauseTimeStamp = this.getTimeStamps(this.timeSlots.pause)
    this.resumeTimeStamp = this.getTimeStamps(this.timeSlots.resume)
  },
  methods: {
    save() {
      this.timeSlots.pause = this.setTimers(this.pauseTimeStamp)
      this.timeSlots.resume = this.setTimers(this.resumeTimeStamp)
      timeSlotsPlugin.update(this.timeSlots)
    },
    getTimeStamps(data: number[]) {
      const returnValue = [] as string[]
      for (const time of data) {
        returnValue.push(hours(time) + 'h' + minutes(time))
      }
      return returnValue
    },
    setTimers(timeStamps: string[]) {
      const returnValue = [] as number[]
      for (const time of timeStamps) {
        const [hours, minutes] = time.split('h')
        returnValue.push((Number(hours) * 3600 + Number(minutes) * 60) * 1000)
      }
      return returnValue
    },
  },
})
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}

.input {
  text-align: center;
  width: 4.5rem;
}
</style>
